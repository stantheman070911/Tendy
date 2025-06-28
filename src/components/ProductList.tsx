import React, { useState, useEffect } from 'react';
import { InteractiveProductCard } from './InteractiveProductCard';
import { productService } from '../services/productService';
import { toast } from 'react-hot-toast';
import type { ProductWithFarmer } from '../types';

interface ProductListProps {
  isLoggedIn?: boolean;
  limit?: number;
  title?: string;
  subtitle?: string;
}

export const ProductList: React.FC<ProductListProps> = ({ 
  isLoggedIn = false, 
  limit,
  title = "Live Group Buys",
  subtitle = "Join your neighbors to unlock group savings on this week's harvest."
}) => {
  const [products, setProducts] = useState<ProductWithFarmer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Loading products for interactive demo...');
        const data = await productService.getAllProducts(limit);
        setProducts(data);
        console.log(`Loaded ${data.length} products successfully`);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Failed to load products. Please make sure the data is available.';
        setError(errorMessage);
        console.error('ProductList error:', e);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [limit]);

  if (error) {
    return (
      <div className="py-xl">
        <div className="mb-lg">
          <h2 className="text-4xl md:text-5xl">{title}</h2>
          <p className="text-body mt-2">{subtitle}</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-lg text-center">
          <i className="ph-bold ph-warning-circle text-red-500 text-4xl mb-md"></i>
          <h3 className="text-xl font-semibold text-red-700 mb-2">Unable to Load Products</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-md h-12 px-6 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-xl">
        <div className="mb-lg">
          <h2 className="text-4xl md:text-5xl">{title}</h2>
          <p className="text-body mt-2">{subtitle}</p>
        </div>
        
        <div className="flex items-center justify-center py-xl">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-harvest-gold border-t-transparent rounded-full animate-spin mx-auto mb-md"></div>
            <p className="text-lg font-semibold text-charcoal">Loading fresh finds...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-xl">
      <div className="mb-lg">
        <h2 className="text-4xl md:text-5xl">{title}</h2>
        <p className="text-body mt-2">{subtitle}</p>
      </div>

      {products.length > 0 ? (
        <div className="flex overflow-x-auto gap-lg md:gap-xl pb-md -mx-md px-md scroll-container">
          {products.map(product => (
            <InteractiveProductCard 
              key={product.id} 
              product={product} 
              isLoggedIn={isLoggedIn}
            />
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

      {/* Demo Instructions for Judges */}
      {products.length > 0 && (
        <div className="mt-xl bg-harvest-gold/10 rounded-xl p-lg border border-harvest-gold/20">
          <h3 className="text-xl font-semibold text-evergreen mb-md flex items-center gap-2">
            <i className="ph-bold ph-info text-harvest-gold"></i>
            Interactive Demo Features
          </h3>
          <div className="grid md:grid-cols-2 gap-md text-sm text-charcoal/90">
            <div>
              <h4 className="font-semibold mb-2">🎯 Try These Actions:</h4>
              <ul className="space-y-1">
                <li>• Click "Join Group" to simulate payment flow</li>
                <li>• Watch progress bars update in real-time</li>
                <li>• See different farmer verification levels</li>
                <li>• Notice Waste-Warrior sustainability badges</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">💡 Key Features Demonstrated:</h4>
              <ul className="space-y-1">
                <li>• Payment authorization before charging</li>
                <li>• Group completion triggers final payment</li>
                <li>• Real-time status updates</li>
                <li>• Community member visualization</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};