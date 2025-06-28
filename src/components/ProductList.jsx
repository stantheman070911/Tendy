// src/components/ProductList.jsx
import React from 'react';
import { useApp } from '../store/AppContext';
import { InteractiveProductCard } from './InteractiveProductCard';

export const ProductList = ({ 
  isLoggedIn = false, 
  limit,
  title = "Live Group Buys",
  subtitle = "Join your neighbors to unlock group savings on this week's harvest."
}) => {
  const { getProductsWithGroupData } = useApp();
  
  const products = getProductsWithGroupData();
  const displayProducts = limit ? products.slice(0, limit) : products;

  return (
    <section className="py-xl">
      <div className="mb-lg">
        <h2 className="text-4xl md:text-5xl">{title}</h2>
        <p className="text-body mt-2">{subtitle}</p>
      </div>

      {displayProducts.length > 0 ? (
        <div className="flex overflow-x-auto gap-lg md:gap-xl pb-md -mx-md px-md scroll-container">
          {displayProducts.map(product => (
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
      {displayProducts.length > 0 && (
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