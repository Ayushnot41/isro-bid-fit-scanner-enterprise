import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = [
    "/dashboard",
    "/tenders",
    "/evaluations",
    "/competitors",
    "/profile",
  ].some((path) => pathname.startsWith(path));

  const isAuth = ["/login", "/register"].some((path) =>
    pathname.startsWith(path)
  );

  // Check for Clerk session token, Supabase token, or demo session cookie
  const clerkToken =
    req.cookies.get("__session")?.value ||
    req.cookies.get("__client_uat")?.value;
  const demoSession = req.cookies.get("demo_session")?.value;
  const supabaseToken = req.cookies.get("sb-access-token")?.value;

  const isAuthenticated = Boolean(clerkToken || demoSession || supabaseToken);

  // Redirect unauthenticated visitors trying to access protected dashboards
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from /login or /register
  if (isAuth && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
