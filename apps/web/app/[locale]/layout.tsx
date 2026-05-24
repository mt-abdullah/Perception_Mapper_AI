import "../globals.css";
import { Outfit } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { ClerkProvider } from "../clerk-compat";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Perception Mapper AI",
  description: "Multilingual sentiment, tone, and cognitive bias analyzer for English, Tamil, and Sinhala.",
};

interface LayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LayoutProps) {
  const messages = await getMessages();

  // Gracefully fallback to a valid development/mock publishable key format
  // if no key is configured, avoiding runtime crashes.
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
                   !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder")
    ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    : "pk_test_ZGV2ZWxvcG1lbnQtc3VwcG9ydC05OS5jbGVyay5hY2NvdW50cy5kZXYk";

  return (
    <ClerkProvider publishableKey={clerkKey}>
      <html lang={locale} className={`${outfit.className} dark`}>
        <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
