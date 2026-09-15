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

// Security: Validate the destination URL before redirecting. This prevents
// open-redirect vulnerabilities if product data is ever tampered with or
// contains a malformed URL.
function validateRedirectUrl(urlString: string): URL | null {
  try {
    const url = new URL(urlString);
    // Only allow http: and https: protocols — block javascript:, data:, file:, etc.
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    // Must have a hostname — blocks malformed or relative URLs
    if (!url.hostname) {
      return null;
    }
    return url;
  } catch {
    // Invalid URL format
    return null;
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug) ?? brokers.find((b) => b.slug === slug);

  if (!product) {
    return NextResponse.redirect(new URL("/", _request.url), 307);
  }

  // Validate the destination URL before redirecting (security: prevents open redirect)
  const destination = validateRedirectUrl(product.url);
  if (!destination) {
    // Invalid URL — redirect to homepage instead of potentially malicious target
    console.warn(`[click] Invalid URL for slug "${slug}": ${product.url}`);
    return NextResponse.redirect(new URL("/", _request.url), 307);
  }

  // Cheap, free click logging: shows up in your Vercel deployment logs
  // (Vercel dashboard -> your project -> Logs), plus a running total in the
  // KV store for the /admin/links dashboard. See README "Track clicks".
  console.log(`[click] ${new Date().toISOString()} ${product.slug} -> ${destination.toString()}`);
  await kv.incr(`clicks:${product.slug}`);

  destination.searchParams.set("utm_source", "ai-tool-vault");
  destination.searchParams.set("utm_medium", "affiliate");

  return NextResponse.redirect(destination.toString(), 307);
}