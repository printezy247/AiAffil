import Script from "next/script";

// Optional: set NEXT_PUBLIC_GA_ID in .env.local (or in Vercel's Environment
// Variables settings) to a Google Analytics 4 Measurement ID like "G-XXXXXXX"
// and every pageview + outbound click gets tracked automatically. Leave it
// unset and this renders nothing — no analytics, no tracking, no cost.
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
