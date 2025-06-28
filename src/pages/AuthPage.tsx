// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export const AuthPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemoLogin, setShowDemoLogin] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  // Demo login function for judges
  const handleDemoLogin = async (role: 'supporter' | 'farmer' | 'host') => {
    setIsLoading(true);
    setError(null);

    try {
      // Demo credentials for each role
      const demoCredentials = {
        supporter: { email: 'demo.customer@tendy.app', password: 'demo123' },
        farmer: { email: 'demo.farmer@tendy.app', password: 'demo123' },
        host: { email: 'demo.host@tendy.app', password: 'demo123' }
      };

      const credentials = demoCredentials[role];
      
      // Try to sign in with demo credentials
      const { data, error: signInError } = await supabase.auth.signInWithPassword(credentials);
      
      if (signInError) {
        // If demo user doesn't exist, create them
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          options: {
            data: {
              full_name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
              role: role
            }
          }
        });

        if (signUpError) throw signUpError;
      }

      // Navigate to dashboard
      navigate(from, { replace: true });

    } catch (err: any) {
      console.error('Demo login error:', err);
      setError('Demo login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Regular login form state
  const [activeTab, setActiveTab] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleRegularSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let authResponse;
      if (activeTab === 'signUp') {
        authResponse = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
      } else {
        authResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      if (authResponse.error) throw authResponse.error;
      
      if (activeTab === 'signIn' || (activeTab === 'signUp' && authResponse.data.user && !authResponse.data.user.email_confirmed_at)) {
        navigate(from, { replace: true });
      }

    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (error) {
        setError(error.message);
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
           
           {/* Demo Login Section for Judges */}
           {showDemoLogin && (
             <div className="mb-8 p-6 bg-harvest-gold/10 rounded-xl border border-harvest-gold/20">
               <div className="text-center mb-4">
                 <h2 className="text-2xl font-lora text-evergreen mb-2">🎯 Hackathon Demo</h2>
                 <p className="text-sm text-charcoal/80">
                   Quick access for judges - experience different user roles instantly
                 </p>
               </div>
               
               <div className="space-y-3">
                 <button
                   onClick={() => handleDemoLogin('supporter')}
                   disabled={isLoading}
                   className="w-full h-12 flex items-center justify-center bg-evergreen text-parchment font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70"
                 >
                   {isLoading ? (
                     <i className="ph ph-spinner animate-spin mr-2"></i>
                   ) : (
                     <i className="ph-bold ph-shopping-cart mr-2"></i>
                   )}
                   Experience as Customer
                 </button>
                 
                 <button
                   onClick={() => handleDemoLogin('farmer')}
                   disabled={isLoading}
                   className="w-full h-12 flex items-center justify-center bg-success text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70"
                 >
                   {isLoading ? (
                     <i className="ph ph-spinner animate-spin mr-2"></i>
                   ) : (
                     <i className="ph-bold ph-plant mr-2"></i>
                   )}
                   Experience as Farmer
                 </button>
                 
                 <button
                   onClick={() => handleDemoLogin('host')}
                   disabled={isLoading}
                   className="w-full h-12 flex items-center justify-center bg-harvest-gold text-evergreen font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70"
                 >
                   {isLoading ? (
                     <i className="ph ph-spinner animate-spin mr-2"></i>
                   ) : (
                     <i className="ph-bold ph-house-line mr-2"></i>
                   )}
                   Experience as Host
                 </button>
               </div>
               
               <div className="mt-4 text-center">
                 <button
                   onClick={() => setShowDemoLogin(false)}
                   className="text-sm text-charcoal/60 hover:text-charcoal underline"
                 >
                   Use regular login instead
                 </button>
               </div>
             </div>
           )}

           {/* Regular Login Form */}
           {!showDemoLogin && (
             <>
               <div className="flex border-b border-stone/20 mb-lg">
                  <button onClick={() => setActiveTab('signIn')} className={`flex-1 pb-3 font-semibold text-lg transition-colors ${activeTab === 'signIn' ? 'text-evergreen border-b-2 border-evergreen' : 'text-stone border-b-2 border-transparent hover:text-evergreen'}`}>
                    Sign In
                  </button>
                  <button onClick={() => setActiveTab('signUp')} className={`flex-1 pb-3 font-semibold text-lg transition-colors ${activeTab === 'signUp' ? 'text-evergreen border-b-2 border-evergreen' : 'text-stone border-b-2 border-transparent hover:text-evergreen'}`}>
                    Sign Up
                  </button>
                </div>
                
                <form onSubmit={handleRegularSubmit} className="space-y-md">
                    <h2 className="text-2xl font-lora text-center text-evergreen">
                      {activeTab === 'signIn' ? 'Welcome Back' : 'Join the Community'}
                    </h2>
                    
                    {activeTab === 'signUp' && (
                        <div className="relative">
                            <i className="ph ph-user input-icon"></i>
                            <input 
                              type="text" 
                              placeholder="Full Name" 
                              value={fullName} 
                              onChange={(e) => setFullName(e.target.value)} 
                              className="form-input" 
                              required 
                            />
                        </div>
                    )}
                    <div className="relative">
                        <i className="ph ph-envelope input-icon"></i>
                        <input 
                          type="email" 
                          placeholder="Email Address" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          className="form-input" 
                          required 
                        />
                    </div>
                    <div className="relative">
                        <i className="ph ph-lock-key input-icon"></i>
                        <input 
                          type="password" 
                          placeholder={activeTab === 'signUp' ? 'Create Password (min 6 characters)' : 'Password'} 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          className="form-input" 
                          minLength={6}
                          required 
                        />
                    </div>

                    {activeTab === 'signIn' && (
                      <div className="text-right">
                        <a href="#" className="text-sm font-semibold text-evergreen hover:text-harvest-gold transition-colors">
                          Forgot Password?
                        </a>
                      </div>
                    )}

                    {activeTab === 'signUp' && (
                      <div className="flex items-start space-x-3 pt-2">
                        <input type="checkbox" id="terms" className="mt-1 h-5 w-5 rounded border-stone/50 text-harvest-gold focus:ring-harvest-gold" required />
                        <label htmlFor="terms" className="text-sm text-charcoal">
                          I agree to the <a href="#" className="font-semibold text-evergreen hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-evergreen hover:underline">Privacy Policy</a>.
                        </label>
                      </div>
                    )}

                    {error && (
                      <div className="p-3 rounded-md bg-error-light text-error text-sm text-center font-semibold">
                        {error}
                      </div>
                    )}
                    
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full h-14 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <i className="ph ph-spinner animate-spin mr-2"></i>
                          {activeTab === 'signIn' ? 'Signing In...' : 'Creating Account...'}
                        </>
                      ) : (
                        activeTab === 'signIn' ? 'Sign In' : 'Create Account'
                      )}
                    </button>
                </form>
                
                <div className="flex items-center my-lg">
                  <hr className="flex-grow border-stone/20" />
                  <span className="px-4 text-sm font-semibold text-stone">OR</span>
                  <hr className="flex-grow border-stone/20" />
                </div>
                
                <div className="space-y-sm">
                    <button 
                      onClick={handleGoogleSignIn} 
                      className="w-full h-12 flex items-center justify-center border border-stone/30 rounded-lg hover:bg-parchment transition-colors"
                    >
                      <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_24dp.png" alt="Google icon" className="w-5 h-5 mr-3" /> 
                      <span className="font-semibold text-charcoal text-md">Continue with Google</span>
                    </button>
                </div>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowDemoLogin(true)}
                    className="text-sm text-harvest-gold hover:text-evergreen underline font-semibold"
                  >
                    ← Back to Demo Login
                  </button>
                </div>
             </>
           )}
            
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