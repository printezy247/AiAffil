import productsData from "@/data/products.json";

export type Product = {
  id: number;
  slug: string;
  name: string;
  url: string;
  description: string;
  category: string;
  isAffiliateLink: boolean;
  featured: boolean;
  dateAdded: string;
};

export const products: Product[] = productsData as Product[];

export function getAllCategories(): string[] {
  return [...new Set(products.map((p) => p.category))].sort();
}

export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCategoryBySlug(slug: string): string | undefined {
  return getAllCategories().find((c) => categorySlug(c) === slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, limit);
}
