"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function LandingRedirect() {
  const router = useRouter();
  const { isSignedIn, user, mounted } = useAuth();

  useEffect(() => {
    if (mounted) {
      if (isSignedIn && user) {
        if (user.role === "ADMIN") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/dashboard");
        }
      } else {
        router.replace("/sign-in");
      }
    }
  }, [mounted, isSignedIn, user, router]);

  return null;
}
