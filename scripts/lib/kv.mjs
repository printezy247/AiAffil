// Plain-JS twin of lib/kv.ts, for standalone Node scripts (like
// telegram-bot.mjs) that run outside the Next.js build and can't import a
// .ts file directly. Keep the two in sync if you change one.
import fs from "node:fs";
import path from "node:path";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const hasUpstash = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

const LOCAL_STORE_PATH = path.join(process.cwd(), ".local-kv-store.json");

function readLocalStore() {
  try {
    return JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function writeLocalStore(store) {
  fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(store, null, 2));
}

async function upstash(command) {
  const res = await fetch(`${UPSTASH_URL}/${command.map(encodeURIComponent).join("/")}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  const data = await res.json();
  return data.result;
}

export const kv = {
  isPersistent: hasUpstash,

  async get(key) {
    if (hasUpstash) return await upstash(["get", key]);
    return readLocalStore()[key] ?? null;
  },

  async set(key, value) {
    if (hasUpstash) {
      await upstash(["set", key, value]);
      return;
    }
    const store = readLocalStore();
    store[key] = value;
    writeLocalStore(store);
  },
};
