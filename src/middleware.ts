import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/lib/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static files and internal Next.js assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") ||
    pathname.startsWith("/monitoring")
  ) {
    return NextResponse.next();
  }

  // For API routes, inject tenant context and apply CORS headers
  if (pathname.startsWith("/api")) {
    const response = NextResponse.next();

    // Attach tenant headers if available
    const tenant = req.headers.get("x-tenant-id");
    if (tenant) {
      response.headers.set("x-tenant-id", tenant);
    }

    return response;
  }

  // Apply i18n middleware for all other routes
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!_next|monitoring|favicon).*)",
    "/(zh|en)/:path*",
  ],
};