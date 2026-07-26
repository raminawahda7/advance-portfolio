import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

// Lightweight gate: redirect unauthenticated users away from /admin pages to the
// login screen. This only checks for the presence of the session cookie (edge
// runtime); the cookie's cryptographic validity is verified server-side in the
// admin page + on every /api/admin route via isAuthenticated().
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page itself through.
  if (pathname === "/admin/login") return NextResponse.next();

  if (pathname.startsWith("/admin")) {
    const hasCookie = req.cookies.has(SESSION_COOKIE);
    if (!hasCookie) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
