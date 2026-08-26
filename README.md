# AI Tool Vault — your AI affiliate business, ready to run

This is a working affiliate website. It lists AI tools by category, has its own
search, a page per tool, an outbound-click redirect for tracking, an FTC
disclosure page, and free SEO plumbing (sitemap, per-page metadata). You do not
need to know how to code to run it or add tools to it — this guide walks
through everything, assuming you've never used a terminal before.

**⚠️ Read this before you publish.** The starter data in `data/products.json`
was built from a spreadsheet a YouTuber shared publicly. Most of those links
are **that creator's own affiliate links** — if you publish the site as-is,
clicks and signups earn commissions for *them*, not you. Section
["Get your own affiliate links"](#4-get-your-own-affiliate-links-important) below
explains exactly how to fix that, tool by tool, before you promote the site.

---

## What's in this project

```
app/               Pages (Next.js "App Router")
  page.tsx           Homepage — hero, featured tools, search + filters
  category/[slug]/   One page per category (e.g. /category/seo-and-growth-marketing)
  tool/[slug]/       One page per tool (e.g. /tool/syllaby) — good for SEO
  go/[slug]/         Outbound link redirector (see "Track clicks" below)
  disclosure/        Legally-required affiliate disclosure page
  sitemap.ts         Auto-generated sitemap.xml for Google
components/        Reusable UI pieces (product card, search bar, nav, footer)
data/
  products.json      Every tool on the site. This is the file you'll edit most.
  products.csv       Same data, spreadsheet-friendly (open in Excel/Sheets)
  source-list-raw.csv  The original creator's list, kept for reference
lib/
  site-config.ts     Your site's name, tagline, and disclosure text
  products.ts        Helper functions the pages use to read products.json
scripts/
  add-product.mjs    Interactive "add a tool" wizard — no code editing needed
  build-catalog.mjs  Re-categorizes data/parsed-raw.json into products.json
```

---

## 1. Install what you need (one-time setup)

You need two free programs on your computer:

1. **Node.js** — lets your computer run this project.
   Go to [nodejs.org](https://nodejs.org), download the "LTS" version, and
   install it like any other app (click Next through the installer).
2. **A code editor** — for opening and editing files.
   [VS Code](https://code.visualstudio.com/) (free) is the standard choice.
3. **Git** (optional but recommended, needed for step 5's deploy method) —
   [git-scm.com](https://git-scm.com/downloads).

To confirm Node installed correctly, open a terminal (on Windows: search for
"Command Prompt" or "PowerShell"; on Mac: search for "Terminal") and type:

```bash
node -v
```

If it prints a version number like `v22.x.x`, you're set.

---

## 2. Run the site on your own computer

Open a terminal, navigate into this project folder, then run:

```bash
npm install
npm run dev
```

`npm install` downloads the project's building blocks (only needed once, or
after you pull updates). `npm run dev` starts the site. Once it says
`Ready`, open **http://localhost:3000** in your browser — that's your site,
running locally, private to you.

Leave that terminal window open while you work. Press `Ctrl+C` in it to stop
the server.

---

## 3. Make it yours

### Change the name, tagline, and description

Open `lib/site-config.ts` in your code editor. Every value in there shows up
somewhere on the site — change `name`, `tagline`, `description`, `url` (once
you have a domain, step 6), and your social links. Save the file; if
`npm run dev` is running, the site updates automatically.

### Add a new tool (no coding required)

In a terminal, inside the project folder, run:

```bash
node scripts/add-product.mjs
```

It asks you a few questions — tool name, link, description, category — and
saves the new tool straight into `data/products.json`. Restart `npm run dev`
(or just wait — it hot-reloads) to see it live at `/tool/your-tool-slug`.

### Add or edit a tool by hand

`data/products.json` is a plain list. Each tool looks like this:

```json
{
  "id": 1,
  "slug": "syllaby",
  "name": "Syllaby",
  "url": "https://syllaby.io/",
  "description": "Find viral topics, write scripts, and publish faceless videos automatically.",
  "category": "Faceless Video & Content Automation",
  "isAffiliateLink": true,
  "featured": false,
  "dateAdded": "2026-08-26"
}
```

Copy an existing block, paste it, and edit the values (keep the commas!). Set
`"featured": true` to pin a tool to the homepage's top row. `slug` must be
unique and URL-safe (lowercase, hyphens, no spaces) — it becomes the tool's
page address.

### Remove a tool

Delete its `{ ... }` block from `data/products.json` (and the matching row
in `data/parsed-raw.json` if you don't want it to come back if you ever
re-run `build-catalog.mjs`).

---

## 4. Get your own affiliate links (important)

An affiliate link only pays *you* if it contains *your* tracking code. Right
now, roughly 80 tools in `data/products.json` carry another creator's codes
(they look like `?via=Austin`, `bit.ly/xxxxTOOL`, `/austinarmstrong`, etc — the
`"isAffiliateLink": true` flag marks all of them, and the site shows an
"Affiliate" badge on their cards). Here's how to swap them for your own, tool
by tool:

1. Open the tool's website (not through this site — go direct, e.g.
   `syllaby.io`).
2. Scroll to the footer and look for "Affiliates," "Partners," "Referral
   Program," or "Affiliate Program." Not every tool has one — that's fine,
   just leave those links as-is or remove the tool.
3. Sign up (usually free, sometimes needs approval — a few days' wait is
   normal).
4. Once approved, the dashboard gives you a unique tracking link.
5. Open `data/products.json`, find that tool, and replace its `"url"` value
   with your new link.

This is naturally gradual work — many affiliate marketers start with 5-10
tools they've personally used and can genuinely recommend, get those
programs approved, and grow the list over time. You do not need all 165
tools live on day one. A smaller, honest list you can vouch for converts
better than a huge list of links you've never tried.

Tools with `"isAffiliateLink": false` (mostly free utilities near the end of
the list, plus a few "🔥 High-demand pick" entries — see
["Keep the catalog fresh"](#7-keep-the-catalog-fresh-with-in-demand-tools) below) don't need this —
they either have no commission to earn, or are flagged for you to add your
own program link once you've joined it.

---

## 5. Put it online for free (deploy to Vercel)

[Vercel](https://vercel.com) is made by the creators of Next.js and hosts
projects like this one for free.

1. Create a free account at [github.com](https://github.com/join) if you
   don't have one, and another at [vercel.com](https://vercel.com/signup)
   (sign up with your GitHub account — one click).
2. Push this project to a new GitHub repository. In the terminal, inside the
   project folder:
   ```bash
   git init
   git add .
   git commit -m "My AI affiliate site"
   ```
   Then create an empty repo on GitHub (click the "+" in the top right →
   "New repository"), and follow the "…or push an existing repository"
   instructions it shows you.
3. In Vercel, click **Add New → Project**, pick that GitHub repo, leave every
   setting on its default, and click **Deploy**.
4. A couple minutes later you'll get a live URL like
   `https://your-project.vercel.app`. That's your site, live on the internet.

Any time you `git push` new changes, Vercel redeploys automatically.

### Get a custom domain

A `.com` domain costs about $10–15/year from
[Namecheap](https://www.namecheap.com) or [Porkbun](https://porkbun.com).
Buy one, then in Vercel: **your project → Settings → Domains → add it**.
Vercel shows you exactly which DNS records to add at your registrar — follow
those, wait 10–60 minutes for DNS to propagate, and your custom domain goes
live. Then update `url` in `lib/site-config.ts` to match, so the sitemap and
metadata point at the right address.

---

## 6. Understand the business before you promote it

**How the money works:** you link to a tool using your affiliate link. A
visitor clicks, signs up (sometimes needs to become a paying customer,
depending on the program), and the company pays you a commission —
sometimes a flat bounty, often a recurring percentage of what that customer
pays for as long as they stay subscribed. That's why AI SaaS affiliate
programs are attractive: one signup can pay out monthly for years.

**Where visitors come from — the site alone won't get traffic.** A directory
site earns nothing until people find it. The creator whose spreadsheet this
started from built an audience first (a YouTube channel), then used the site
to monetize it. Realistic paths, in rough order of effort-to-payoff for a
beginner:

- **SEO (slow, compounding, free).** This site is already built for it —
  every tool has its own indexable page (`/tool/...`) and every category has
  a landing page (`/category/...`), plus an auto-generated sitemap. Once
  live, submit your sitemap (`yourdomain.com/sitemap.xml`) in
  [Google Search Console](https://search.google.com/search-console) (free).
  Expect months, not days, before search traffic shows up.
- **Content on one platform (faster, more work).** Short-form video (YouTube
  Shorts/TikTok/Reels) reviewing or demoing one tool at a time, with your
  site link in the description or bio, is how the original creator grew
  this exact list. `Beacons` and `Stan Store` (both already in your catalog)
  are built for exactly this "link in bio" use case.
- **An email list (compounds over time).** Capture emails (a `Lead Pages` or
  `IContact` signup form, both in your catalog) and send a weekly "tool I
  tried this week" email — email lists convert far better than cold site
  traffic.
- **Paid ads (fastest, costs real money, riskiest for a beginner).** Not
  recommended until organic traffic proves which tools/angles actually
  convert.

**Legal requirement, not optional:** U.S. FTC rules require you to disclose
affiliate relationships clearly. This site already has a `/disclosure` page
and a disclosure line in the footer of every page — keep both. If you also
promote a specific tool on social media, add a short disclosure there too
(e.g. "#ad" or "contains an affiliate link").

---

## 7. Keep the catalog fresh with in-demand tools

An affiliate directory that never changes goes stale — new AI tools launch
constantly, and being early to list a fast-growing tool (before it's
everywhere) is one of the few edges a small site has. Two ways to do this:

**Ask an AI to research and add tools for you.** If you're using Claude (or
Claude Code) to work on this project, you can literally ask, in plain
English:

> "Search for the 5 fastest-growing AI video-editing tools right now, check
> whether they have an affiliate program, and add the ones that do to
> data/products.json using the same format as the existing entries."

That's exactly how the 7 tools tagged **"🔥 High-demand pick found via live
research"** already in your catalog (InVideo AI, OpusClip, ElevenLabs,
Copy.ai, Speechify, GetResponse, Narrato) were added — as a working example.
Their `url` currently points at the tool's homepage, not an affiliate
link — join each program (see section 4) and swap in your tracked link
before you promote them.

**Do it yourself:** run `node scripts/add-product.mjs` whenever you find a
tool worth listing (Twitter/X, Product Hunt, r/artificial, and AI
newsletters are good sources), or hand-edit `data/products.json` directly.

---

## 8. Track clicks (optional, but you'll want this)

Every "Visit" button routes through `/go/[tool-slug]` before redirecting to
the real link (see `app/go/[slug]/route.ts`). Two levels of tracking:

- **Free, built-in:** every redirect is logged to your server console. On
  Vercel: **your project → Logs**, filter for `[click]`. Good enough to spot-
  check that links work; not a real dashboard.
- **Real analytics:** create a free [Google Analytics 4](https://analytics.google.com)
  property, copy its Measurement ID (`G-XXXXXXX`), and either:
  - add it as `NEXT_PUBLIC_GA_ID` in Vercel → your project → Settings →
    Environment Variables, or
  - copy `.env.example` to `.env.local` and set it there for local testing.

  No code changes needed — `components/Analytics.tsx` picks it up
  automatically and starts tracking pageviews.

For serious affiliate tracking (which *program* converts, not just which
*page* got clicks), rely on the affiliate network's own dashboard (Impact,
PartnerStack, Rewardful, etc. — most AI tools use one of these) — that's the
source of truth for what you're actually owed.

---

## Useful commands reference

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (run once, or after pulling updates) |
| `npm run dev` | Run the site locally at localhost:3000 |
| `npm run build` | Build the production version (also catches broken code before you deploy) |
| `npm run lint` | Check code style/errors |
| `node scripts/add-product.mjs` | Interactive wizard to add one new tool |
| `node scripts/build-catalog.mjs` | Re-categorize `data/parsed-raw.json` into `data/products.json` (keeps your hand-edits) |

---

## Built with

[Next.js](https://nextjs.org) (React) + [Tailwind CSS](https://tailwindcss.com), deployed on [Vercel](https://vercel.com).
