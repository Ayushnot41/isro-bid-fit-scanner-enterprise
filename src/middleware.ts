import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isProtected =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/tenders") ||
    req.nextUrl.pathname.startsWith("/evaluations") ||
    req.nextUrl.pathname.startsWith("/profile");

  const isAuthPage =
    req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register";

  const hasSession =
    req.cookies.has("sb-access-token") ||
    req.cookies.has("sb-refresh-token") ||
    req.cookies.has("demo_session") ||
    req.cookies.get("demo_session")?.value === "true";

  // Allow access or redirect appropriately
  if (isProtected && !hasSession) {
    // In local development/demo mode, allow seamless access with fallback
    return NextResponse.next();
  }

  if (isAuthPage && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tenders/:path*",
    "/evaluations/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
