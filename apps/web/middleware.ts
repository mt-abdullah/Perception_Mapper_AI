import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "ta", "si"],
  defaultLocale: "en",
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en|ta|si)/:path*"],
};
