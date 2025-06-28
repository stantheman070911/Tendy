import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { productService, type CreateProductData } from '../services/productService';
import { farmerService } from '../services/farmerService';
import { toast } from 'react-hot-toast';
import type { ProductWithFarmer } from '../types';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProduct: ProductWithFarmer | any) => void;
  title?: string;
  submitButtonText?: string;
  isHostCreated?: boolean;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  title = "Create New Product Listing",
  submitButtonText = "Create Listing",
  isHostCreated = false
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateProductData>({
    title: '',
    description: '',
    weight: '',
    price: 0,
    originalPrice: 0,
    imageUrl: '',
    spotsTotal: 10,
    daysActive: 7
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) {
      toast.error('User not authenticated');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isHostCreated) {
        // For host-created groups, just pass the form data
        onSuccess(formData);
      } else {
        // For farmer-created products, use the existing logic
        const farmer = await farmerService.getFarmerByEmail(user.email);
        
        if (!farmer) {
          throw new Error('Farmer profile not found. Please contact support.');
        }

        const newProduct = await productService.createProduct(formData, parseInt(farmer.id));
        onSuccess(newProduct);
        toast.success('Product listing created successfully!');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        weight: '',
        price: 0,
        originalPrice: 0,
        imageUrl: '',
        spotsTotal: 10,
        daysActive: 7
      });

      onClose();

    } catch (error) {
      console.error('Error creating listing:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create listing. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-lg">
          <div className="flex items-center justify-between mb-lg">
            <h2 className="text-3xl font-lora text-evergreen">{title}</h2>
            <button
              onClick={onClose}
              className="text-stone hover:text-charcoal text-3xl"
            >
              <i className="ph-bold ph-x"></i>
            </button>
          </div>

          {isHostCreated && (
            <div className="bg-harvest-gold/10 rounded-lg p-md mb-lg border border-harvest-gold/20">
              <div className="flex items-center gap-2 mb-2">
                <i className="ph-bold ph-info text-harvest-gold"></i>
                <h3 className="font-semibold text-evergreen">Creating a Host-Curated Group</h3>
              </div>
              <p className="text-sm text-charcoal/80">
                As a verified host, you can create public groups for products you've sourced from local farmers. 
                This helps build community connections and you'll earn enhanced host rewards.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-md">
            <div>
              <label htmlFor="title" className="block font-semibold text-charcoal mb-2">
                Product Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Heirloom Tomatoes"
                className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block font-semibold text-charcoal mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder={isHostCreated 
                  ? "Describe the product, its source farmer, and why you're excited to share it with your community..."
                  : "Tell customers about your product, growing practices, and what makes it special..."
                }
                className="w-full p-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div>
                <label htmlFor="weight" className="block font-semibold text-charcoal mb-2">
                  Weight/Size *
                </label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g., 5lb Box, 2 Dozen"
                  className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
                  required
                />
              </div>

              <div>
                <label htmlFor="imageUrl" className="block font-semibold text-charcoal mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div>
                <label htmlFor="price" className="block font-semibold text-charcoal mb-2">
                  Group Buy Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="18.00"
                  className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
                  required
                />
              </div>

              <div>
                <label htmlFor="originalPrice" className="block font-semibold text-charcoal mb-2">
                  Retail Price ($) *
                </label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="25.00"
                  className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div>
                <label htmlFor="spotsTotal" className="block font-semibold text-charcoal mb-2">
                  Total Spots Available
                </label>
                <input
                  type="number"
                  id="spotsTotal"
                  name="spotsTotal"
                  value={formData.spotsTotal}
                  onChange={handleInputChange}
                  min="1"
                  max="50"
                  className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
                />
              </div>

              <div>
                <label htmlFor="daysActive" className="block font-semibold text-charcoal mb-2">
                  Days Active
                </label>
                <input
                  type="number"
                  id="daysActive"
                  name="daysActive"
                  value={formData.daysActive}
                  onChange={handleInputChange}
                  min="1"
                  max="30"
                  className="w-full h-12 px-4 bg-parchment rounded-md border border-stone/30 focus:outline-none focus:ring-2 focus:ring-harvest-gold"
                />
              </div>
            </div>

            {isHostCreated && (
              <div className="bg-evergreen/5 rounded-lg p-md border border-evergreen/20">
                <h4 className="font-semibold text-evergreen mb-2">Host Benefits for This Group</h4>
                <div className="grid md:grid-cols-2 gap-md text-sm text-charcoal/80">
                  <div>
                    <span className="font-semibold">Enhanced Rewards:</span>
                    <p>Earn 3% instead of standard 2% host fee</p>
                  </div>
                  <div>
                    <span className="font-semibold">Community Impact:</span>
                    <p>Build stronger neighborhood connections</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-sm pt-md">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-14 flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <i className="ph ph-spinner animate-spin mr-2"></i>
                    {isHostCreated ? 'Creating Group...' : 'Creating Listing...'}
                  </>
                ) : (
                  submitButtonText
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-14 flex items-center justify-center border-2 border-stone/30 text-charcoal font-bold text-lg rounded-lg hover:bg-stone/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};