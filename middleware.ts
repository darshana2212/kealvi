import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create a Supabase client for middleware
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Protected routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/questions/create"];

export async function middleware(request: NextRequest) {
  // Skip middleware for public routes and API routes
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check if route requires authentication
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Get the session from the request
  const token = request.cookies.get("sb-auth-token");

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
