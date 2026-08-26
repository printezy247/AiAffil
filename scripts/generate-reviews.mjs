// Drafts an in-depth review for tools that don't have one yet in
// data/reviews.json, using your own Anthropic API key. Reviews already in
// that file are never overwritten — this only fills in the gaps.
//
// Run it for specific tools:
//   node scripts/generate-reviews.mjs syllaby canva notion
// Or for every tool missing a review (careful — this calls the API once per
// tool, which costs money and takes a while for a big catalog):
//   node scripts/generate-reviews.mjs --all
//
// Requires ANTHROPIC_API_KEY (see .env.example). Get one at
// https://console.anthropic.com
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY. Set it in .env.local — see .env.example.");
  process.exit(1);
}

const args = process.argv.slice(2);
const runAll = args.includes("--all");
const requestedSlugs = args.filter((a) => a !== "--all");

const products = JSON.parse(fs.readFileSync(path.join(root, "data/products.json"), "utf8"));
const reviewsPath = path.join(root, "data/reviews.json");
const reviews = JSON.parse(fs.readFileSync(reviewsPath, "utf8"));

let targets;
if (runAll) {
  targets = products.filter((p) => !reviews[p.slug]);
} else if (requestedSlugs.length > 0) {
  targets = products.filter((p) => requestedSlugs.includes(p.slug));
  const missing = requestedSlugs.filter((s) => !products.some((p) => p.slug === s));
  if (missing.length > 0) console.warn(`Unknown slugs, skipping: ${missing.join(", ")}`);
} else {
  console.log("Usage: node scripts/generate-reviews.mjs <slug> [slug...] | --all");
  console.log(`${products.filter((p) => !reviews[p.slug]).length} tools currently have no review.`);
  process.exit(0);
}

if (targets.length === 0) {
  console.log("Nothing to do — all requested tools already have a review.");
  process.exit(0);
}

const client = new Anthropic();

const PROMPT_TEMPLATE = (product) => `Write a short, honest, in-depth review of the AI/software tool "${product.name}".

What we know about it: ${product.description}
Category: ${product.category}

Write it in the style of a knowledgeable, balanced reviewer — not marketing copy. Structure:
1. What it actually does and who it's really for (1 short paragraph)
2. One genuine strength, explained concretely, not just asserted (1 paragraph)
3. One honest limitation or tradeoff a buyer should know before purchasing (1 paragraph)
4. A one-line "best for" / "not for" verdict

Do not invent specific pricing, specific competitor names, or specific statistics you cannot verify from the description given — write from what's actually known. Keep the whole thing under 220 words. Separate paragraphs with a blank line. Do not include a title or heading, just the body text.`;

for (const product of targets) {
  process.stdout.write(`Generating review for ${product.name}... `);
  try {
    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: PROMPT_TEMPLATE(product) }],
    });
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock) throw new Error("No text in response");

    reviews[product.slug] = {
      title: `${product.name} review: what it's actually good for`,
      body: textBlock.text.trim(),
      generatedAt: new Date().toISOString().slice(0, 10),
    };
    fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2) + "\n");
    console.log("done.");
  } catch (err) {
    console.log(`FAILED: ${err.message}`);
  }
}

console.log(`\nWrote ${targets.length} review(s) to data/reviews.json.`);
