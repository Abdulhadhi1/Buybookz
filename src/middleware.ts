import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession, updateSession } from "@/lib/auth";

export const runtime = "experimental-edge";

export async function middleware(request: NextRequest) {
  // Update session if it exists
  const sessionResponse = await updateSession(request);

  // Protect routes
  const session = await getSession();
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/checkout", "/profile", "/admin", "/orders"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin protection
  if (pathname.startsWith("/admin") && session?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return sessionResponse || NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
