import { siteConfig } from "@/lib/site-config";

export const metadata = { title: "Affiliate Disclosure" };

export default function DisclosurePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Affiliate Disclosure</h1>
      <div className="space-y-4 text-black/70 dark:text-white/70">
        <p>
          {siteConfig.name} is reader-supported. Some of the links on this site are affiliate links, which means
          that if you click on a link and sign up or make a purchase, we may earn a commission at no additional
          cost to you.
        </p>
        <p>
          We only recommend tools we believe can genuinely help you build a business or create content — the
          presence of an affiliate link does not change our description of the tool, and it does not cost you
          anything extra to use it.
        </p>
        <p>
          Tools marked with an <strong>&quot;Affiliate&quot;</strong> badge use an affiliate link. Tools without the
          badge are listed simply because they&apos;re useful, with no commission involved.
        </p>
        <p>
          This disclosure is provided in accordance with the U.S. Federal Trade Commission&apos;s guidelines on
          endorsements and testimonials. If you have questions about a specific link, feel free to reach out.
        </p>
      </div>
    </div>
  );
}
