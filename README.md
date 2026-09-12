<p align="center">
  <b>A ready-to-run AI affiliate site with SEO plumbing, click tracking, and FTC compliance built in.</b><br>
  Curated AI tools by category · per-tool SEO pages · outbound redirect tracking · disclosure &amp; sitemap out of the box.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15">
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Vercel-1--click-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Deploy to Vercel">
  <img src="https://img.shields.io/badge/license-MIT-0ea5e9?style=for-the-badge" alt="MIT">
</p>

<p align="center">
  <a href="#quickstart"><img src="https://img.shields.io/badge/🚀%20Quick%20start-5%20minutes-0b1030?style=flat-square&labelColor=22d3ee" alt="Quick start"></a>
  &nbsp;
  <a href="#deploy"><img src="https://img.shields.io/badge/☁️%20Deploy-Vercel%20free-0b1030?style=flat-square&labelColor=f472b6" alt="Deploy"></a>
  &nbsp;
  <a href="#features"><img src="https://img.shields.io/badge/✨%20Features-affiliate%20ready-0b1030?style=flat-square&labelColor=8b5cf6" alt="Features"></a>
</p>

<br>

## 🧭 Contents

- ✨ [Features](#features)
- 🛠️ [What's in this project](#whats-in-this-project)
- 🚀 [Quick start](#quickstart)
- ⚙️ [Configuration](#config)
- 🔗 [Get your own affiliate links](#affiliate-links)
- 📈 [Understand the business](#business)
- 🌐 [Put it online](#deploy)
- 🏗️ [Architecture](#architecture)
- ⚖️ [Legal &amp; compliance](#legal)
- 📦 [Keep the catalog fresh](#fresh)

<br>

<a name="features"></a>

## ✨ Features

Every feature is wired end-to-end. No stubs, no placeholders that need a backend to work.

<table>
  <tr>
    <td width="33%" valign="top">
      <h3>📂 Curated catalog</h3>
      165+ AI tools across 12 categories, stored in a plain JSON file you can edit by hand or with the included wizard. Each tool gets its own SEO page.<br><br>
    </td>
    <td width="33%" valign="top">
      <h3>🔍 Live search &amp; filters</h3>
      Client-side search and category filtering on the homepage. No database, no API calls — fast, free, and works offline.<br><br>
    </td>
    <td width="33%" valign="top">
      <h3>🔗 Click tracking</h3>
      Every outbound link routes through a redirector that logs the click. Spot-check in Vercel logs, or plug in GA4 for full analytics.<br><br>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <h3>📄 Per-tool SEO pages</h3>
      Every tool gets a dedicated <code>/tool/[slug]</code> page with unique metadata, ready to index. Categories get their own landing pages too.<br><br>
    </td>
    <td valign="top">
      <h3>📋 Sitemap &amp; metadata</h3>
      Auto-generated <code>sitemap.xml</code>, Open Graph tags, and per-page titles. Submit to Google Search Console and start compounding.<br><br>
    </td>
    <td valign="top">
      <h3>⚖️ FTC compliance</h3>
      A legally required disclosure page and an affiliate badge on every sponsored card. Stay compliant without thinking about it.<br><br>
    </td>
  </tr>
</table>

<br>

<details>
<summary><b>🧭 How the site is structured</b> &nbsp;·&nbsp; click to expand</summary>

The site is a static Next.js application. No server, no database, no build step you have to manage — Vercel handles it.

| Layer | What it does |
| --- | --- |
| **Pages** | App Router pages: homepage, category landing pages, tool pages, redirector, disclosure. |
| **Data** | <code>data/products.json</code> is the single source of truth. The wizard, the build script, and the pages all read from it. |
| **Components** | Reusable UI pieces: product cards, search bar, navigation, footer, analytics hook. |
| **Config** | <code>lib/site-config.ts</code> controls your site name, tagline, URL, and disclosure text — change it once and it flows everywhere. |

Before you publish, swap the starter affiliate links for your own. The starter data was built from a publicly shared spreadsheet; most links carry another creator's tracking code. Section ["Get your own affiliate links"](#affiliate-links) below walks through exactly how to fix this tool by tool.

</details>

<br>

<a name="whats-in-this-project"></a>

## 🛠️ What's in this project

```text
app/
  page.tsx               Homepage — hero, featured tools, search + filters
  category/[slug]/       One page per category
  tool/[slug]/           One page per tool — good for SEO
  go/[slug]/             Outbound link redirector for tracking
  disclosure/            Legally-required affiliate disclosure page
  sitemap.ts             Auto-generated sitemap.xml for Google
components/             Reusable UI pieces (product card, search bar, nav, footer)
data/
  products.json          Every tool on the site. Edit this most.
  products.csv           Same data, spreadsheet-friendly
  source-list-raw.csv    The original creator's list, kept for reference
lib/
  site-config.ts         Your site's name, tagline, and disclosure text
  products.ts            Helper functions the pages use to read products.json
scripts/
  add-product.mjs        Interactive wizard to add a tool — no code needed
  build-catalog.mjs      Re-categorizes raw data into products.json
```

<br>

<a name="quickstart"></a>

## 🚀 Quick start

You need two free programs: **Node.js** (to run the project) and a code editor like **VS Code**.

```bash
# 1 · clone or download this repo
git clone https://github.com/printezy247/AiAffil.git
cd AiAffil

# 2 · install dependencies
npm install

# 3 · run the site locally
npm run dev
```

Open **http://localhost:3000** — that is your site, running on your machine.

Leave the terminal window open while you work. Press <kbd>Ctrl+C</kbd> to stop the server.

**Verify everything works:**

```bash
npm run build   # production build — catches broken code before you deploy
npm run lint    # code style check
```

<br>

<a name="config"></a>

## ⚙️ Configuration

Open <code>lib/site-config.ts</code>. Every public value on the site flows from this file.

<details>
<summary><b>⚙️ Every setting</b> &nbsp;·&nbsp; click to expand</summary>

| Variable | Purpose |
| --- | --- |
| <code>name</code> | Site name shown in the header, title tag, and footer. |
| <code>tagline</code> | Short line under the logo on the homepage. |
| <code>description</code> | Meta description for SEO and social sharing. |
| <code>url</code> | Your live domain — used in sitemap, OG tags, and canonical URLs. |
| <code>socials</code> | Links shown in the footer. |
| <code>disclosureText</code> | The FTC disclosure text shown on <code>/disclosure</code> and in the footer. |

</details>

<details>
<summary><b>📊 Analytics (optional)</b> &nbsp;·&nbsp; click to expand</summary>

For pageview tracking, create a free [Google Analytics 4](https://analytics.google.com) property and copy its Measurement ID (<code>G-XXXXXXX</code>).

Set it as an environment variable:

```bash
# local testing
cp .env.example .env.local
# then add: NEXT_PUBLIC_GA_ID=G-XXXXXXX
```

Or in Vercel: **your project → Settings → Environment Variables**. <code>components/Analytics.tsx</code> picks it up automatically.

</details>

<br>

<a name="affiliate-links"></a>

## 🔗 Get your own affiliate links

**Read this before you publish.** The starter data in <code>data/products.json</code> was built from a spreadsheet a YouTuber shared publicly. Most of those links are <b>that creator's own affiliate links</b> — if you publish the site as-is, clicks and signups earn commissions for <i>them</i>, not you.

<code>isAffiliateLink: true</code> marks every sponsored card. Here is how to swap them for your own tracking links:

1. Open the tool's website directly (not through this site).
2. Look for "Affiliates," "Partners," "Referral Program," or "Affiliate Program" in the footer. Not every tool has one — that is fine, leave those links as-is or remove the tool.
3. Sign up (usually free; approval can take a few days).
4. Once approved, copy your unique tracking link from the dashboard.
5. Open <code>data/products.json</code>, find the tool, and replace its <code>url</code> value with your new link.

Tools with <code>isAffiliateLink: false</code> (mostly free utilities) do not need this — they either have no commission, or are flagged for you to add your own link once you join the program.

This is naturally gradual work. Many affiliate marketers start with 5–10 tools they have personally used, get those programs approved, and grow the list over time. A smaller, honest list converts better than a huge list of links you have never tried.

<br>

<a name="business"></a>

## 📈 Understand the business

**How the money works.** You link to a tool using your affiliate link. A visitor clicks, signs up (sometimes needs to become a paying customer, depending on the program), and the company pays you a commission — sometimes a flat bounty, often a recurring percentage of what that customer pays for as long as they stay subscribed. That is why AI SaaS affiliate programs are attractive: one signup can pay out monthly for years.

**Where visitors come from — the site alone will not get traffic.** A directory site earns nothing until people find it. Realistic paths, in rough order of effort-to-payoff for a beginner:

| Channel | Effort | Payoff | Notes |
| --- | :---: | :---: | --- |
| **SEO** | Low | Slow, compounding, free | Every tool and category page is already indexable. Submit your sitemap to Google Search Console and wait months, not days. |
| **Short-form video** | High | Faster | YouTube Shorts, TikTok, Reels — review or demo one tool at a time and link the site in your bio. |
| **Email list** | Medium | Compounds | Capture emails and send a weekly "tool I tried this week" — converts far better than cold traffic. |
| **Paid ads** | High | Fastest, riskiest | Not recommended until organic traffic proves which tools and angles actually convert. |

**Legal requirement, not optional.** U.S. FTC rules require you to disclose affiliate relationships clearly. This site already has a <code>/disclosure</code> page and a disclosure line in the footer of every page — keep both. If you also promote a specific tool on social media, add a short disclosure there too (e.g. <code>#ad</code> or "contains an affiliate link").

<br>

<a name="deploy"></a>

## 🌐 Put it online

[Vercel](https://vercel.com) is made by the creators of Next.js and hosts projects like this one for free.

1. Create a free account at [github.com](https://github.com/join) and another at [vercel.com](https://vercel.com/signup) (sign up with GitHub — one click).
2. Push this project to a new GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "My AI affiliate site"
   ```
   Then create an empty repo on GitHub and follow the push instructions it shows.
3. In Vercel, click **Add New → Project**, pick that GitHub repo, leave every setting on its default, and click **Deploy**.
4. A couple minutes later you will get a live URL like <code>https://your-project.vercel.app</code>.

Any time you <code>git push</code> new changes, Vercel redeploys automatically.

### Get a custom domain

A <code>.com</code> domain costs about $10–15/year from [Namecheap](https://www.namecheap.com) or [Porkbun](https://porkbun.com). Buy one, then in Vercel: **your project → Settings → Domains → add it**. Vercel shows you exactly which DNS records to add at your registrar. Once it propagates, update <code>url</code> in <code>lib/site-config.ts</code> to match.

<br>

<a name="architecture"></a>

## 🏗️ Architecture

**Request path.** Visitor hits <code>/tool/[slug]</code> → Next.js renders the page from <code>data/products.json</code> → meta tags, OG image, and canonical URL are set from site config → visitor clicks "Visit" → routes through <code>/go/[slug]</code> → logs the click → redirects to the affiliate URL.

<details>
<summary><b>🗂️ Project layout</b> &nbsp;·&nbsp; click to expand</summary>

```text
app/
  page.tsx                  Homepage — hero, featured tools, search + filters
  category/[slug]/          One page per category (e.g. /category/seo-and-growth-marketing)
  tool/[slug]/              One page per tool (e.g. /tool/syllaby) — good for SEO
  go/[slug]/                Outbound link redirector (see "Track clicks" below)
  disclosure/               Legally-required affiliate disclosure page
  sitemap.ts                Auto-generated sitemap.xml for Google
components/                 Reusable UI pieces (product card, search bar, nav, footer)
data/
  products.json             Every tool on the site. This is the file you'll edit most.
  products.csv              Same data, spreadsheet-friendly (open in Excel/Sheets)
  source-list-raw.csv       The original creator's list, kept for reference
lib/
  site-config.ts            Your site's name, tagline, and disclosure text
  products.ts               Helper functions the pages use to read products.json
scripts/
  add-product.mjs           Interactive "add a tool" wizard — no code editing needed
  build-catalog.mjs         Re-categorizes data/parsed-raw.json into products.json
```

</details>

<br>

<a name="legal"></a>

## ⚖️ Legal &amp; compliance

This site ships with two compliance layers:

| Layer | Where it lives | What it does |
| --- | --- | --- |
| **Disclosure page** | <code>app/disclosure/page.tsx</code> | Full FTC-compliant affiliate disclosure, linked from every page footer. |
| **Affiliate badge** | <code>components/ProductCard.tsx</code> | Every tool with <code>isAffiliateLink: true</code> shows an "Affiliate" badge so visitors know. |

Keep both. If you promote specific tools on social media, add a short disclosure there too (e.g. <code>#ad</code> or "contains an affiliate link").

<br>

<a name="fresh"></a>

## 📦 Keep the catalog fresh

An affiliate directory that never changes goes stale — new AI tools launch constantly, and being early to list a fast-growing tool is one of the few edges a small site has.

**Add tools with the wizard:**

```bash
node scripts/add-product.mjs
```

It asks you a few questions — tool name, link, description, category — and saves the new tool straight into <code>data/products.json</code>. Restart <code>npm run dev</code> (or just wait — it hot-reloads) to see it live.

**Ask an AI to research and add tools for you.** If you are using Claude (or Claude Code) to work on this project, you can literally ask:

> "Search for the 5 fastest-growing AI video-editing tools right now, check whether they have an affiliate program, and add the ones that do to <code>data/products.json</code> using the same format as the existing entries."

That is exactly how the tools tagged **"🔥 High-demand pick found via live research"** already in your catalog were added. Their <code>url</code> currently points at the tool's homepage, not an affiliate link — join each program and swap in your tracked link before you promote them.

---

## Useful commands reference

| Command | What it does |
| --- | --- |
| <code>npm install</code> | Install dependencies (run once, or after pulling updates) |
| <code>npm run dev</code> | Run the site locally at localhost:3000 |
| <code>npm run build</code> | Build the production version (also catches broken code before you deploy) |
| <code>npm run lint</code> | Check code style/errors |
| <code>node scripts/add-product.mjs</code> | Interactive wizard to add one new tool |
| <code>node scripts/build-catalog.mjs</code> | Re-categorize <code>data/parsed-raw.json</code> into <code>data/products.json</code> (keeps your hand-edits) |

---

## Built with

[Next.js](https://nextjs.org) (React) + [Tailwind CSS](https://tailwindcss.com), deployed on [Vercel](https://vercel.com).
