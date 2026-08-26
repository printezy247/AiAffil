import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";

// Every outbound affiliate click routes through here instead of linking
// straight to the tool's site. Two benefits for a beginner:
//   1. One place to swap in real click analytics later (see README "Track clicks").
//   2. If a tool changes its affiliate link, you only update data/products.json —
//      every page that links to /go/that-tool keeps working.
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return NextResponse.redirect(new URL("/", _request.url), 307);
  }

  // Cheap, free click logging: shows up in your Vercel deployment logs
  // (Vercel dashboard -> your project -> Logs). For real analytics, wire up
  // Plausible/GA4/PostHog here instead — see README "Track clicks".
  console.log(`[click] ${new Date().toISOString()} ${product.slug} -> ${product.url}`);

  const destination = new URL(product.url);
  destination.searchParams.set("utm_source", "ai-tool-vault");
  destination.searchParams.set("utm_medium", "affiliate");

  return NextResponse.redirect(destination.toString(), 307);
}
