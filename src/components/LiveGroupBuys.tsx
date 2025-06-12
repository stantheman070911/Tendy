import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { ProductCard } from './ProductCard';
import { supabase } from '../lib/supabaseClient';
import type { Product } from '../types';

interface LiveGroupBuysProps {
  isLoggedIn?: boolean;
}

export const LiveGroupBuys: React.FC<LiveGroupBuysProps> = ({ isLoggedIn = false }) => {
  const { ref, isIntersecting } = useIntersectionObserver();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchState, setSearchState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [zipCode, setZipCode] = useState('');

  // Fetch products from Supabase when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            farmer:farmers(name, image_url)
          `);

        if (error) {
          console.error("Error fetching products:", error);
          setProducts([]); // Set empty array on error
        } else {
          // Transform the data to match our Product interface
          const transformedProducts = data?.map(product => ({
            ...product,
            farmer: {
              name: product.farmer?.name || 'Unknown Farmer',
              avatar: product.farmer?.image_url || 'https://i.pravatar.cc/80?img=1'
            },
            // Add default values for fields that might not exist in database yet
            progress: product.progress || Math.floor(Math.random() * 80) + 10,
            spotsLeft: product.spots_left || Math.floor(Math.random() * 8) + 2,
            daysLeft: product.days_left || Math.floor(Math.random() * 6) + 1,
            members: product.members || [],
            gallery: product.gallery || [product.image_url],
            host: product.host || null
          })) || [];
          
          setProducts(transformedProducts);
        }
      } catch (err) {
        console.error("Unexpected error fetching products:", err);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
      <div className="mb-lg">
        <h2 className="text-4xl md:text-5xl">Live Group Buys</h2>
        <p className="text-body mt-2">
          Join your neighbors to unlock group savings on this week's harvest.
        </p>
      </div>

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

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-xl">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-harvest-gold border-t-transparent rounded-full animate-spin mx-auto mb-md"></div>
            <p className="text-lg font-semibold text-charcoal">Loading fresh finds...</p>
          </div>
        </div>
      )}

      {/* Product Cards */}
      {!isLoading && (
        <>
          {products.length > 0 ? (
            <div className={`flex overflow-x-auto gap-lg md:gap-xl pb-md -mx-md px-md scroll-container transition-opacity duration-300 ${searchState === 'loading' ? 'opacity-50' : 'opacity-100'}`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          ) : (
            <div className="text-center py-xl">
              <div className="bg-white rounded-xl p-xl border border-stone/10 shadow-sm">
                <i className="ph-bold ph-plant text-stone text-6xl mb-md"></i>
                <h3 className="text-2xl font-lora text-charcoal mb-sm">No Group Buys Available</h3>
                <p className="text-body">
                  We're working on bringing fresh group buys to your area. 
                  Check back soon for new seasonal offerings!
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};