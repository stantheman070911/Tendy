import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { useNotifications } from '../context/NotificationContext';
import type { ProductWithFarmer } from '../types';

interface CreateGroupFormProps {
  onCreateGroup: (newGroup: ProductWithFarmer) => void;
}

export const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ onCreateGroup }) => {
  const [allProducts, setAllProducts] = useState<ProductWithFarmer[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  // Load all available products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await productService.getAllProducts();
        setAllProducts(products);
        if (products.length > 0) {
          setSelectedProductId(products[0].id);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        addNotification('Failed to load products', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [addNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId) {
      addNotification('Please select a product.', 'warning');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Find the selected product
      const productTemplate = allProducts.find(p => p.id === selectedProductId);
      
      if (!productTemplate) {
        throw new Error('Selected product not found');
      }

      addNotification('Creating your private group...', 'info');

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a new private group based on the product template
      const newGroup: ProductWithFarmer = {
        ...productTemplate,
        // Reset group-specific properties for the private group
        spotsLeft: productTemplate.spotsTotal - 1, // Creator automatically joins
        progress: (1 / productTemplate.spotsTotal) * 100, // 1 person joined (creator)
        daysLeft: 7, // Default 7 days for private groups
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        hostId: null, // Private groups don't need hosts
        host: null,
        members: [
          { id: 'creator', avatar: 'https://i.pravatar.cc/48?img=20', name: 'You (Creator)' }
        ]
      };

      onCreateGroup(newGroup);
      
      addNotification(`🎉 Private group created for ${productTemplate.title}! Share the link with friends to invite them.`, 'success');

      // Reset form
      setSelectedProductId(allProducts[0]?.id || '');
      
    } catch (error) {
      console.error('Error creating private group:', error);
      addNotification('Failed to create private group. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-md">
        <div className="w-8 h-8 border-2 border-harvest-gold border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-sm text-stone">Loading products...</p>
      </div>
    );
  }

  if (allProducts.length === 0) {
    return (
      <div className="text-center py-md">
        <p className="text-charcoal/80">No products available for group creation.</p>
      </div>
    );
  }

  const selectedProduct = allProducts.find(p => p.id === selectedProductId);

  return (
    <form onSubmit={handleSubmit} className="space-y-md">
      <div className="grid md:grid-cols-2 gap-md">
        {/* Product Selection */}
        <div>
          <label htmlFor="product-select" className="block font-semibold text-charcoal mb-2">
            Select a product for your private group:
          </label>
          <select 
            id="product-select" 
            value={selectedProductId} 
            onChange={e => setSelectedProductId(e.target.value)}
            className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
          >
            {allProducts.map(p => (
              <option key={p.id} value={p.id}>
                {p.title} - ${p.price.toFixed(2)} ({p.weight})
              </option>
            ))}
          </select>
        </div>

        {/* Product Preview */}
        {selectedProduct && (
          <div className="bg-parchment rounded-lg p-md">
            <h4 className="font-semibold text-evergreen mb-2">Preview</h4>
            <div className="flex items-center gap-3">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <p className="font-semibold text-sm">{selectedProduct.title}</p>
                <p className="text-xs text-stone">From {selectedProduct.farmer.name}</p>
                <p className="text-sm text-evergreen font-bold">${selectedProduct.price} / {selectedProduct.weight}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Group Details */}
      <div className="bg-harvest-gold/10 rounded-lg p-md">
        <h4 className="font-semibold text-evergreen mb-2">Private Group Details</h4>
        <div className="grid md:grid-cols-3 gap-md text-sm">
          <div>
            <span className="font-semibold">Group Size:</span>
            <p className="text-stone">Up to {selectedProduct?.spotsTotal} people</p>
          </div>
          <div>
            <span className="font-semibold">Duration:</span>
            <p className="text-stone">7 days to fill</p>
          </div>
          <div>
            <span className="font-semibold">Privacy:</span>
            <p className="text-stone">Invite-only access</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <i className="ph ph-spinner animate-spin mr-2"></i>
            Creating Private Group...
          </>
        ) : (
          <>
            <i className="ph-bold ph-plus-circle mr-2"></i>
            Create Private Group
          </>
        )}
      </button>

      {/* Info Text */}
      <div className="text-center">
        <p className="text-sm text-charcoal/60">
          You'll automatically join as the first member. Share the group link with friends to invite them!
        </p>
      </div>
    </form>
  );
};