import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useCounter } from '../hooks/useCounter';

interface StatItem {
  target: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

const stats: StatItem[] = [
  { target: 150, label: 'Farmers Supported', suffix: '+' },
  { target: 2500, label: 'Neighbors Joined', suffix: '+' },
  { target: 50, label: 'Saved Together', prefix: '$', suffix: 'k+' },
];

export const CommunityStats: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.5 });

  return (
    <section 
      ref={ref}
      className={`py-xl border-y border-stone/10 fade-in-section ${isIntersecting ? 'is-visible' : ''}`}
    >
      <div className="container mx-auto max-w-screen-xl px-md md:px-lg">
        <div className="grid md:grid-cols-3 gap-lg md:gap-xl text-center">
          {stats.map((stat) => {
            const count = useCounter({ target: stat.target }, isIntersecting);
            
            return (
              <div key={stat.label}>
                <h2 className="text-5xl md:text-6xl font-lora text-evergreen font-medium">
                  {stat.prefix}{count}{stat.suffix}
                </h2>
                <p className="text-body mt-2">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};