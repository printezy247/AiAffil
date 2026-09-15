// A tiny key-value store used by the click tracker, email capture, and
// admin dashboard. It automatically uses Upstash Redis (free tier) if you've
// set UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN — this is required
// on Vercel, since serverless functions don't share a writable local disk.
// Without those set, it falls back to a JSON file on disk — fine for running
// the site on your own computer or a self-hosted server, but NOT reliable on
// Vercel (each request can hit a fresh, ephemeral filesystem).
import fs from "node:fs";
import path from "node:path";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const hasUpstash = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

const LOCAL_STORE_PATH = path.join(process.cwd(), ".local-kv-store.json");

// Simple mutex for local filesystem operations to prevent race conditions
// when multiple concurrent requests read/modify/write the local store.
// This is only used in local fallback mode (no Upstash configured).
let localFileLock = false;
const lockWaitInterval = 10; // ms between retry attempts
const lockTimeout = 2000; // max time to wait for lock (2 seconds)

async function withFileLock<T>(operation: () => Promise<T>): Promise<T> {
  const startTime = Date.now();
  while (localFileLock) {
    if (Date.now() - startTime > lockTimeout) {
      throw new Error("Timeout waiting for local KV store lock");
    }
    await new Promise((resolve) => setTimeout(resolve, lockWaitInterval));
  }
  localFileLock = true;
  try {
    return await operation();
  } finally {
    localFileLock = false;
  }
}

function readLocalStore(): Record<string, string> {
  try {
    return JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function writeLocalStore(store: Record<string, string>) {
  try {
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(store, null, 2));
  } catch {
    // Read-only filesystem (e.g. Vercel without Upstash configured) — no-op.
    // Click counts just won't persist. Configure Upstash to fix this.
  }
}

async function upstash(command: (string | number)[]): Promise<unknown> {
  const res = await fetch(`${UPSTASH_URL}/${command.map(encodeURIComponent).join("/")}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    cache: "no-store",
  });
  const data = await res.json();
  return data.result;
}

export const kv = {
  /** Returns true if a real, persistent store (Upstash) is configured. */
  isPersistent: hasUpstash,

  async get(key: string): Promise<string | null> {
    if (hasUpstash) return (await upstash(["get", key])) as string | null;
    // Read operations don't need locking since we read fresh each time
    return readLocalStore()[key] ?? null;
  },

  async set(key: string, value: string): Promise<void> {
    if (hasUpstash) {
      await upstash(["set", key, value]);
      return;
    }
    // Write operation — needs lock to prevent race conditions
    await withFileLock(async () => {
      const store = readLocalStore();
      store[key] = value;
      writeLocalStore(store);
    });
  },

  async incr(key: string): Promise<number> {
    if (hasUpstash) return Number(await upstash(["incr", key]));
    // Atomic increment requires lock — read-modify-write must be serialized
    return withFileLock(async () => {
      const store = readLocalStore();
      const next = (Number(store[key]) || 0) + 1;
      store[key] = String(next);
      writeLocalStore(store);
      return next;
    });
  },

  /** List all keys matching a prefix (used by the admin dashboard). Slow on
   * local fallback (scans everything); fine at directory-site scale. */
  async listWithPrefix(prefix: string): Promise<Record<string, string>> {
    if (hasUpstash) {
      const keys = (await upstash(["keys", `${prefix}*`])) as string[];
      const result: Record<string, string> = {};
      await Promise.all(
        keys.map(async (k) => {
          result[k] = (await upstash(["get", k])) as string;
        })
      );
      return result;
    }
    // Read operation — read fresh without locking
    const store = readLocalStore();
    return Object.fromEntries(Object.entries(store).filter(([k]) => k.startsWith(prefix)));
  },
};