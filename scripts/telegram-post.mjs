// Posts one "Tool of the Day" to your Telegram channel, with a button that
// routes through your site's /go/[slug] link — so clicks from Telegram show
// up in your click tracker (see app/go/[slug]/route.ts, lib/kv.ts) exactly
// like clicks from the website.
//
// Run it manually any time:
//   node scripts/telegram-post.mjs
// Or preview today's pick without posting anywhere or needing a bot token:
//   node scripts/telegram-post.mjs --dry-run
// Or let .github/workflows/telegram-daily-post.yml run it automatically,
// once a day, for free (see README "Telegram" section for setup).
//
// Requires two environment variables (see .env.example):
//   TELEGRAM_BOT_TOKEN    — from @BotFather
//   TELEGRAM_CHANNEL_ID   — e.g. "@yourchannel" (bot must be a channel admin)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const DRY_RUN = process.argv.includes("--dry-run");
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

if (!DRY_RUN && (!BOT_TOKEN || !CHANNEL_ID)) {
  console.error(
    "Missing TELEGRAM_BOT_TOKEN and/or TELEGRAM_CHANNEL_ID. Set them in .env.local (local) " +
      "or as repo secrets (GitHub Action) — see README 'Telegram: daily Tool of the Day post'. " +
      "Or run with --dry-run to preview without either."
  );
  process.exit(1);
}

const siteConfig = JSON.parse(fs.readFileSync(path.join(root, "data/site-config.json"), "utf8"));
const products = JSON.parse(fs.readFileSync(path.join(root, "data/products.json"), "utf8"));

// Deterministic "tool of the day": everyone running this script on the same
// calendar day posts the same pick, and it rotates through the whole catalog
// before repeating.
function pickToday(list) {
  const dayNumber = Math.floor(Date.now() / 86_400_000);
  return list[dayNumber % list.length];
}

const product = pickToday(products);
const siteUrl = siteConfig.url.replace(/\/$/, "");
const goLink = `${siteUrl}/go/${product.slug}`;

const text =
  `🛠 *Tool of the Day: ${escapeMarkdown(product.name)}*\n\n` +
  `${escapeMarkdown(product.description)}\n\n` +
  `_Category: ${escapeMarkdown(product.category)}_`;

function escapeMarkdown(s) {
  return String(s).replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

if (DRY_RUN) {
  console.log("--- DRY RUN: would post this message ---\n");
  console.log(text.replace(/\\([_*[\]()~`>#+\-=|{}.!])/g, "$1"));
  console.log(`\n[button] Visit ${product.name} → ${goLink}`);
  process.exit(0);
}

const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chat_id: CHANNEL_ID,
    text,
    parse_mode: "MarkdownV2",
    reply_markup: {
      inline_keyboard: [[{ text: `Visit ${product.name} →`, url: goLink }]],
    },
  }),
});

const data = await res.json();
if (!data.ok) {
  console.error("Telegram API error:", data);
  process.exit(1);
}

console.log(`Posted "${product.name}" to ${CHANNEL_ID} (message id ${data.result.message_id}).`);
