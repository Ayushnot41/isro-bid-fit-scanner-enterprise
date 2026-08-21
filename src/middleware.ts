import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/tenders(.*)",
  "/evaluations(.*)",
  "/competitors(.*)",
  "/profile(.*)",
]);

// Routes for auth pages
const isAuthRoute = createRouteMatcher(["/login(.*)", "/register(.*)"]);

const hasClerkKeys =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY) &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes("dummy");

export default function middleware(req: any, event: any) {
  if (hasClerkKeys) {
    try {
      return clerkMiddleware((auth, req) => {
        const { userId } = auth();

        // Redirect unauthenticated users away from protected routes
        if (isProtectedRoute(req) && !userId) {
          const signInUrl = new URL("/login", req.url);
          signInUrl.searchParams.set("redirect_url", req.url);
          return NextResponse.redirect(signInUrl);
        }

        // Redirect authenticated users away from login/register
        if (isAuthRoute(req) && userId) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
      })(req, event);
    } catch {
      return NextResponse.next();
    }
  }

  // Graceful fallback if Clerk keys are not set in environment
  const pathname = req.nextUrl?.pathname || "";
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

  const demoSession = req.cookies?.get("demo_session")?.value;

  if (isProtected && !demoSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuth && demoSession) {
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
