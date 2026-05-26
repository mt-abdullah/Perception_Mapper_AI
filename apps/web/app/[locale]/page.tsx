"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import LandingHero from "../../components/LandingHero";
import LandingFeatures from "../../components/LandingFeatures";
import LandingPricing from "../../components/LandingPricing";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Preloader from "../../components/Preloader";

export default function SupernovaLanding() {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, user, mounted } = useAuth();

  // Extract locale prefix
  const segments = pathname.split("/");
  const locale = segments[1] || "en";

  useEffect(() => {
    if (mounted && isSignedIn && user) {
      if (user.role === "ADMIN") {
        router.replace(`/${locale}/admin/dashboard`);
      } else {
        router.replace(`/${locale}/dashboard`);
      }
    }
  }, [mounted, isSignedIn, user, router, locale]);

  const handleSignUpClick = () => {
    router.push(`/${locale}/sign-in`);
  };

  if (!mounted || (isSignedIn && user)) {
    return <Preloader message="ESTABLISHING CORE AI PROTOCOLS..." />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      <div className="absolute top-[-25%] left-[-20%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-25%] w-[80%] h-[80%] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[50%] h-[50%] rounded-full bg-pink-500/3 blur-[130px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-24 space-y-20 relative z-10">
        <LandingHero onSignUp={handleSignUpClick} loadingAction={null} />
        <LandingFeatures />
        <LandingPricing onSignUp={handleSignUpClick} loadingAction={null} />
      </main>

      <Footer />
    </div>
  );
}
export const dynamic = "force-dynamic";
