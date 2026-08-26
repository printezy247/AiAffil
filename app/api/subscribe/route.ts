import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";

const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: string;
  try {
    const body = await request.json();
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  // If ConvertKit is configured, that's the source of truth — it also
  // handles the actual drip sequence delivery (see docs/email-capture for
  // how to load the 5-email sequence into a ConvertKit automation).
  if (CONVERTKIT_API_KEY && CONVERTKIT_FORM_ID) {
    const res = await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: CONVERTKIT_API_KEY, email }),
    });
    if (!res.ok) {
      console.error("ConvertKit subscribe failed:", await res.text());
      return NextResponse.json({ error: "Subscription failed, try again" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  }

  // No email provider configured: fall back to storing the address in the
  // KV store so it's not lost — visible/exportable from /admin/links.
  // Note: this does NOT send any emails by itself. Connect a real provider
  // (ConvertKit env vars, or swap this block for Mailchimp/etc.) to
  // actually deliver the drip sequence — see the feature 13 setup guide.
  const existingRaw = await kv.get("subscribers");
  const existing: string[] = existingRaw ? JSON.parse(existingRaw) : [];
  if (!existing.includes(email)) {
    existing.push(email);
    await kv.set("subscribers", JSON.stringify(existing));
  }

  return NextResponse.json({ ok: true });
}
