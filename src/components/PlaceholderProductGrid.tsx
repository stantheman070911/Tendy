import React from 'react';
import { usePlaceholderProductsWithFarmers } from '../hooks/usePlaceholderData';

export const PlaceholderProductGrid: React.FC = () => {
  const { products, loading, error } = usePlaceholderProductsWithFarmers();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-xl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-harvest-gold border-t-transparent rounded-full animate-spin mx-auto mb-md"></div>
          <p className="text-lg font-semibold text-charcoal">Loading fresh finds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-lg text-center">
        <i className="ph-bold ph-warning-circle text-red-500 text-4xl mb-md"></i>
        <h3 className="text-xl font-semibold text-red-700 mb-2">Unable to Load Products</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
      {products.map(product => (
        <div key={product.productId} className="bg-white rounded-xl border border-stone/10 shadow-sm overflow-hidden hover:-translate-y-2 transition-transform duration-300">
          
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
            
            {/* Waste-Warrior Badge */}
            {product.uiBadge && (
              <div className="absolute top-3 right-3 bg-harvest-gold text-evergreen px-3 py-1 rounded-full text-sm font-bold">
                🌱 {product.uiBadge}
              </div>
            )}
            
            {/* Farmer Badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <img
                src={product.farmer.avatar}
                alt={product.farmer.name}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <span className="text-white font-semibold text-sm" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                {product.farmer.farmName || product.farmer.name}
              </span>
            </div>
          </div>

          {/* Product Details */}
          <div className="p-md">
            <h3 className="text-xl font-semibold text-evergreen mb-2">{product.title}</h3>
            <p className="text-sm text-charcoal/80 mb-md line-clamp-2">{product.description}</p>
            
            {/* Pricing */}
            <div className="flex items-center justify-between mb-md">
              <div>
                <span className="text-2xl font-bold text-evergreen">${product.price.toFixed(2)}</span>
                {product.estimatedWeight && (
                  <span className="text-sm text-stone ml-2">{product.estimatedWeight}</span>
                )}
              </div>
              
              {/* Verification Tier */}
              {product.farmer.verificationTier && (
                <div className="text-xs bg-success/10 text-success px-2 py-1 rounded-full font-semibold">
                  {product.farmer.verificationTier.split(': ')[1]}
                </div>
              )}
            </div>

            {/* MOQ Info */}
            <div className="bg-parchment rounded-lg p-sm mb-md">
              <div className="flex items-center justify-between text-sm">
                <span className="text-charcoal/80">Minimum Order:</span>
                <span className="font-semibold text-evergreen">{product.moq} units</span>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full h-12 bg-harvest-gold text-evergreen font-bold rounded-lg hover:scale-105 transition-transform">
              Join Group Buy
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};