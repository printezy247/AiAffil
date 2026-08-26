import raw from "@/data/brokers.json";

export type Broker = {
  slug: string;
  name: string;
  category: string;
  url: string;
  tagline: string;
  feeHighlight: string;
  bestFor: string;
  isAffiliateLink: boolean;
};

export const brokers: Broker[] = raw as Broker[];

export function getBrokerCategories(): string[] {
  return [...new Set(brokers.map((b) => b.category))];
}
