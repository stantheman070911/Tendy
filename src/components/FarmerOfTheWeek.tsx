import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export const FarmerOfTheWeek: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <section
      ref={ref}
      className={`py-xl md:py-2xl scroll-mt-24 fade-in-section ${isIntersecting ? 'is-visible' : ''}`}
    >
      <div className="grid md:grid-cols-12 gap-lg md:gap-xl items-center">
        <div className="md:col-span-7">
          <img
            width="1200"
            height="800"
            loading="lazy"
            src="https://images.unsplash.com/photo-1571500352252-78d19a2a7f5d?q=80&w=1200&auto=format&fit=crop"
            alt="Farmer Maria Rodriguez smiling in her field of crops"
            className="w-full object-cover rounded-xl shadow-lg"
          />
        </div>
        <div className="md:col-span-5">
          <p className="font-semibold text-stone tracking-widest uppercase">
            Farmer of the Week
          </p>
          <h2 className="text-4xl md:text-5xl mt-sm leading-tight">
            Maria Rodriguez
          </h2>
          <p className="mt-md text-xl italic text-charcoal/90 font-lora">
            "For three generations, my family has worked this land. We don't just sell 
            vegetables; we share a piece of our history in every harvest."
          </p>
          <a
            href="#"
            className="mt-lg text-lg font-semibold text-evergreen flex items-center gap-2 group"
          >
            <span>Read Her Full Story</span>
            <i 
              className="ph-bold ph-arrow-right text-xl group-hover:translate-x-1 transition-transform" 
            ></i>
          </a>
        </div>
      </div>
    </section>
  );
};