"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Preloader from "../../../components/Preloader";

export default function ConfigurationRedirectPage() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const segments = pathname.split("/");
    const locale = segments[1] || "en";
    router.replace(`/${locale}/dashboard`);
  }, [router, pathname]);

  return <Preloader message="REDIRECTING TO USER DASHBOARD..." />;
}
export const dynamic = "force-dynamic";
