"use client";

import { useState } from "react";
import { products, getAllCategories, type Product } from "@/lib/products";
import { TelegramWebAppScript, useTelegramWebApp } from "./TelegramWebApp";
import { siteConfig } from "@/lib/site-config";

function MiniAppCard({ product, onOpen }: { product: Product; onOpen: (href: string, e: React.MouseEvent) => void }) {
  const href = `/go/${product.slug}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={(e) => onOpen(href, e)}
      className="block rounded-xl border p-4 transition active:scale-[0.99]"
      style={{ borderColor: "var(--tg-hint)", background: "var(--tg-secondary-bg)" }}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-semibold" style={{ color: "var(--tg-text)" }}>
          {product.name}
        </span>
        {product.isAffiliateLink && (
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ background: "var(--tg-button)", color: "var(--tg-button-text)", opacity: 0.85 }}
          >
            Affiliate
          </span>
        )}
      </div>
      <p className="mb-2 text-xs opacity-70" style={{ color: "var(--tg-text)" }}>
        {product.category}
      </p>
      <p className="line-clamp-3 text-sm" style={{ color: "var(--tg-hint)" }}>
        {product.description}
      </p>
    </a>
  );
}

export function TelegramMiniApp() {
  const { webApp, handleScriptLoad } = useTelegramWebApp();
  const categories = getAllCategories();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = products.filter((p) => {
    const matchesCategory = category === "All" || p.category === category;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const greeting = webApp?.initDataUnsafe?.user?.first_name ? `, ${webApp.initDataUnsafe.user.first_name}` : "";

  // Inside Telegram, hand outbound links to WebApp.openLink() so the client
  // opens them properly (in-app or system browser) instead of trying to
  // navigate the Mini App's own webview away from Telegram.
  function openTool(href: string, e: React.MouseEvent) {
    if (!webApp) return; // outside Telegram: let the normal <a> behavior handle it
    e.preventDefault();
    const absoluteUrl = new URL(href, window.location.origin).toString();
    webApp.openLink(absoluteUrl);
  }

  return (
    <>
      <TelegramWebAppScript onLoad={handleScriptLoad} />
      <div
        className="min-h-screen px-4 pb-10 pt-5"
        style={{ background: "var(--tg-bg)", color: "var(--tg-text)" }}
      >
        <h1 className="mb-1 text-xl font-bold">
          👋 Hey{greeting}, welcome to {siteConfig.name}
        </h1>
        <p className="mb-4 text-sm opacity-70">{products.length} AI tools, tap any card to open it.</p>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools..."
          className="mb-3 w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--tg-hint)", background: "var(--tg-secondary-bg)", color: "var(--tg-text)" }}
        />

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {["All", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium"
              style={
                category === c
                  ? { background: "var(--tg-button)", color: "var(--tg-button-text)" }
                  : { background: "var(--tg-secondary-bg)", color: "var(--tg-hint)" }
              }
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.slice(0, 40).map((p) => (
            <MiniAppCard key={p.slug} product={p} onOpen={openTool} />
          ))}
          {filtered.length === 0 && <p className="py-8 text-center text-sm opacity-60">No tools match that search.</p>}
        </div>
      </div>
    </>
  );
}
