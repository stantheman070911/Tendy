import React, { useState } from 'react';

const navigationLinks = [
  { label: 'Discover', href: '#discover' },
  { label: 'How It Works', href: '#how-it-works-supporter' },
  { label: 'For Farmers', href: '#for-farmers' },
];

const companyLinks = [
  { label: 'Our Mission', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'FAQ', href: '#' },
];

export const Footer: React.FC = () => {
  const [newsletterState, setNewsletterState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setNewsletterState('loading');
    
    setTimeout(() => {
      setNewsletterState('success');
      setEmail('');
      setTimeout(() => setNewsletterState('idle'), 4000);
    }, 1000);
  };

  return (
    <footer className="bg-evergreen text-parchment mt-xl">
      <div className="container mx-auto max-w-screen-xl px-md md:px-lg py-2xl">
        <div className="grid md:grid-cols-12 gap-xl">
          <div className="md:col-span-4">
            <h3 className="text-2xl text-parchment font-lora">Tendy</h3>
            <p className="mt-4 text-parchment/70">
              Connecting communities with local farmers, one group buy at a time.
            </p>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-bold text-parchment text-lg">Platform</h4>
            <ul className="mt-4 space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-parchment/70 hover:text-harvest-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-bold text-parchment text-lg">Company</h4>
            <ul className="mt-4 space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-parchment/70 hover:text-harvest-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-4">
            <h4 className="font-bold text-parchment text-lg">Stay in the loop</h4>
            <p className="mt-4 text-parchment/70">
              Get seasonal updates, new farmer stories, and recipes delivered to your inbox.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 bg-parchment/20 rounded-md text-parchment placeholder-parchment/50 border border-parchment/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
              />
              <button
                type="submit"
                disabled={newsletterState === 'loading'}
                className="h-12 px-6 bg-harvest-gold text-evergreen font-bold rounded-md hover:opacity-90 transition-opacity disabled:opacity-70"
              >
                {newsletterState === 'loading' ? '...' : 'Sign Up'}
              </button>
            </form>
            
            {newsletterState === 'success' && (
              <div className="mt-2 text-sm text-success font-semibold flex items-center gap-2">
                <i className="ph-fill ph-check-circle"></i>
                Thanks for subscribing!
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-2xl pt-lg border-t border-parchment/20 text-center text-parchment/50 text-sm">
          &copy; 2025 Tendy, Inc. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};