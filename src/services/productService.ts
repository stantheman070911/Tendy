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
      throw new Error(error.message || 'Failed to create product');
    }

    // Parse and transform the response using Zod
    return ProductWithFarmerSchema.parse(data);
  },

  // Get products by farmer ID
  async getProductsByFarmerId(farmerId: number) {
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
      throw new Error(error.message || 'Failed to fetch products');
    }

    return z.array(ProductWithFarmerSchema).parse(data || []);
  },

  // Get all products for homepage
  async getAllProducts(limit?: number) {
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
      throw new Error(error.message || 'Failed to fetch products');
    }

    return z.array(ProductWithFarmerSchema).parse(data || []);
  },

  // Join a group buy
  async joinGroup(productId: string) {
    const { data, error } = await supabase.rpc('join_group', {
      product_id_to_join: productId
    });

    if (error) {
      throw new Error(error.message || 'Failed to join group');
    }

    return data;
  },

  // Update product
  async updateProduct(productId: string, updates: Partial<CreateProductData>) {
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
      throw new Error(error.message || 'Failed to update product');
    }

    return ProductWithFarmerSchema.parse(data);
  },

  // Delete product
  async deleteProduct(productId: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      throw new Error(error.message || 'Failed to delete product');
    }

    return true;
  }
};