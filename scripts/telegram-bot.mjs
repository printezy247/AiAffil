// A long-running Telegram bot: free preview of 3 tools, then an "Unlock All"
// button that sells full access via Telegram Stars (Telegram's built-in
// currency for digital goods — no payment processor account needed) and,
// optionally, a card-payment alternative via a Stripe Payment Link.
//
// Unlike scripts/telegram-post.mjs (a one-shot script a GitHub Action can
// run and exit), this one has to stay running continuously to listen for
// messages — it CANNOT run on Vercel (serverless functions don't stay
// running) or as a GitHub Action (those have a job time limit). Run it on
// your own always-on machine, or a small always-on host (Railway, Render,
// a $5 VPS). See docs/telegram-gated-bot/setup-guide.pdf for options.
//
// Run it:
//   node scripts/telegram-bot.mjs
//
// Requires (see .env.example):
//   TELEGRAM_BOT_TOKEN     — same bot as the daily poster (feature 1)
// Optional:
//   TELEGRAM_STARS_PRICE   — how many Stars "unlock all" costs (default 99)
//   STRIPE_PAYMENT_LINK    — adds a "Pay with card" alternative button
//   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN — persist who's unlocked
//     across restarts (without this, unlocks are remembered in a local file
//     that's fine for testing but won't survive redeploys on most hosts)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { kv } from "./lib/kv.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const STARS_PRICE = Number(process.env.TELEGRAM_STARS_PRICE) || 99;
const STRIPE_PAYMENT_LINK = process.env.STRIPE_PAYMENT_LINK;

if (!BOT_TOKEN) {
  console.error("Missing TELEGRAM_BOT_TOKEN. Set it in .env.local — see .env.example.");
  process.exit(1);
}

const siteConfig = JSON.parse(fs.readFileSync(path.join(root, "data/site-config.json"), "utf8"));
const products = JSON.parse(fs.readFileSync(path.join(root, "data/products.json"), "utf8"));
const siteUrl = siteConfig.url.replace(/\/$/, "");
const miniAppUrl = `${siteUrl}/telegram`;

const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function call(method, body) {
  const res = await fetch(`${API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) console.error(`Telegram API error on ${method}:`, data);
  return data;
}

function freePreview(count = 3) {
  return products.filter((p) => p.featured).slice(0, count).length >= count
    ? products.filter((p) => p.featured).slice(0, count)
    : products.slice(0, count);
}

async function handleStart(chatId, userId) {
  const unlocked = await kv.get(`tg:unlocked:${userId}`);

  if (unlocked) {
    await call("sendMessage", {
      chat_id: chatId,
      text: `🔓 Welcome back! You already have full access to all ${products.length} tools.`,
      reply_markup: {
        inline_keyboard: [[{ text: "Open Full Catalog →", web_app: { url: miniAppUrl } }]],
      },
    });
    return;
  }

  const preview = freePreview(3);
  const previewText = preview
    .map((p, i) => `${i + 1}. *${escapeMarkdown(p.name)}* — ${escapeMarkdown(p.description.slice(0, 90))}`)
    .join("\n\n");

  await call("sendMessage", {
    chat_id: chatId,
    text:
      `👋 *Welcome to ${escapeMarkdown(siteConfig.name)}*\n\n` +
      `Here's a free preview — ${preview.length} of ${products.length} AI tools in the catalog:\n\n` +
      `${previewText}\n\n` +
      `Unlock the full catalog to see all ${products.length}, searchable and organized by category\\.`,
    parse_mode: "MarkdownV2",
    reply_markup: {
      inline_keyboard: [
        ...preview.map((p) => [{ text: `Visit ${p.name} →`, url: `${siteUrl}/go/${p.slug}` }]),
        [{ text: `🔓 Unlock All ${products.length} Tools — ${STARS_PRICE}⭐`, callback_data: "unlock_stars" }],
        ...(STRIPE_PAYMENT_LINK
          ? [[{ text: "💳 Pay with card instead", url: `${STRIPE_PAYMENT_LINK}?client_reference_id=${userId}` }]]
          : []),
      ],
    },
  });
}

function escapeMarkdown(s) {
  return String(s).replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

async function handleUnlockStars(callbackQueryId, chatId) {
  await call("answerCallbackQuery", { callback_query_id: callbackQueryId });
  await call("sendInvoice", {
    chat_id: chatId,
    title: "Unlock All Tools",
    description: `Full access to all ${products.length} tools in ${siteConfig.name}, inside the Mini App.`,
    payload: `unlock:${chatId}`,
    provider_token: "", // empty = Telegram Stars, no external payment provider needed
    currency: "XTR",
    prices: [{ label: "Full catalog access", amount: STARS_PRICE }],
  });
}

async function handleSuccessfulPayment(chatId, userId, payment) {
  await kv.set(
    `tg:unlocked:${userId}`,
    JSON.stringify({ unlockedAt: new Date().toISOString(), chargeId: payment.telegram_payment_charge_id })
  );
  await call("sendMessage", {
    chat_id: chatId,
    text: `🎉 Payment received — you're unlocked! All ${products.length} tools are now available.`,
    reply_markup: {
      inline_keyboard: [[{ text: "Open Full Catalog →", web_app: { url: miniAppUrl } }]],
    },
  });
  console.log(`[unlock] user ${userId} paid ${STARS_PRICE} Stars (charge ${payment.telegram_payment_charge_id})`);
}

async function handleUpdate(update) {
  if (update.message?.text === "/start") {
    await handleStart(update.message.chat.id, update.message.from.id);
  } else if (update.message?.successful_payment) {
    await handleSuccessfulPayment(update.message.chat.id, update.message.from.id, update.message.successful_payment);
  } else if (update.pre_checkout_query) {
    // Must answer within 10 seconds or the payment fails.
    await call("answerPreCheckoutQuery", { pre_checkout_query_id: update.pre_checkout_query.id, ok: true });
  } else if (update.callback_query?.data === "unlock_stars") {
    await handleUnlockStars(update.callback_query.id, update.callback_query.message.chat.id);
  }
}

async function pollLoop() {
  let offset = 0;
  console.log(`Bot started. Polling for updates... (Ctrl+C to stop)`);
  console.log(`Unlock price: ${STARS_PRICE} Telegram Stars${STRIPE_PAYMENT_LINK ? " (+ Stripe card option)" : ""}`);
  if (!kv.isPersistent) {
    console.warn("Warning: no Upstash configured — unlock status is stored in a local file only (see .env.example).");
  }

  while (true) {
    try {
      const res = await fetch(`${API}/getUpdates?timeout=30&offset=${offset}`);
      const data = await res.json();
      if (!data.ok) {
        console.error("getUpdates error:", data);
        await new Promise((r) => setTimeout(r, 3000));
        continue;
      }
      for (const update of data.result) {
        offset = update.update_id + 1;
        handleUpdate(update).catch((err) => console.error("Error handling update:", err));
      }
    } catch (err) {
      console.error("Poll error:", err);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

pollLoop();
