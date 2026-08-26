"use client";

import { useState } from "react";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong");
        return;
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong — try again");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-900/40 dark:bg-green-900/10">
        <p className="font-medium text-green-800 dark:text-green-300">You&apos;re in! Check your inbox soon.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-black/10 bg-black/[0.02] p-6 dark:border-white/10 dark:bg-white/5">
      <h3 className="mb-1 text-lg font-semibold">Get one tool a week, picked for you</h3>
      <p className="mb-4 text-sm text-black/60 dark:text-white/60">No spam. Unsubscribe anytime.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-white/15 dark:bg-white/5"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {status === "loading" ? "Joining..." : "Join free"}
        </button>
      </form>
      {status === "error" && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errorMsg}</p>}
    </div>
  );
}
