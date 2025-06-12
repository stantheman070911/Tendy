import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center">
      <div className="text-center py-2xl max-w-2xl mx-auto px-md">
        <div className="mb-lg">
          <h1 className="text-8xl md:text-9xl font-lora text-harvest-gold font-bold">404</h1>
          <div className="w-24 h-1 bg-harvest-gold mx-auto mt-md"></div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-lora text-evergreen mb-md">
          Oops! Page Not Found
        </h2>
        
        <p className="text-body mb-xl max-w-lg mx-auto">
          The page you're looking for seems to have wandered off like a free-range chicken. 
          Let's get you back to the farm-fresh goodness.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-sm justify-center">
          <Link
            to="/"
            className="h-14 px-lg inline-flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
          >
            <i className="ph-bold ph-house mr-2"></i>
            Go Back Home
          </Link>
          
          <Link
            to="/login"
            className="h-14 px-lg inline-flex items-center justify-center border-2 border-evergreen text-evergreen font-bold text-lg rounded-lg hover:bg-evergreen hover:text-parchment transition-colors"
          >
            <i className="ph-bold ph-user-circle mr-2"></i>
            Sign In
          </Link>
        </div>
        
        <div className="mt-xl pt-lg border-t border-stone/20">
          <p className="text-sm text-stone">
            Need help? <a href="#" className="text-evergreen font-semibold hover:text-harvest-gold transition-colors">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  );
};