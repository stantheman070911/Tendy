import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const groupTypes = [
  {
    icon: 'ph-bold ph-sparkle',
    title: 'One-Time Buys',
    description: 'Perfect for trying a new farm or a seasonal specialty. Join a public group or create a private one for your friends. If the minimum order isn\'t met in 5 days, the group cancels automatically.',
  },
  {
    icon: 'ph-bold ph-calendar-check',
    title: 'Subscriptions',
    description: 'Get recurring monthly deliveries of your farm favorites for 3, 6, or 12 months. Lock in pricing, enjoy seasonal variety, and get automated monthly billing. It\'s the easiest way to support local.',
  },
];

export const GroupTypes: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver();

  return (
    <section
      ref={ref}
      className={`py-2xl md:py-4xl fade-in-section ${isIntersecting ? 'is-visible' : ''}`}
    >
      <div className="text-center max-w-3xl mx-auto mb-3xl">
        <h2 className="text-4xl md:text-5xl">Two Ways to Join</h2>
        <p className="text-body mt-lg">
          Whether you want to try something new or stock up on your favorites, there's a group for you.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-xl md:gap-2xl">
        {groupTypes.map((type, index) => {
          const iconColor = index === 0 ? 'text-harvest-gold' : 'text-evergreen';
          const bgColor = index === 0 ? 'bg-harvest-gold/10' : 'bg-evergreen/10';
          
          return (
            <div
              key={index}
              className="bg-white p-xl rounded-xl border border-stone/10 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="flex items-center gap-md">
                <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center`}>
                  <i className={`${type.icon} ${iconColor} text-4xl`}></i>
                </div>
                <h3 className="text-3xl">{type.title}</h3>
              </div>
              <p className="text-body mt-lg">{type.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};