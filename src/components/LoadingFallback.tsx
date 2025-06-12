import React from 'react';

export const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-harvest-gold border-t-transparent rounded-full animate-spin mx-auto mb-md"></div>
        <h2 className="text-2xl font-lora text-evergreen mb-sm">Loading...</h2>
        <p className="text-stone">Preparing your farm-fresh experience</p>
      </div>
    </div>
  );
};