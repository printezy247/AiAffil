// Pings every tool/broker URL in the catalog and reports which ones are
// dead (404, timeout, DNS failure, etc.) so you can catch a broken
// affiliate link before a visitor does.
//
// Run it manually any time:
//   node scripts/check-links.mjs
// Or let .github/workflows/check-links.yml run it automatically once a
// week and open a visible failure if anything's broken.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const products = JSON.parse(fs.readFileSync(path.join(root, "data/products.json"), "utf8"));
const brokers = JSON.parse(fs.readFileSync(path.join(root, "data/brokers.json"), "utf8"));

const entries = [...products, ...brokers].map((e) => ({ name: e.name, url: e.url }));

const TIMEOUT_MS = 10_000;
const CONCURRENCY = 10;

async function checkOne({ name, url }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: controller.signal });
    // Some sites reject HEAD requests (405/403) even though the page is fine — retry with GET.
    if (res.status === 405 || res.status === 403) {
      res = await fetch(url, { method: "GET", redirect: "follow", signal: controller.signal });
    }
    clearTimeout(timeout);
    return { name, url, ok: res.ok, status: res.status };
  } catch (err) {
    clearTimeout(timeout);
    return { name, url, ok: false, status: null, error: err.message };
  }
}

async function runWithConcurrency(items, limit, fn) {
  const results = [];
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

console.log(`Checking ${entries.length} links (this can take a minute)...\n`);
const results = await runWithConcurrency(entries, CONCURRENCY, checkOne);

const broken = results.filter((r) => !r.ok);
const ok = results.filter((r) => r.ok);

console.log(`✅ ${ok.length} links OK`);
if (broken.length > 0) {
  console.log(`❌ ${broken.length} links broken:\n`);
  for (const b of broken) {
    console.log(`  ${b.name}: ${b.url}${b.status ? ` (HTTP ${b.status})` : ` (${b.error})`}`);
  }
  console.log(`\nFix these in data/products.json / data/brokers.json.`);
  process.exit(1);
} else {
  console.log("\nNo broken links found.");
}
