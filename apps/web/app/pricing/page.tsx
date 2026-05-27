"use client";
import React, { useState } from 'react';
import PricingHero from '../../components/pricing/PricingHero';
import PricingCard from '../../components/pricing/PricingCard';
import ComparisonTable from '../../components/pricing/ComparisonTable';
import FAQAccordion from '../../components/pricing/FAQAccordion';
import TestimonialStrip from '../../components/pricing/TestimonialStrip';
import PricingCTABanner from '../../components/pricing/PricingCTABanner';
import { pricingPlans } from '../../components/pricing/pricingData';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans px-4 sm:px-6 lg:px-8 py-6 relative overflow-hidden">
      {/* Decorative premium radial glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] bg-indigo-500/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16 relative z-10">
        {/* Header Hero Section */}
        <PricingHero isAnnual={isAnnual} onToggleChange={setIsAnnual} />

        {/* 3-Plan Responsive Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} isAnnual={isAnnual} />
          ))}
        </div>

        {/* Social Proof Strip */}
        <TestimonialStrip />

        {/* Full Feature Comparison Grid */}
        <ComparisonTable />

        {/* Accordions FAQ Panel */}
        <FAQAccordion />

        {/* Bottom CTA conversions box */}
        <PricingCTABanner />
      </div>
    </div>
  );
}
