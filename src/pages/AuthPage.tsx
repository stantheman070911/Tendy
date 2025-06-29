// src/pages/AuthPage.tsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { usePlaceholderAuth } from '../context/PlaceholderAuthContext';

export const AuthPage: React.FC = () => {
  const { loginAsPlaceholder } = usePlaceholderAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // CRITICAL FIX: Extract navigation state to handle post-login redirection
  const navigationState = location.state as {
    from?: string;
    productId?: string;
    intendedDestination?: string;
    action?: string;
  } | null;

  const handleDemoLogin = (role: 'customer' | 'farmer' | 'host') => {
    try {
      // Use the placeholder auth system
      const user = loginAsPlaceholder(role);
      
      if (user) {
        // CRITICAL FIX: Handle post-login redirection based on navigation state
        if (navigationState?.intendedDestination) {
          // User was trying to access a specific product page
          console.log(`🔄 REDIRECT: User authenticated as ${role}, redirecting to intended destination: ${navigationState.intendedDestination}`);
          navigate(navigationState.intendedDestination, { replace: true });
        } else if (navigationState?.from && navigationState.from !== '/login') {
          // User was on a different page before being redirected to login
          console.log(`🔄 REDIRECT: User authenticated as ${role}, redirecting back to: ${navigationState.from}`);
          navigate(navigationState.from, { replace: true });
        } else {
          // Default redirect to dashboard
          console.log(`🔄 REDIRECT: User authenticated as ${role}, redirecting to dashboard`);
          navigate('/dashboard', { replace: true });
        }
      } else {
        console.error(`Could not log in as placeholder for role: ${role}`);
        alert(`Setup Error: No placeholder user found for role "${role}". Please check public/placeholder-users.json`);
      }
    } catch (error) {
      console.error('Demo login error:', error);
      alert('Demo login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-6 bg-parchment">
      <main className="w-full max-w-sm lg:max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden lg:grid lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-center p-12 bg-cover bg-center text-white relative" style={{backgroundImage: "url('https://images.unsplash.com/photo-1571500352252-78d19a2a7f5d?q=80&w=800&auto=format&fit=crop')"}}>
            <div className="absolute inset-0 bg-evergreen opacity-60"></div>
            <div className="relative z-10">
                <Link to="/" className="text-4xl font-lora font-bold text-white">Tendy</Link>
                <h1 className="text-4xl font-lora mt-8 leading-snug">Food with a story, from our fields to your family.</h1>
                <p className="mt-4 text-lg font-inter text-white/80">
                  Join a community connecting you directly with the land and the dedicated farmers who nurture it.
                </p>
            </div>
        </div>
        
        <div className="p-8 lg:p-12">
           <Link to="/" className="text-center block mb-6 text-4xl font-lora font-bold text-evergreen lg:hidden">Tendy</Link>
           
           {/* Show context-aware messaging based on navigation state */}
           {navigationState?.intendedDestination && (
             <div className="mb-6 p-4 bg-harvest-gold/10 rounded-lg border border-harvest-gold/20">
               <div className="flex items-center gap-2 mb-2">
                 <i className="ph-bold ph-info text-harvest-gold"></i>
                 <h3 className="font-semibold text-evergreen">Sign in to continue</h3>
               </div>
               <p className="text-sm text-charcoal/80">
                 {navigationState.action === 'join-group' 
                   ? 'You need to sign in to join this group buy.'
                   : 'You need to sign in to view product details.'
                 }
               </p>
             </div>
           )}
           
           {/* Demo Login Section for Judges */}
           <div className="mb-8 p-6 bg-harvest-gold/10 rounded-xl border border-harvest-gold/20">
             <div className="text-center mb-4">
               <h2 className="text-2xl font-lora text-evergreen mb-2">🎯 Hackathon Demo</h2>
               <p className="text-sm text-charcoal/80">
                 Quick access for judges - experience different user roles instantly
               </p>
             </div>
             
             <div className="space-y-3">
               <button
                 onClick={() => handleDemoLogin('customer')}
                 className="w-full h-12 flex items-center justify-center bg-evergreen text-parchment font-bold rounded-lg hover:opacity-90 transition-opacity"
               >
                 <i className="ph-bold ph-shopping-cart mr-2"></i>
                 Experience as Customer
               </button>
               
               <button
                 onClick={() => handleDemoLogin('farmer')}
                 className="w-full h-12 flex items-center justify-center bg-success text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
               >
                 <i className="ph-bold ph-plant mr-2"></i>
                 Experience as Farmer
               </button>
               
               <button
                 onClick={() => handleDemoLogin('host')}
                 className="w-full h-12 flex items-center justify-center bg-harvest-gold text-evergreen font-bold rounded-lg hover:opacity-90 transition-opacity"
               >
                 <i className="ph-bold ph-house-line mr-2"></i>
                 Experience as Host
               </button>
             </div>
           </div>
            
            <div className="mt-lg pt-lg border-t border-stone/20">
              <Link to="/" className="w-full h-12 flex items-center justify-center gap-x-2 text-charcoal font-semibold border border-stone/30 rounded-lg hover:bg-parchment transition-colors">
                <i className="ph ph-arrow-left"></i>
                <span>Go Back to Home</span>
              </Link>
            </div>
        </div>
      </main>
    </div>
  );
};