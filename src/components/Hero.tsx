import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export const Hero: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <section 
      ref={ref}
      className={`py-3xl md:py-4xl fade-in-section ${isIntersecting ? 'is-visible' : ''}`}
    >
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight">
          Food with a story.
        </h1>
        <p className="text-body mt-xl max-w-3xl mx-auto">
          A community marketplace connecting you directly with the land and the dedicated 
          farmers who nurture it. Join group buys, share in the harvest, and rediscover 
          food with a story.
        </p>
        <div className="mt-2xl max-w-lg mx-auto flex flex-col sm:flex-row gap-md">
          <a
            href="#discover"
            className="flex-1 h-16 flex items-center justify-center bg-harvest-gold text-evergreen font-bold text-lg rounded-lg hover:scale-105 transition-transform shadow-lg shadow-harvest-gold/20"
          >
            Find Local Food
          </a>
          <a
            href="#for-farmers"
            className="flex-1 h-16 flex items-center justify-center bg-transparent border-2 border-evergreen/50 text-evergreen font-bold text-lg rounded-lg hover:border-evergreen transition-colors"
          >
            I'm a Farmer
          </a>
        </div>
      </div>
    </section>
  );
};