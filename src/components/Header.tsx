import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { NavigationItem } from '../types';

interface HeaderProps {
  isLoggedIn?: boolean;
}

const navigationItems: NavigationItem[] = [
  { label: 'Discover', href: '#discover' },
  { label: 'How It Works', href: '#how-it-works-supporter' },
  { label: 'For Farmers', href: '#for-farmers' },
];

export const Header: React.FC<HeaderProps> = ({ isLoggedIn = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user, isLoggedIn: authIsLoggedIn } = useAuth();

  // Use the auth context's isLoggedIn state instead of the prop
  const actualIsLoggedIn = authIsLoggedIn;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.classList.toggle('overflow-hidden');
  };

  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  const handleLogout = async () => {
    await logout();
    handleLinkClick();
  };

  // Get user display name from Supabase user metadata
  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Use part before @ as fallback
    }
    return 'User';
  };

  return (
    <>
      <header className="h-24 flex items-center sticky top-0 z-50 bg-parchment/80 backdrop-blur-md border-b border-stone/10">
        <div className="container mx-auto max-w-screen-xl px-md md:px-lg flex justify-between items-center">
          <Link to="/" className="text-3xl font-lora font-bold text-evergreen">
            Tendy
          </Link>
          
          <nav className="hidden md:flex items-center space-x-lg">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-lg text-evergreen font-medium link-underline"
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-sm">
            {actualIsLoggedIn ? (
              <div className="flex items-center space-x-sm">
                <Link to="/dashboard" className="flex items-center gap-3">
                  <span className="font-semibold text-charcoal">{getUserDisplayName()}</span>
                  <img src="https://i.pravatar.cc/40?img=10" alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-harvest-gold"/>
                </Link>
                <button
                  onClick={handleLogout}
                  className="h-12 px-6 flex items-center justify-center text-evergreen font-semibold rounded-full hover:bg-evergreen/10 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="h-12 px-6 flex items-center justify-center text-evergreen font-semibold rounded-full hover:bg-evergreen/10 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="h-12 px-6 flex items-center justify-center bg-evergreen text-parchment font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
          
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-evergreen text-3xl z-50"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <i className="ph ph-x"></i> : <i className="ph ph-list"></i>}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-parchment z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="mt-32 flex flex-col items-center space-y-lg text-center">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className="text-2xl text-evergreen font-medium"
            >
              {item.label}
            </a>
          ))}
          <hr className="w-24 border-stone/20 my-lg" />
          {actualIsLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                onClick={handleLinkClick}
                className="h-14 px-8 flex items-center justify-center bg-evergreen text-parchment font-semibold rounded-full text-xl"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="h-14 px-8 flex items-center justify-center text-evergreen font-semibold rounded-full bg-evergreen/10 text-xl"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="h-14 px-8 flex items-center justify-center text-evergreen font-semibold rounded-full bg-evergreen/10 text-xl"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="h-14 px-8 flex items-center justify-center bg-evergreen text-parchment font-semibold rounded-full text-xl"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
};