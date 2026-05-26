"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function LandingRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, user, mounted } = useAuth();

  useEffect(() => {
    if (mounted && isSignedIn && user) {
      const locale = pathname.split("/")[1] || "en";
      if (user.role === "ADMIN") {
        router.replace(`/${locale}/admin/dashboard`);
      } else {
        router.replace(`/${locale}/dashboard`);
      }
    }
  }, [mounted, isSignedIn, user, router, pathname]);

  return null;
}
