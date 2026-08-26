"use client";

import { useCallback, useState } from "react";
import Script from "next/script";

// Minimal shape of what we use from Telegram's WebApp JS SDK.
// Full reference: https://core.telegram.org/bots/webapps
type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  colorScheme: "light" | "dark";
  themeParams: Partial<{
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
    secondary_bg_color: string;
  }>;
  initDataUnsafe?: { user?: { first_name?: string; username?: string } };
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

function applyTheme(tg: TelegramWebApp) {
  const root = document.documentElement;
  const theme = tg.themeParams;
  const map: Record<string, string | undefined> = {
    "--tg-bg": theme.bg_color,
    "--tg-secondary-bg": theme.secondary_bg_color,
    "--tg-text": theme.text_color,
    "--tg-hint": theme.hint_color,
    "--tg-link": theme.link_color,
    "--tg-button": theme.button_color,
    "--tg-button-text": theme.button_text_color,
  };
  for (const [key, value] of Object.entries(map)) {
    if (value) root.style.setProperty(key, value);
  }
}

/**
 * Tracks Telegram's WebApp SDK. Starts as `null` on both server and client
 * (so there's no hydration mismatch), and only flips to the real WebApp
 * object once telegram-web-app.js reports it has finished loading via the
 * <TelegramWebAppScript> below — see its onLoad handler.
 *
 * Outside of Telegram (e.g. previewing in a normal browser), that script
 * still loads but window.Telegram.WebApp has no real Telegram client behind
 * it, so callers should treat a non-null value here as "best effort," not
 * a guarantee of being inside the Telegram app.
 */
export function useTelegramWebApp() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  const handleScriptLoad = useCallback(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    tg.ready();
    tg.expand();
    applyTheme(tg);
    setWebApp(tg);
  }, []);

  return { webApp, handleScriptLoad };
}

/** Drop this once near the top of a Mini App page to load the SDK script. */
export function TelegramWebAppScript({ onLoad }: { onLoad: () => void }) {
  return <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" onLoad={onLoad} />;
}
