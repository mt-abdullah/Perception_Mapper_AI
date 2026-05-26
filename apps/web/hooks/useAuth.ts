import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getMockSession, setMockSession, clearMockSession, validateAdminCredentials, MockUser } from "../lib/auth";

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<MockUser | null>(null);

  // Extract locale prefix
  const segments = pathname.split("/");
  const locale = segments[1] || "en";

  const syncSession = useCallback(() => {
    const session = getMockSession();
    setIsSignedIn(session.isSignedIn);
    setUser(session.user);
  }, []);

  useEffect(() => {
    setMounted(true);
    syncSession();
  }, [syncSession]);

  const signInUser = useCallback((email: string, name = "Standard User") => {
    setMockSession(email, "USER", name);
    syncSession();
    router.replace(`/${locale}/dashboard`);
    setTimeout(() => window.location.reload(), 150);
  }, [router, locale, syncSession]);

  const signInAdmin = useCallback((email: string, pass: string): { success: boolean; error?: string } => {
    const check = validateAdminCredentials(email, pass);
    if (!check.success) {
      return { success: false, error: "Invalid administrative credentials." };
    }
    setMockSession(email, "ADMIN", check.name);
    syncSession();
    router.replace(`/${locale}/admin/dashboard`);
    setTimeout(() => window.location.reload(), 150);
    return { success: true };
  }, [router, locale, syncSession]);

  const setRole = useCallback((newRole: "USER" | "ADMIN") => {
    if (!user) return;
    setMockSession(user.email, newRole, user.name);
    syncSession();
  }, [user, syncSession]);

  const signOut = useCallback(() => {
    clearMockSession();
    setIsSignedIn(false);
    setUser(null);
    router.replace(`/${locale}`);
    setTimeout(() => window.location.reload(), 150);
  }, [router, locale]);

  return {
    isSignedIn: mounted ? isSignedIn : false,
    user: mounted ? user : null,
    mounted,
    signInUser,
    signInAdmin,
    signOut,
    setRole,
  };
};
