import { NextResponse } from "next/server";
import Stripe from "stripe";
import { kv } from "@/lib/kv";

// Only used if you've set up the optional "pay with card" alternative to
// Telegram Stars in the gated bot (scripts/telegram-bot.mjs). When someone
// pays via your Stripe Payment Link, Stripe calls this route, we mark that
// Telegram user as unlocked in the same KV store the bot checks, and send
// them a confirmation directly via the Telegram Bot API — no need for the
// long-polling bot process to be running at that exact moment.
//
// Setup: Stripe Dashboard -> Developers -> Webhooks -> Add endpoint ->
// https://yourdomain.com/api/webhooks/stripe -> events: checkout.session.completed
// -> copy the "Signing secret" into STRIPE_WEBHOOK_SECRET.

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(request: Request) {
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 501 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("missing signature");
    event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const telegramUserId = session.client_reference_id;

    if (telegramUserId) {
      await kv.set(
        `tg:unlocked:${telegramUserId}`,
        JSON.stringify({ unlockedAt: new Date().toISOString(), stripeSessionId: session.id })
      );

      if (TELEGRAM_BOT_TOKEN) {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramUserId,
            text: "🎉 Payment received — you're unlocked! Send /start to open your full catalog access.",
          }),
        });
      }
    } else {
      console.warn("Stripe checkout completed with no client_reference_id — can't map it to a Telegram user.");
    }
  }

  return NextResponse.json({ received: true });
}
