import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { SESSION_COOKIE } from "./session";

export { SESSION_COOKIE };

// Derive a deterministic session token from the admin password. The cookie stores
// this token, never the password itself. Rotating ADMIN_PASSWORD invalidates all
// existing sessions.
function sessionToken(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD is not set");
  return createHmac("sha256", secret).update("admin-session-v1").digest("hex");
}

/** Constant-time comparison of two hex strings of equal length. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** True when the submitted password matches ADMIN_PASSWORD. */
export function verifyPassword(password: string): boolean {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  if (!secret) return false;
  // Pad to equal length for constant-time compare.
  const a = Buffer.from(password);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Set the httpOnly session cookie (call after a successful login). */
export function createSession(): void {
  cookies().set(SESSION_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
}

/** Remove the session cookie (logout). */
export function destroySession(): void {
  cookies().delete(SESSION_COOKIE);
}

/** True when the current request carries a valid admin session cookie. */
export function isAuthenticated(): boolean {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    return safeEqual(token, sessionToken());
  } catch {
    return false;
  }
}
