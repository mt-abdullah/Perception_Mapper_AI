"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const locale = pathname.split("/")[1] || "en";
    router.replace(`/${locale}/sign-in`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
