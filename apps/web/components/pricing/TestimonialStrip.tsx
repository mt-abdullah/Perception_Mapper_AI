import React from 'react';
import { Star } from 'lucide-react';
import { testimonials } from './pricingData';

export default function TestimonialStrip() {
  return (
    <section className="space-y-6 py-12 select-none max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <span className="text-[9px] font-bold text-indigo-400 bg-indigo-950/30 border border-indigo-500/20 rounded-md px-2.5 py-0.5 uppercase tracking-widest">
          Trusted Globally
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
          What Our Clients Say
        </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/30 flex flex-col justify-between space-y-4 hover:border-indigo-500/20 transition duration-300"
          >
            <div className="space-y-2.5">
              {/* Star Rating */}
              <div className="flex space-x-0.5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
                "{t.quote}"
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white tracking-wide">{t.author}</h4>
              <span className="text-[10px] text-slate-400 font-semibold">{t.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
