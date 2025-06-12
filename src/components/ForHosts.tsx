import React from 'react';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useAuth } from '../context/AuthContext';

const benefits = [
  'Earn <strong>5-8% credit</strong> on every group order you host.',
  'Set a pickup window that works for your schedule.',
  'Get to know your local farmers and neighbors.',
];

export const ForHosts: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver();
  const { isLoggedIn, user } = useAuth();

  // Determine the correct button text and destination based on auth status and role
  const getHostButtonProps = () => {
    if (!isLoggedIn) {
      return {
        to: '/login',
        text: 'Sign In to Apply'
      };
    }
    
    if (user?.role === 'host') {
      return {
        to: '/dashboard',
        text: 'Go to Host Dashboard'
      };
    }
    
    return {
      to: '/apply-to-host',
      text: 'Apply to Become a Host'
    };
  };

  const buttonProps = getHostButtonProps();

  return (
    <section
      id="for-hosts"
      ref={ref}
      className={`py-xl md:py-3xl scroll-mt-24 fade-in-section ${isIntersecting ? 'is-visible' : ''}`}
    >
      <div className="grid md:grid-cols-2 gap-lg md:gap-xl items-center">
        <div className="text-center md:text-left">
          <i className="ph-bold ph-house-line text-harvest-gold text-6xl mx-auto md:mx-0"></i>
          <h2 className="text-4xl md:text-5xl mt-sm">Become a Neighborhood Host</h2>
          <p className="text-body mt-md">
            Be the heart of your local food community. Hosts are the essential link, 
            providing a convenient pickup spot for their neighbors.
          </p>
          
          <ul className="mt-lg space-y-sm text-body text-left">
            {benefits.map((benefit, index) => {
              const { ref: benefitRef, isIntersecting: benefitVisible } = useIntersectionObserver();
              
              return (
                <li
                  key={index}
                  ref={benefitRef}
                  className={`flex items-start gap-3 fade-in-section ${benefitVisible ? 'is-visible' : ''}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <i className="ph-fill ph-check-circle text-success text-2xl mt-1 flex-shrink-0"></i>
                  <span dangerouslySetInnerHTML={{ __html: benefit }} />
                </li>
              );
            })}
          </ul>
          
          <div className="mt-lg">
            <Link
              to={buttonProps.to}
              className="h-14 px-lg inline-flex items-center justify-center bg-harvest-gold text-evergreen font-bold text-lg rounded-lg hover:scale-105 transition-transform"
            >
              {buttonProps.text}
            </Link>
          </div>
        </div>
        
        <div>
          <img
            width="800"
            height="1000"
            loading="lazy"
            src="https://images.unsplash.com/photo-1620207499454-73896503b5f7?q=80&w=800&auto=format&fit=crop"
            alt="A friendly host handing a box of fresh vegetables to a neighbor"
            className="w-full h-full object-cover rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};