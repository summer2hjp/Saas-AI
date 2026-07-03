import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/lib/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip API routes, static files, and internal Next.js assets
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") ||
    pathname.startsWith("/monitoring")
  ) {
    return NextResponse.next();
  }

  // Apply i18n middleware for all other routes
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!_next|monitoring|api|favicon).*)",
    "/(zh|en)/:path*",
  ],
};