import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAuth } from '../context/AuthContext';

export const Layout: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="bg-parchment font-inter text-charcoal">
      <Header isLoggedIn={isLoggedIn} />
      <Outlet /> 
      <Footer />
    </div>
  );
};