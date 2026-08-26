// Turns data/parsed-raw.json (the creator's shared list) into a structured,
// categorized catalog at data/products.json + data/products.csv.
//
// Re-run any time you add rows to data/parsed-raw.json:
//   node scripts/build-catalog.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const raw = JSON.parse(fs.readFileSync(path.join(root, "data/parsed-raw.json"), "utf8"));

// --- category rules -------------------------------------------------------
// Checked top-to-bottom; first match wins. Matches against "name description".
const CATEGORY_RULES = [
  ["Faceless Video & Content Automation", /faceless|script.?storm|syllaby|avatar|deep ?fake|heygen|synthesia|pictory|nova ai|munch|submagic|repurpose|\bfliz\b|tella\b|descript|panzoid|render ?forest|wave\.video|video editor|shorts|clips|screen record/i],
  ["Writing, Copywriting & AI Chat", /copywrit|blog post|writesonic|jasper|word ?ai|blaze\.ai|hemingway|rewrite|plagiar|thread|ai sales agent|chatgpt|chat gpt/i],
  ["SEO & Growth Marketing", /\bseo\b|backlink|rank(ed|ing|s)? higher|google maps|domain authority|spyfu|similarweb|semrush|vidiq|tubebuddy|link ?whisper|competitors? website|keyword|metadata/i],
  ["CRM, Sales & Marketing Automation", /\bcrm\b|lead(s)?\b|funnel|voice calling|manychat|zapier|pabbly|axiom\.ai|call.track|live ?chat|chipbot|sales agent|automate your tasks/i],
  ["No-Code Website, App & AI Builders", /vibe cod(e|ing)|micro.?saas|website builder|build(er)? your (own )?(app|website)|replit|\bv0\b|manus|10web|carrd|convert website to app|twinr|clone a competitor/i],
  ["Email, Newsletter & Community", /newsletter|email list|drip campaign|mailchimp|behiiv|beehiiv|icontact|flodesk|feedblitz|podcast/i],
  ["Design, Photo & Brand Assets", /logo|design online|photo editor|remove.*background|headshot|font|thumbnail|canva|watermark|zoom background|icon|vector|upscal/i],
  ["Link-in-Bio & Monetization Pages", /link.?in.?bio|landing page|link in your bio|stan store|beacons|monetize your (social|audience)/i],
  ["Content Strategy, Coaching & Communities", /coaching program|content operating system|go.?to expert|bible study|relationship advice|communication advice|toolbox|agents.*orchestrat/i],
  ["Productivity & Business Ops", /project management|form fill|how.?to guide|notion|clickup|trello|jotform|scribe how|gusto|task ?rabbit|upwork|legiit|appsumo|discount/i],
  ["Research, Reference & Free Utilities", /calculator|cheat ?sheet|summar(y|ize)|text.to.speech|remove vocals|content ideas|find.*supplier|font identif|readab|stock research|course|certificat|username|delete.*account|wifi|image search|customer service|scholarship|coupon|repair guide|competitor pric|slide templates?|pdf|send files|browser|freelanc|resume|website is down|search engine|sound effect|compress|image upscal|space background|recipe|workout|math problem/i],
];

const FALLBACK_CATEGORY = "More Handy AI & Web Tools";

// URLs with these patterns are almost certainly the creator's paid affiliate
// links (short-links, ref codes, partner IDs). Plain top-level domains in the
// back half of the list are free tools with no affiliate program attached.
const AFFILIATE_URL_HINTS = /bit\.ly|\/a\/\d|\?via=|\?am_id=|austinarmstrong|aff_|partnerlinks|invitation\/|refer\/|utm_medium=influencer|\/austina|socialtypro/i;

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function categorize(item) {
  const haystack = `${item.name} ${item.description}`;
  for (const [category, pattern] of CATEGORY_RULES) {
    if (pattern.test(haystack)) return category;
  }
  return FALLBACK_CATEGORY;
}

// --- dedupe by slug, preferring the fuller record --------------------------
const bySlug = new Map();
for (const item of raw) {
  const slug = slugify(item.name);
  if (!slug) continue;
  const existing = bySlug.get(slug);
  if (!existing || (item.description || "").length > (existing.description || "").length) {
    bySlug.set(slug, item);
  }
}

// Preserve hand-edits (featured flag, tweaked category/description) across
// re-runs by merging onto whatever already exists in data/products.json.
const existingPath = path.join(root, "data/products.json");
const existingBySlug = new Map();
if (fs.existsSync(existingPath)) {
  for (const p of JSON.parse(fs.readFileSync(existingPath, "utf8"))) {
    existingBySlug.set(p.slug, p);
  }
}

const fromRaw = [...bySlug.values()].map((item) => {
  const slug = slugify(item.name);
  const prev = existingBySlug.get(slug);
  return {
    slug,
    name: item.name.replace(/\s*\(.*?\)\s*$/, "").trim() || item.name,
    url: item.url,
    description: prev?.description ?? (item.description || "No description provided yet — edit data/products.json to add one."),
    category: prev?.category ?? categorize(item),
    isAffiliateLink: AFFILIATE_URL_HINTS.test(item.url),
    featured: prev?.featured ?? false,
    dateAdded: prev?.dateAdded ?? "2026-08-26",
  };
});

// Products added by hand (e.g. via scripts/add-product.mjs) that don't come
// from data/parsed-raw.json at all — keep them, don't let a rebuild drop them.
const rawSlugs = new Set(fromRaw.map((p) => p.slug));
const handAdded = [...existingBySlug.values()].filter((p) => !rawSlugs.has(p.slug));

const products = [...fromRaw, ...handAdded]
  .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
  .map((p, i) => ({ ...p, id: i + 1 }));

fs.writeFileSync(path.join(root, "data/products.json"), JSON.stringify(products, null, 2) + "\n");

// cleaned CSV for spreadsheet fans
const csvEscape = (s) => `"${String(s).replace(/"/g, '""')}"`;
const csvLines = [
  ["id", "name", "url", "category", "isAffiliateLink", "description"].join(","),
  ...products.map((p) =>
    [p.id, csvEscape(p.name), csvEscape(p.url), csvEscape(p.category), p.isAffiliateLink, csvEscape(p.description)].join(",")
  ),
];
fs.writeFileSync(path.join(root, "data/products.csv"), csvLines.join("\n") + "\n");

const counts = {};
for (const p of products) counts[p.category] = (counts[p.category] || 0) + 1;
console.log(`Wrote ${products.length} products to data/products.json and data/products.csv`);
console.log("By category:");
for (const [cat, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${n.toString().padStart(3)}  ${cat}`);
}
