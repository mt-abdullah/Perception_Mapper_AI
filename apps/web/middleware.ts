// apps/web/middleware.ts
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

// Internationalization middleware
const intlMiddleware = createMiddleware({
  locales: ["en", "ta", "si"],
  defaultLocale: "en",
});

export default async function middleware(request) {
  // First run the i18n middleware
  const response = await intlMiddleware(request);

  const { pathname } = request.nextUrl;
  // Simple mock auth check: cookie "pm_mock_signed_in" set to "true"
  const signedInCookie = request.cookies.get("pm_mock_signed_in");
  const isSignedIn = signedInCookie?.value === "true";

  // Protect dashboard route
  if (pathname.startsWith("/dashboard") && !isSignedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Protect admin route (optional, similar logic can be added)
  if (pathname.startsWith("/admin") && !isSignedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Match all routes including dashboard and admin
  matcher: ["/", "/dashboard/:path*", "/admin/:path*", "/(en|ta|si)/:path*"],
};
