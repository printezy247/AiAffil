"use client";

import { usePathname } from "next/navigation";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";

// The Telegram Mini App (app/telegram) renders inside Telegram's own app
// chrome — it doesn't want our website nav/footer on top of that. Every
// other route keeps them.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMiniApp = pathname?.startsWith("/telegram");

  if (isMiniApp) return <>{children}</>;

  return (
    <>
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
