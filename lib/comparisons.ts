import { products, type Product, getAllCategories } from "./products";

// Auto-generates "X vs Y" comparison pages for tools in the same category.
// Capped per category (featured tools first, then alphabetical) so a huge
// category like "More Handy AI & Web Tools" (55+ tools) doesn't explode into
// thousands of pages — 6 tools per category caps it at 15 pairs/category.
const MAX_TOOLS_PER_CATEGORY = 6;

export type ComparisonPair = { slug: string; a: Product; b: Product };

function shortlistForCategory(category: string): Product[] {
  return products
    .filter((p) => p.category === category)
    .sort((x, y) => Number(y.featured) - Number(x.featured) || x.name.localeCompare(y.name))
    .slice(0, MAX_TOOLS_PER_CATEGORY);
}

export function getAllComparisonPairs(): ComparisonPair[] {
  const pairs: ComparisonPair[] = [];
  for (const category of getAllCategories()) {
    const shortlist = shortlistForCategory(category);
    for (let i = 0; i < shortlist.length; i++) {
      for (let j = i + 1; j < shortlist.length; j++) {
        // Sort alphabetically by slug so "a-vs-b" is the single canonical URL.
        const [a, b] = [shortlist[i], shortlist[j]].sort((x, y) => x.slug.localeCompare(y.slug));
        pairs.push({ slug: `${a.slug}-vs-${b.slug}`, a, b });
      }
    }
  }
  return pairs;
}

export function getComparisonBySlug(slug: string): ComparisonPair | undefined {
  return getAllComparisonPairs().find((p) => p.slug === slug);
}

export function getComparisonsForProduct(productSlug: string): ComparisonPair[] {
  return getAllComparisonPairs().filter((p) => p.a.slug === productSlug || p.b.slug === productSlug);
}
