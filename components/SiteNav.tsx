import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteNav() {
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/#tools" className="hover:underline">
            Browse Tools
          </Link>
          <Link href="/disclosure" className="hover:underline">
            Disclosure
          </Link>
        </nav>
      </div>
    </header>
  );
}
