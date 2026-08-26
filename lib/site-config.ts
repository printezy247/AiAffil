// Edit data/site-config.json to make the site your own — no code changes
// needed. (Kept as JSON, not TS, so Node scripts like scripts/telegram-post.mjs
// can read the same file directly without a TypeScript build step.)
import raw from "@/data/site-config.json";

export const siteConfig = raw as {
  name: string;
  tagline: string;
  description: string;
  url: string;
  disclosureShort: string;
  twitter: string;
  youtube: string;
};
