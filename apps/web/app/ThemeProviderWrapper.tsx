"use client";

import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

// Wrapper to ensure theme is only applied on the client after mounting.
export default function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent SSR mismatches by rendering nothing until mounted.
  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
