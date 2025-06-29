import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlaceholderAuth } from '../context/PlaceholderAuthContext';
import type { Product, ProductWithFarmer } from '../types';

interface ProductCardProps {
  product: Product | ProductWithFarmer;
  isLoggedIn?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isLoggedIn = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn: authIsLoggedIn } = usePlaceholderAuth();

  // Use the auth context's isLoggedIn state instead of the prop
  const actualIsLoggedIn = authIsLoggedIn;

  const handleCardClick = () => {
    if (actualIsLoggedIn) {
      navigate(`/product/${product.id}`);
    } else {
      // CRITICAL FIX: Pass the current location as state to preserve navigation intent
      navigate('/login', { 
        state: { 
          from: location.pathname,
          productId: product.id,
          intendedDestination: `/product/${product.id}`
        } 
      });
    }
  };

  return (
    <div 
      className="flex-shrink-0 w-[90vw] sm:w-[400px] group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="block bg-white border border-stone/10 rounded-xl shadow-sm p-4 flex flex-col hover:-translate-y-2 transition-transform duration-300 h-full">
        <div className="overflow-hidden rounded-lg relative">
          <img
            width="800"
            height="600"
            loading="lazy"
            src={product.imageUrl}
            alt={product.title}
            className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <img
              width="40"
              height="40"
              className="w-10 h-10 rounded-full border-2 border-white shadow"
              src={product.farmer?.avatar || ''}
              alt={`${product.farmer?.name || 'Farmer'} Avatar`}
            />
            <span
              className="font-semibold text-white"
              style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
            >
              {product.farmer?.name || 'Unknown Farmer'}
            </span>
          </div>
        </div>
        
        <div className="mt-md flex-grow">
          <h3 className="text-2xl font-semibold">{product.title}</h3>
          <p className="text-lg text-charcoal/80">{product.weight}</p>
          <p className="mt-sm text-sm text-body line-clamp-2">
            {(product.description || '').split('\n')[0]}
          </p>
        </div>
        
        <div className="mt-auto pt-md">
          <div className="flex justify-between items-center text-sm font-semibold mb-1">
            <span className="text-success">{product.progress}% Funded</span>
            <span className="text-stone">{product.daysLeft} days left</span>
          </div>
          <div className="w-full bg-success-light rounded-full h-2.5">
            <div
              className="bg-success h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${product.progress}%` }}
            ></div>
          </div>
          <div className="flex items-center mt-2 justify-between">
            <div className="flex items-center -space-x-2">
              {(product.members || []).slice(0, 3).map((member) => (
                <img
                  key={member.id}
                  width="32"
                  height="32"
                  className="w-8 h-8 rounded-full border-2 border-white"
                  src={member.avatar}
                  alt={`${member.name} Avatar`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-charcoal/80">
              {product.spotsLeft} spots left
            </span>
          </div>
          <div className="mt-md pt-md border-t border-stone/10">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-evergreen">${product.price}</span>
                <span className="text-sm line-through text-stone ml-2">${product.originalPrice}</span>
              </div>
              <span className="text-sm font-semibold text-harvest-gold">
                {actualIsLoggedIn ? 'View Details →' : 'Sign In to View →'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};