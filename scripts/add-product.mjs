// A beginner-friendly way to add a new tool to the site WITHOUT touching any code.
// Run it from the project folder:
//   node scripts/add-product.mjs
// Answer the questions it asks, and it saves the new tool straight into
// data/products.json. Restart `npm run dev` (or redeploy) to see it live.
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataPath = path.join(root, "data/products.json");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = async (question, fallback = "") => {
  const answer = (await rl.question(fallback ? `${question} [${fallback}]: ` : `${question}: `)).trim();
  return answer || fallback;
};
const askYesNo = async (question, fallback = "n") => {
  const answer = (await ask(question + " (y/n)", fallback)).toLowerCase();
  return answer.startsWith("y");
};

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const products = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const categories = [...new Set(products.map((p) => p.category))].sort();

  console.log("\n=== Add a new AI tool to your site ===\n");

  const name = await ask("Tool name (e.g. 'Opus Clip')");
  if (!name) {
    console.log("A name is required. Aborting.");
    rl.close();
    return;
  }

  const slug = slugify(name);
  if (products.some((p) => p.slug === slug)) {
    console.log(`\nA tool with the slug "${slug}" already exists (${products.find((p) => p.slug === slug).name}). Edit it directly in data/products.json instead.`);
    rl.close();
    return;
  }

  const url = await ask("Affiliate/product URL (include https://)");
  const description = await ask("One or two sentence description — what does it do, and why is it worth trying?");

  console.log("\nExisting categories:");
  categories.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
  const categoryAnswer = await ask("\nType a number to reuse a category, or type a brand-new category name", categories[0]);
  const categoryIndex = Number(categoryAnswer);
  const category =
    Number.isInteger(categoryIndex) && categoryIndex >= 1 && categoryIndex <= categories.length
      ? categories[categoryIndex - 1]
      : categoryAnswer;

  const isAffiliateLink = await askYesNo("Is this an affiliate link you earn commission from?", "y");
  const featured = await askYesNo("Feature it at the top of the homepage?", "n");

  const newProduct = {
    id: Math.max(0, ...products.map((p) => p.id)) + 1,
    slug,
    name,
    url,
    description: description || "No description provided yet — edit data/products.json to add one.",
    category,
    isAffiliateLink,
    featured,
    dateAdded: new Date().toISOString().slice(0, 10),
  };

  products.push(newProduct);
  products.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2) + "\n");

  console.log(`\n✅ Added "${name}" to data/products.json under "${category}".`);
  console.log(`It will show up at /tool/${slug} once you restart the dev server or redeploy.\n`);
  rl.close();
}

main();
