// apps/web/components/Providers.tsx
"use client";

import { ClerkProvider } from "../app/clerk-compat";
import { NextIntlClientProvider } from "next-intl";

interface ProvidersProps {
  children: React.ReactNode;
  messages: any;
  locale: string;
}

export default function Providers({ children, messages, locale }: ProvidersProps) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("placeholder")
    ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    : "pk_test_ZGV2ZWxvcG1lbnQtc3VwcG9ydC05OS5jbGVyay5hY2NvdW50cy5kZXYk";

  return (
    <ClerkProvider publishableKey={clerkKey}>
      <NextIntlClientProvider messages={messages} locale={locale}>
        {children}
      </NextIntlClientProvider>
    </ClerkProvider>
  );
}
