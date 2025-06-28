import { supabase } from '../lib/supabaseClient';
import { ProductSchema, ProductWithFarmerSchema } from '../types';
import { z } from 'zod';
import type { ProductWithFarmer } from '../types';

export interface CreateProductData {
  title: string;
  description: string;
  weight: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  spotsTotal: number;
  daysActive: number;
}

// --- MOCK DATA ---
const mockProducts: ProductWithFarmer[] = [
  {
    id: '1',
    title: 'Organic Heirloom Tomatoes',
    description: 'Juicy, ripe heirloom tomatoes, grown with love and no pesticides. Perfect for salads, sauces, or just eating plain.',
    price: 5.99,
    original_price: 7.99,
    weight: '1lb',
    spots_left: 8,
    days_left: 7,
    progress: 60,
    image_url: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg',
    gallery: ['https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg'],
    farmer_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    farmers: {
      name: 'Green Thumb Organics',
      image_url: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg'
    }
  },
  {
    id: '2',
    title: 'Artisanal Sourdough Bread',
    description: 'A crusty loaf of naturally leavened sourdough, made with locally milled flour. Baked fresh daily.',
    price: 8.00,
    original_price: 10.00,
    weight: '1 loaf',
    spots_left: 3,
    days_left: 5,
    progress: 80,
    image_url: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg',
    gallery: ['https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg'],
    farmer_id: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    farmers: {
      name: 'The Rolling Pin Bakery',
      image_url: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg'
    }
  },
  {
    id: '3',
    title: 'Fresh Organic Carrots',
    description: 'Sweet, crunchy carrots harvested at peak freshness. Perfect for snacking, cooking, or juicing.',
    price: 3.50,
    original_price: 4.50,
    weight: '2lbs',
    spots_left: 12,
    days_left: 4,
    progress: 40,
    image_url: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
    gallery: ['https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg'],
    farmer_id: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    farmers: {
      name: 'Sunrise Farm',
      image_url: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg'
    }
  },
  {
    id: '4',
    title: 'Farm Fresh Eggs',
    description: 'Free-range eggs from happy hens. Rich, golden yolks and firm whites make these perfect for any meal.',
    price: 6.00,
    original_price: 8.00,
    weight: '1 dozen',
    spots_left: 15,
    days_left: 3,
    progress: 25,
    image_url: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg',
    gallery: ['https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg'],
    farmer_id: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    farmers: {
      name: 'Happy Hen Farm',
      image_url: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg'
    }
  }
];

export const productService = {
  // Create a new product
  async createProduct(formData: CreateProductData, farmerId: number) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          title: formData.title,
          description: formData.description,
          weight: formData.weight,
          price: formData.price,
          original_price: formData.originalPrice,
          image_url: formData.imageUrl,
          farmer_id: farmerId,
          progress: 0,
          spots_left: formData.spotsTotal,
          days_left: formData.daysActive,
          gallery: [formData.imageUrl]
        }])
        .select(`
          *,
          farmers (
            name,
            image_url
          )
        `)
        .single();

      if (error) {
        console.error('Supabase error creating product:', error);
        throw new Error(error.message || 'Failed to create product');
      }

      // Parse and transform the response using Zod
      return ProductWithFarmerSchema.parse(data);
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  },

  // Get products by farmer ID
  async getProductsByFarmerId(farmerId: number) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          farmers (
            name,
            image_url
          )
        `)
        .eq('farmer_id', farmerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching products by farmer:', error);
        throw new Error(error.message || 'Failed to fetch products');
      }

      return z.array(ProductWithFarmerSchema).parse(data || []);
    } catch (error) {
      console.error('Error in getProductsByFarmerId:', error);
      throw error;
    }
  },

  /**
   * Fetches all products with their associated farmer details.
   * NOTE: This is currently returning mock data for the hackathon demo.
   */
  async getAllProducts(limit?: number): Promise<ProductWithFarmer[]> {
    console.log('Fetching MOCK products...');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return a sliced version if a limit is provided
    const productsToReturn = limit ? mockProducts.slice(0, limit) : mockProducts;

    console.log('Mock products fetched successfully:', productsToReturn);
    return productsToReturn;
  },

  // Join a group buy
  async joinGroup(productId: string) {
    try {
      const { data, error } = await supabase.rpc('join_group', {
        product_id_to_join: productId
      });

      if (error) {
        console.error('Supabase error joining group:', error);
        throw new Error(error.message || 'Failed to join group');
      }

      return data;
    } catch (error) {
      console.error('Error in joinGroup:', error);
      throw error;
    }
  },

  // Update product
  async updateProduct(productId: string, updates: Partial<CreateProductData>) {
    try {
      const updateData: any = {};
      
      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.weight) updateData.weight = updates.weight;
      if (updates.price) updateData.price = updates.price;
      if (updates.originalPrice) updateData.original_price = updates.originalPrice;
      if (updates.imageUrl) updateData.image_url = updates.imageUrl;

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId)
        .select(`
          *,
          farmers (
            name,
            image_url
          )
        `)
        .single();

      if (error) {
        console.error('Supabase error updating product:', error);
        throw new Error(error.message || 'Failed to update product');
      }

      return ProductWithFarmerSchema.parse(data);
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(productId: string) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Supabase error deleting product:', error);
        throw new Error(error.message || 'Failed to delete product');
      }

      return true;
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  }
};