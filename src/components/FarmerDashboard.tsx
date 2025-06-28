import React, { useState } from 'react';
import { InteractiveProductCard } from './InteractiveProductCard';
import { productService } from '../services/productService';
import type { ProductWithFarmer } from '../types';

interface FarmerUser {
  userId: string;
  role: string;
  farmName: string;
  name: string;
  verificationTier: string;
  businessLicenseVerified: boolean;
  manualReviewCompleted?: boolean;
  virtualTourCompleted?: boolean;
  averageRating?: number;
  products: string[];
}

interface FarmerDashboardProps {
  farmer?: FarmerUser;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ farmer }) => {
  const [products, setProducts] = useState<ProductWithFarmer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load farmer's products on component mount
  React.useEffect(() => {
    const loadFarmerProducts = async () => {
      if (!farmer) return;
      
      setIsLoading(true);
      try {
        // Get all products and filter by farmer
        const allProducts = await productService.getAllProducts();
        const farmerProducts = allProducts.filter(p => 
          farmer.products.includes(p.id) || 
          p.farmer.name === farmer.farmName
        );
        setProducts(farmerProducts);
      } catch (error) {
        console.error('Error loading farmer products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFarmerProducts();
  }, [farmer]);

  if (!farmer) {
    return (
      <div className="container mx-auto max-w-screen-xl px-md md:px-lg py-xl">
        <div className="text-center">
          <h2 className="text-3xl font-lora text-evergreen">Farmer Dashboard</h2>
          <p className="text-charcoal/80 mt-2">No farmer data available</p>
        </div>
      </div>
    );
  }

  // Calculate farmer stats
  const totalListings = products.length;
  const activeListings = products.filter(p => p.status === 'active').length;
  const totalRevenue = products.reduce((sum, p) => {
    const filled = p.spotsTotal - p.spotsLeft;
    return sum + (filled * p.price);
  }, 0);

  const getVerificationBadgeColor = () => {
    if (farmer.verificationTier.includes('Level 3')) return 'bg-success text-white';
    if (farmer.verificationTier.includes('Level 2')) return 'bg-harvest-gold text-evergreen';
    return 'bg-info text-white';
  };

  const getVerificationFeatures = () => {
    const features = ['Business License Verified'];
    if (farmer.manualReviewCompleted) features.push('Manual Review Completed');
    if (farmer.virtualTourCompleted) features.push('Virtual Farm Tour');
    if (farmer.averageRating) features.push(`${farmer.averageRating}⭐ Average Rating`);
    return features;
  };

  return (
    <div className="container mx-auto max-w-screen-xl px-md md:px-lg py-xl">
      {/* Farmer Profile Section */}
      <div className="bg-white rounded-xl p-lg border border-stone/10 shadow-sm mb-xl">
        <div className="flex flex-col md:flex-row items-start gap-lg">
          <div className="flex-shrink-0">
            <img
              src="https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg"
              alt={farmer.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-harvest-gold"
            />
          </div>
          
          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-3 mb-md">
              <h2 className="text-3xl font-lora text-evergreen">{farmer.farmName}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${getVerificationBadgeColor()}`}>
                {farmer.verificationTier}
              </span>
            </div>
            
            <p className="text-lg text-charcoal mb-md">
              Operated by <strong>{farmer.name}</strong>
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-md">
              <div className="text-center">
                <div className="text-2xl font-bold text-evergreen">{totalListings}</div>
                <div className="text-sm text-stone">Total Listings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-evergreen">{activeListings}</div>
                <div className="text-sm text-stone">Active Groups</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-evergreen">${totalRevenue.toFixed(0)}</div>
                <div className="text-sm text-stone">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-evergreen">
                  {farmer.averageRating ? `${farmer.averageRating}⭐` : 'New'}
                </div>
                <div className="text-sm text-stone">Rating</div>
              </div>
            </div>

            <div className="bg-parchment rounded-lg p-md">
              <h4 className="font-semibold text-evergreen mb-2">Verification Features</h4>
              <div className="flex flex-wrap gap-2">
                {getVerificationFeatures().map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white rounded-full text-sm font-medium text-charcoal border border-stone/20"
                  >
                    ✓ {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-md mb-xl">
        <button className="bg-evergreen text-parchment p-lg rounded-xl hover:opacity-90 transition-opacity">
          <i className="ph-bold ph-plus-circle text-3xl mb-2"></i>
          <div className="font-bold">Create New Listing</div>
          <div className="text-sm opacity-80">Add a product to sell</div>
        </button>
        <button className="bg-harvest-gold text-evergreen p-lg rounded-xl hover:scale-105 transition-transform">
          <i className="ph-bold ph-chart-bar text-3xl mb-2"></i>
          <div className="font-bold">View Analytics</div>
          <div className="text-sm opacity-80">Track your performance</div>
        </button>
        <button className="bg-white border-2 border-evergreen text-evergreen p-lg rounded-xl hover:bg-evergreen hover:text-parchment transition-colors">
          <i className="ph-bold ph-gear text-3xl mb-2"></i>
          <div className="font-bold">Farm Settings</div>
          <div className="text-sm opacity-80">Update your profile</div>
        </button>
      </div>

      {/* Active Listings */}
      <div className="mb-xl">
        <div className="flex items-center justify-between mb-lg">
          <h3 className="text-3xl font-lora text-evergreen">Your Active Listings</h3>
          <button className="h-12 px-6 bg-harvest-gold text-evergreen font-bold rounded-lg hover:scale-105 transition-transform">
            <i className="ph-bold ph-plus mr-2"></i>
            Add New Product
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-xl">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-harvest-gold border-t-transparent rounded-full animate-spin mx-auto mb-md"></div>
              <p className="text-lg font-semibold text-charcoal">Loading your listings...</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {products.map(product => (
              <div key={product.id} className="relative">
                <InteractiveProductCard product={product} isLoggedIn={true} />
                {/* Farmer-specific overlay */}
                <div className="absolute top-4 right-4 bg-white/90 rounded-lg p-2 text-center">
                  <div className="text-sm font-bold text-evergreen">
                    ${((product.spotsTotal - product.spotsLeft) * product.price).toFixed(0)}
                  </div>
                  <div className="text-xs text-stone">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-xl">
            <div className="bg-white rounded-xl p-xl border border-stone/10 shadow-sm">
              <i className="ph-bold ph-storefront text-stone text-6xl mb-md"></i>
              <h3 className="text-2xl font-lora text-charcoal mb-sm">No Active Listings</h3>
              <p className="text-body mb-lg">
                Create your first product listing to start connecting with customers in your area.
              </p>
              <button className="h-14 px-8 bg-harvest-gold text-evergreen font-bold text-lg rounded-lg hover:scale-105 transition-transform">
                <i className="ph-bold ph-plus-circle mr-2"></i>
                Create Your First Listing
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Farmer Tips */}
      <div className="bg-harvest-gold/10 rounded-xl p-lg border border-harvest-gold/20">
        <h3 className="text-2xl font-lora text-evergreen mb-md flex items-center gap-2">
          <i className="ph-bold ph-lightbulb text-harvest-gold"></i>
          Tips for Success
        </h3>
        <div className="grid md:grid-cols-2 gap-md text-sm text-charcoal/90">
          <div>
            <h4 className="font-semibold mb-2">📸 Great Photos Sell</h4>
            <p>High-quality images increase group participation by 40%. Show your produce in natural lighting.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">📝 Tell Your Story</h4>
            <p>Customers love knowing about your farming practices. Share what makes your produce special.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">⏰ Timing Matters</h4>
            <p>List seasonal items 2-3 days before harvest for optimal freshness and customer interest.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">🤝 Build Community</h4>
            <p>Engage with customers through updates and respond to questions to build trust and loyalty.</p>
          </div>
        </div>
      </div>
    </div>
  );
};