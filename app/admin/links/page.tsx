import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { kv } from "@/lib/kv";
import { products } from "@/lib/products";
import { brokers } from "@/lib/brokers";
import { isAdminAuthed, isAdminConfigured, setAdminAuthCookie } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Click Dashboard", robots: { index: false, follow: false } };
// Always render fresh: this reads cookies/env at request time, and forcing
// dynamic here avoids Next caching a stale "not configured" page if the
// build happened before ADMIN_DASHBOARD_PASSWORD was set.
export const dynamic = "force-dynamic";

async function login(formData: FormData) {
  "use server";
  const password = String(formData.get("password") ?? "");
  if (password && password === process.env.ADMIN_DASHBOARD_PASSWORD) {
    await setAdminAuthCookie(password);
  }
  redirect("/admin/links");
}

export default async function AdminLinksPage() {
  if (!isAdminConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="mb-3 text-2xl font-bold">Click Dashboard</h1>
        <p className="text-black/60 dark:text-white/60">
          Set <code>ADMIN_DASHBOARD_PASSWORD</code> in your environment variables to enable this page. See{" "}
          <code>.env.example</code>.
        </p>
      </div>
    );
  }

  const authed = await isAdminAuthed();

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-6 py-16">
        <h1 className="mb-6 text-2xl font-bold">Click Dashboard</h1>
        <form action={login} className="flex flex-col gap-3">
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-white/15 dark:bg-white/5"
          />
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
            Log in
          </button>
        </form>
      </div>
    );
  }

  const allEntries = [...products, ...brokers];
  const counts = await kv.listWithPrefix("clicks:");
  const subscribersRaw = await kv.get("subscribers");
  const subscribers: string[] = subscribersRaw ? JSON.parse(subscribersRaw) : [];

  const rows = allEntries
    .map((entry) => ({
      slug: entry.slug,
      name: entry.name,
      clicks: Number(counts[`clicks:${entry.slug}`] ?? 0),
    }))
    .filter((r) => r.clicks > 0)
    .sort((a, b) => b.clicks - a.clicks);

  const totalClicks = rows.reduce((sum, r) => sum + r.clicks, 0);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Click Dashboard</h1>
      <p className="mb-8 text-black/60 dark:text-white/60">
        {totalClicks} total clicks tracked{!kv.isPersistent && " (local file storage — see warning below)"}.
      </p>

      {!kv.isPersistent && (
        <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-300">
          <strong>No persistent storage configured.</strong> Counts are stored in a local file that resets on most
          hosting redeploys. Set <code>UPSTASH_REDIS_REST_URL</code> / <code>UPSTASH_REDIS_REST_TOKEN</code> (free
          tier) for counts that actually stick — see <code>.env.example</code>.
        </div>
      )}

      {rows.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">
          No clicks recorded yet. Once visitors start clicking &quot;Visit&quot; links, they&apos;ll show up here.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10">
              <th className="py-2 font-semibold">Tool</th>
              <th className="py-2 font-semibold">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-b border-black/5 dark:border-white/5">
                <td className="py-2.5">{r.name}</td>
                <td className="py-2.5 font-medium">{r.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="mb-2 mt-14 text-2xl font-bold tracking-tight">Email Subscribers</h2>
      <p className="mb-6 text-black/60 dark:text-white/60">
        {subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"}
        {!process.env.CONVERTKIT_API_KEY && " — stored locally, not yet connected to an email sender. See the feature 13 setup guide."}
      </p>
      {subscribers.length === 0 ? (
        <p className="text-sm text-black/50 dark:text-white/50">No subscribers yet.</p>
      ) : (
        <ul className="flex flex-col gap-1 text-sm">
          {subscribers.map((email) => (
            <li key={email} className="border-b border-black/5 py-1.5 dark:border-white/5">
              {email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
