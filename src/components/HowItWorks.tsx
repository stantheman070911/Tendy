import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const steps = [
  {
    icon: 'ph-bold ph-compass',
    title: '1. Discover & Explore',
    description: 'Find local farms and see what\'s in season. Read their stories and learn about their growing practices.',
    delay: 0,
  },
  {
    icon: 'ph-bold ph-users-three',
    title: '2. Join a Group',
    description: 'Join a group buy for a product you love. When enough neighbors join, the order is confirmed.',
    delay: 200,
  },
  {
    icon: 'ph-bold ph-hand-heart',
    title: '3. Share the Harvest',
    description: 'Pick up your fresh food from a neighborhood host. Enjoy healthier food while supporting your local farmers.',
    delay: 400,
  },
];

export const HowItWorks: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <section
      id="how-it-works-supporter"
      ref={ref}
      className={`py-2xl md:py-4xl scroll-mt-24 fade-in-section ${isIntersecting ? 'is-visible' : ''}`}
    >
      <div className="text-center max-w-3xl mx-auto mb-3xl">
        <h2 className="text-4xl md:text-5xl">How Supporting Works</h2>
        <p className="text-body mt-lg">
          A simple, community-powered way to buy directly from local producers.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-xl md:gap-2xl text-center">
        {steps.map((step, index) => {
          const { ref: stepRef, isIntersecting: stepVisible } = useIntersectionObserver();
          
          return (
            <div
              key={index}
              ref={stepRef}
              className={`fade-in-section ${stepVisible ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${step.delay}ms` }}
            >
              <div className="w-24 h-24 bg-evergreen/10 rounded-full flex items-center justify-center mx-auto">
                <i className={`${step.icon} text-evergreen text-5xl`}></i>
              </div>
              <h3 className="text-2xl mt-lg">{step.title}</h3>
              <p className="text-body mt-sm text-base">{step.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};