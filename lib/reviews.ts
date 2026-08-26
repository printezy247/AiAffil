import raw from "@/data/reviews.json";

export type Review = { title: string; body: string; generatedAt: string };

const reviews = raw as Record<string, Review>;

export function getReviewForSlug(slug: string): Review | undefined {
  return reviews[slug];
}
