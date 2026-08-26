import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-black/10 py-8 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-6 text-sm text-black/50 dark:text-white/50">
        <p className="mb-2">{siteConfig.disclosureShort}</p>
        <p>
          <Link href="/disclosure" className="hover:underline">
            Full affiliate disclosure
          </Link>{" "}
          · © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
