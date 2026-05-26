"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminRootRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const segments = pathname.split("/");
    const locale = segments[1] || "en";
    router.replace(`/${locale}/admin/dashboard`);
  }, [router, pathname]);

  return null;
}
