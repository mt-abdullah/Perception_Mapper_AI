"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { useDashboard } from "../../../hooks/useDashboard";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import Preloader from "../../../components/Preloader";
import ProDashboard from "../../../components/dashboard/ProDashboard";
import BatchProcessor from "../../../components/dashboard/BatchProcessor";
import BiasNetworkGraph from "../../../components/dashboard/BiasNetworkGraph";
import SentimentMetricsDashboard from "../../../components/dashboard/SentimentMetricsDashboard";
import PromptSandbox from "../../../components/dashboard/PromptSandbox";
import StripeCheckoutModal from "../../../components/pricing/StripeCheckoutModal";
import { SubscriptionTier } from "../../../lib/auth";

export default function BasicDashboardPage() {
  const router = useRouter();
  const { isSignedIn, user, mounted, setTier } = useAuth();
  const db = useDashboard();
  const [checkoutPlan, setCheckoutPlan] = useState<{ id: 'free' | 'basic' | 'pro'; price: number; name: string } | null>(null);

  useEffect(() => {
    if (mounted && !isSignedIn) router.replace("/sign-in");
  }, [mounted, isSignedIn, router]);

  if (!mounted || !isSignedIn || !user) return <Preloader message="CONNECTING PERCEPTION BASIC PORTAL..." />;

  const handleUpgrade = (tier: SubscriptionTier) => {
    if (tier === "FREE") return setTier("FREE");
    const name = tier === "BASIC" ? "Basic Plan" : "Pro Plan";
    const price = tier === "BASIC" ? 19 : 59;
    setCheckoutPlan({ id: tier.toLowerCase() as any, price, name });
  };

  return (
    <DashboardLayout theme="basic" activePage="basic">
      <div className="space-y-8 select-none text-left">
        <ProDashboard db={db} onUpgrade={handleUpgrade} />
        <BatchProcessor />
        <BiasNetworkGraph />
        <SentimentMetricsDashboard />
        <PromptSandbox />
      </div>

      {checkoutPlan && (
        <StripeCheckoutModal
          isOpen={checkoutPlan !== null} onClose={() => setCheckoutPlan(null)}
          planId={checkoutPlan.id} planName={checkoutPlan.name} planPrice={checkoutPlan.price}
          userEmail={user.email} onSuccess={(t) => setTier(t)}
        />
      )}
    </DashboardLayout>
  );
}
