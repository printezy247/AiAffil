import type { Metadata } from "next";
import { TelegramMiniApp } from "@/components/TelegramMiniApp";

export const metadata: Metadata = {
  title: "Telegram Mini App",
  robots: { index: false, follow: false }, // this is a UI for inside Telegram, not a page to rank in search
};

export default function TelegramMiniAppPage() {
  return <TelegramMiniApp />;
}
