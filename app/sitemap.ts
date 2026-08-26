import type { MetadataRoute } from "next";
import { categorySlug, getAllCategories, products } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/brokers`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/markets`, changeFrequency: "daily", priority: 0.5 },
    { url: `${base}/tools`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/tools/position-size-calculator`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/tools/compound-interest-calculator`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/disclosure`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = getAllCategories().map((c) => ({
    url: `${base}/category/${categorySlug(c)}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const toolPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/tool/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...categoryPages, ...toolPages];
}
