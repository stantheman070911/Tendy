import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { ProductList } from './ProductList';

interface LiveGroupBuysProps {
  isLoggedIn?: boolean;
}

export const LiveGroupBuys: React.FC<LiveGroupBuysProps> = ({ isLoggedIn = false }) => {
  const { ref, isIntersecting } = useIntersectionObserver();
  const [searchState, setSearchState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [zipCode, setZipCode] = useState('');

  const handleZipSearch = () => {
    if (!zipCode.trim()) return;
    
    setSearchState('loading');
    
    setTimeout(() => {
      setSearchState('success');
      setTimeout(() => setSearchState('idle'), 4000);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleZipSearch();
    }
  };

  return (
    <section
      id="discover"
      ref={ref}
      className={`py-xl md:py-2xl scroll-mt-24 fade-in-section ${isIntersecting ? 'is-visible' : ''}`}
    >
      {/* Zip Code Search */}
      <div className="bg-white p-4 rounded-xl border border-stone/10 shadow-sm mb-lg flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3 flex-grow w-full">
          <i className="ph-bold ph-map-trifold text-harvest-gold text-3xl"></i>
          <label htmlFor="zip-search" className="text-lg font-semibold text-charcoal whitespace-nowrap">
            Find groups near you:
          </label>
          <input
            id="zip-search"
            type="text"
            placeholder="Enter your zip code..."
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full h-12 px-4 bg-parchment rounded-md text-charcoal placeholder-stone border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
          />
        </div>
        <button
          onClick={handleZipSearch}
          disabled={searchState === 'loading'}
          className="h-12 w-full sm:w-auto px-8 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity flex-shrink-0 disabled:opacity-70"
        >
          {searchState === 'loading' ? (
            <i className="ph ph-spinner animate-spin text-2xl"></i>
          ) : (
            'Search'
          )}
        </button>
      </div>

      {/* Search Feedback */}
      {searchState === 'loading' && (
        <div className="mb-lg p-4 rounded-md bg-info-light text-info flex items-center gap-3">
          <i className="ph ph-spinner animate-spin text-2xl"></i>
          <span className="font-semibold">Finding groups near you...</span>
        </div>
      )}

      {searchState === 'success' && (
        <div className="mb-lg p-4 rounded-md bg-success-light text-success flex items-center gap-3">
          <i className="ph-fill ph-check-circle text-2xl"></i>
          <span className="font-semibold">Success! Showing the freshest finds in your area.</span>
        </div>
      )}

      {/* Interactive Product List */}
      <ProductList 
        isLoggedIn={isLoggedIn} 
        limit={4}
        title="Live Group Buys"
        subtitle="Join your neighbors to unlock group savings on this week's harvest."
      />
    </section>
  );
};