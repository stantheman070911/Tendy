import React from 'react';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useAuth } from '../context/AuthContext';

const benefits = [
  'Earn <strong>5-8% credit</strong> on every group order you host.',
  'Set a pickup window that works for your schedule.',
  'Get to know your local farmers and neighbors.',
];

// SPECIFICATION FIX: Icon component for consistent styling using 8px grid system
const FeatureIcon: React.FC<{ iconClass: string }> = ({ iconClass }) => (
  <div className="flex items-center justify-center w-16 h-16 bg-harvest-gold/10 rounded-full mb-4">
    <i className={`ph-bold ${iconClass} text-harvest-gold text-4xl`}></i>
  </div>
);

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
      className={`py-16 md:py-24 scroll-mt-24 fade-in-section ${isIntersecting ? 'is-visible' : ''}`}
    >
      <div className="container mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          
          {/* Content Section */}
          <div className="text-center md:text-left">
            <FeatureIcon iconClass="ph-house-line" />
            
            {/* SPECIFICATION FIX: Consistent heading with proper spacing */}
            <h2 className="text-4xl md:text-5xl font-lora text-evergreen mt-4">
              Become a Neighborhood Host
            </h2>
            
            {/* SPECIFICATION FIX: Consistent paragraph spacing using 8px grid (mt-4) */}
            <p className="text-lg text-charcoal mt-4 max-w-2xl">
              Be the heart of your local food community. Hosts are the essential link, 
              providing a convenient pickup spot for their neighbors.
            </p>
            
            {/* SPECIFICATION FIX: Benefits list with consistent spacing (mt-8, space-y-2) */}
            <ul className="mt-8 space-y-2 text-left">
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
                    <span 
                      className="text-charcoal" 
                      dangerouslySetInnerHTML={{ __html: benefit }} 
                    />
                  </li>
                );
              })}
            </ul>
            
            {/* SPECIFICATION FIX: CTA button with consistent spacing (mt-8) */}
            <div className="mt-8">
              <Link
                to={buttonProps.to}
                className="inline-flex items-center justify-center bg-harvest-gold text-evergreen font-bold text-lg py-4 px-8 rounded-lg hover:scale-105 transition-transform shadow-lg shadow-harvest-gold/20"
              >
                {buttonProps.text}
              </Link>
            </div>
          </div>
          
          {/* Image Section */}
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

        {/* SPECIFICATION FIX: Additional features section with consistent spacing */}
        <div className="mt-16 md:mt-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-lora text-evergreen">
              Why Become a Host?
            </h3>
            <p className="mt-4 text-charcoal max-w-2xl mx-auto">
              Hosting is more than just providing a pickup location - you're building community connections.
            </p>
          </div>

          {/* SPECIFICATION FIX: Feature grid with consistent gap (gap-8) */}
          <div className="grid md:grid-cols-3 gap-8 text-center">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <FeatureIcon iconClass="ph-hand-heart" />
              <h4 className="text-2xl font-lora text-evergreen">Earn Rewards</h4>
              {/* SPECIFICATION FIX: Consistent top margin for paragraph (mt-2) */}
              <p className="mt-2 text-charcoal">
                Receive tangible rewards from the commission of every successful group buy you facilitate.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <FeatureIcon iconClass="ph-users-three" />
              <h4 className="text-2xl font-lora text-evergreen">Build Community</h4>
              {/* SPECIFICATION FIX: Consistent top margin for paragraph (mt-2) */}
              <p className="mt-2 text-charcoal">
                Create a trusted local network, strengthen neighborhood bonds, and be the reason for fresher food on tables.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <FeatureIcon iconClass="ph-leaf" />
              <h4 className="text-2xl font-lora text-evergreen">Reduce Waste</h4>
              {/* SPECIFICATION FIX: Consistent top margin for paragraph (mt-2) */}
              <p className="mt-2 text-charcoal">
                Play an active role in our mission by ensuring that fresh, local produce finds a home.
              </p>
            </div>
          </div>
        </div>

        {/* SPECIFICATION FIX: Host requirements section with consistent spacing */}
        <div className="mt-16 bg-harvest-gold/10 rounded-xl p-8 border border-harvest-gold/20">
          <h3 className="text-2xl font-lora text-evergreen mb-6 text-center">
            Host Requirements
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-charcoal">
            <div>
              <h4 className="font-semibold mb-2">Basic Requirements</h4>
              <ul className="space-y-1 text-sm">
                <li>• Must be 18+ years old</li>
                <li>• Reliable availability for scheduled pickup windows</li>
                <li>• Safe, accessible pickup location</li>
                <li>• Pass background verification</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Commitment</h4>
              <ul className="space-y-1 text-sm">
                <li>• Commit to hosting for at least 6 months</li>
                <li>• Respond to group member questions promptly</li>
                <li>• Maintain pickup location cleanliness</li>
                <li>• Follow food safety guidelines</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};