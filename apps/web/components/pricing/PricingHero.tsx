import React from 'react';
import PricingToggle from './PricingToggle';

interface PricingHeroProps {
  isAnnual: boolean;
  onToggleChange: (val: boolean) => void;
}

export default function PricingHero({ isAnnual, onToggleChange }: PricingHeroProps) {
  return (
    <section className="text-center space-y-4 max-w-2xl mx-auto py-12 sm:py-16 select-none">
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
        Simple, transparent pricing
      </h2>
      <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto font-medium">
        Start free. Upgrade when you need multilingual power, advanced bias scopes, or team workspace collaboration.
      </p>
      <div className="pt-6">
        <PricingToggle isAnnual={isAnnual} onChange={onToggleChange} />
      </div>
    </section>
  );
}
