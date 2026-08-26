import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";
import { brokers } from "@/lib/brokers";
import { kv } from "@/lib/kv";

// Every outbound affiliate click routes through here instead of linking
// straight to the tool's site. Three benefits for a beginner:
//   1. Click counts feed the /admin/links dashboard (feature 10).
//   2. If a tool changes its affiliate link, you only update data/products.json —
//      every page that links to /go/that-tool keeps working.
//   3. One place to swap in real analytics (GA4/Plausible/PostHog) if you want more than counts.
// Checks the tool catalog first, then the broker/exchange list (data/brokers.json)
// so both use this same tracked redirect.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug) ?? brokers.find((b) => b.slug === slug);

  if (!product) {
    return NextResponse.redirect(new URL("/", _request.url), 307);
  }

  // Cheap, free click logging: shows up in your Vercel deployment logs
  // (Vercel dashboard -> your project -> Logs), plus a running total in the
  // KV store for the /admin/links dashboard. See README "Track clicks".
  console.log(`[click] ${new Date().toISOString()} ${product.slug} -> ${product.url}`);
  await kv.incr(`clicks:${product.slug}`);

  const destination = new URL(product.url);
  destination.searchParams.set("utm_source", "ai-tool-vault");
  destination.searchParams.set("utm_medium", "affiliate");

  return NextResponse.redirect(destination.toString(), 307);
}
