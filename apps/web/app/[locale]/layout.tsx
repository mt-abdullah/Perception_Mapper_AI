
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { ClerkProvider } from "../clerk-compat";
import ThemeProviderWrapper from "../ThemeProviderWrapper";

export const metadata = {
  title: "Perception Mapper AI",
  description: "Multilingual sentiment, tone, and cognitive bias analyzer for English, Tamil, and Sinhala.",
};

export const dynamic = "force-dynamic";

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
  const messages = await getMessages({ locale });

  // Gracefully fallback to a valid development/mock publishable key format
  // if no key is configured, avoiding runtime crashes.
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
                   !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder")
    ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    : "pk_test_ZGV2ZWxvcG1lbnQtc3VwcG9ydC05OS5jbGVyay5hY2NvdW50cy5kZXYk";

  return (
    <ClerkProvider publishableKey={clerkKey}>
      <ThemeProviderWrapper>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </ThemeProviderWrapper>
    </ClerkProvider>
  );
}
