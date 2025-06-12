import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const benefits = [
  {
    icon: 'ph-bold ph-tag',
    title: 'Set Fair Prices',
    description: 'You control your pricing. We provide the platform to sell directly, ensuring you keep the profit you deserve.',
    delay: 0,
  },
  {
    icon: 'ph-bold ph-leaf',
    title: 'Reduce Waste',
    description: 'Group buying means you harvest exactly what\'s ordered. No more wasted crops or lost income.',
    delay: 200,
  },
  {
    icon: 'ph-bold ph-chat-circle-dots',
    title: 'Build Relationships',
    description: 'Share your story and connect with customers who care about where their food comes from.',
    delay: 400,
  },
];

export const ForFarmers: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <section
      id="for-farmers"
      ref={ref}
      className={`py-xl md:py-3xl bg-evergreen/5 scroll-mt-24 fade-in-section ${isIntersecting ? 'is-visible' : ''}`}
    >
      <div className="container mx-auto max-w-screen-xl px-md md:px-lg">
        <div className="text-center max-w-3xl mx-auto mb-2xl">
          <h2 className="text-4xl md:text-5xl">How We Help You Thrive</h2>
          <p className="text-body mt-md">
            We provide the tools and community to help your farm succeed, letting you focus 
            on what you do best: growing amazing food.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-lg md:gap-xl text-center">
          {benefits.map((benefit, index) => {
            const { ref: benefitRef, isIntersecting: benefitVisible } = useIntersectionObserver();
            
            return (
              <div
                key={index}
                ref={benefitRef}
                className={`fade-in-section ${benefitVisible ? 'is-visible' : ''}`}
                style={{ transitionDelay: `${benefit.delay}ms` }}
              >
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <i className={`${benefit.icon} text-evergreen text-5xl`}></i>
                </div>
                <h3 className="text-2xl mt-md">{benefit.title}</h3>
                <p className="text-body mt-2 text-base">{benefit.description}</p>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-2xl">
          <a
            href="#"
            className="h-16 px-lg inline-flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:scale-105 transition-transform"
          >
            List Your Farm
          </a>
        </div>
      </div>
    </section>
  );
};