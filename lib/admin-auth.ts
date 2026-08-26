import { cookies } from "next/headers";

const COOKIE_NAME = "admin_auth";

// Deliberately simple: a shared-password cookie, not a hashed session token.
// Fine for a low-stakes internal dashboard (click counts, not customer data)
// on a small personal site — don't reuse this pattern for anything sensitive.
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_DASHBOARD_PASSWORD);
}

export async function isAdminAuthed(): Promise<boolean> {
  const password = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!password) return false; // fail closed if nothing is configured
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === password;
}

export async function setAdminAuthCookie(password: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}
