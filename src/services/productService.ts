import { supabase } from '../lib/supabaseClient';
import { ProductSchema, ProductWithFarmerSchema } from '../types';
import { z } from 'zod';

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

  // Get all products for homepage
  async getAllProducts(limit?: number) {
    try {
      // First, let's test the connection
      const { data: testData, error: testError } = await supabase
        .from('products')
        .select('count', { count: 'exact', head: true });

      if (testError) {
        console.error('Supabase connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }

      let query = supabase
        .from('products')
        .select(`
          *,
          farmers (
            name,
            image_url
          )
        `)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error fetching all products:', error);
        throw new Error(error.message || 'Failed to fetch products');
      }

      return z.array(ProductWithFarmerSchema).parse(data || []);
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      throw error;
    }
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