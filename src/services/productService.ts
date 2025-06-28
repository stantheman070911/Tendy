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

// Enhanced mock data that matches the placeholder structure
const mockProducts: ProductWithFarmer[] = [
  {
    id: 'prod01',
    title: 'Organic Gala Apples - 2kg Bag',
    description: 'Crisp, sweet, and juicy Gala apples, freshly picked from Sunrise Organics. Perfect for snacking and baking. These apples are grown using sustainable farming practices and harvested at peak ripeness.',
    price: 8.50,
    originalPrice: 12.00,
    weight: '2kg bag',
    imageUrl: 'https://images.unsplash.com/photo-1593280424033-4c969b854817?q=80&w=2940&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1593280424033-4c969b854817?q=80&w=2940&auto=format&fit=crop'],
    farmerId: 'farmer01',
    createdAt: new Date().toISOString(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    hostId: 'host01',
    progress: 75,
    spotsLeft: 5,
    spotsTotal: 20,
    daysLeft: 5,
    farmer: {
      name: 'Sunrise Organics',
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg',
      id: 'farmer01',
      email: 'diana@sunriseorganics.com',
      role: 'farmer',
      bio: 'Level 1: Tendy Sprout - Family-owned organic farm specializing in premium apples and seasonal produce.',
      quote: '"Every apple tells the story of our soil, our care, and our commitment to quality."',
      practices: 'Certified Organic, Sustainable Farming',
      isVerified: true
    },
    members: [
      { id: '1', avatar: 'https://i.pravatar.cc/48?img=1', name: 'Sarah P.' },
      { id: '2', avatar: 'https://i.pravatar.cc/48?img=2', name: 'Mark L.' },
      { id: '3', avatar: 'https://i.pravatar.cc/48?img=4', name: 'Emily J.' },
    ],
    host: {
      name: "Charles's Pickup Point",
      avatar: 'https://i.pravatar.cc/80?img=10'
    }
  },
  {
    id: 'prod02',
    title: 'Heirloom Tomatoes - 1kg',
    description: 'A colorful mix of our best heirloom tomatoes. Incredible flavor that you won\'t find in a supermarket. Each variety has been carefully selected for taste and texture.',
    price: 6.00,
    originalPrice: 9.00,
    weight: '1kg mix',
    imageUrl: 'https://images.unsplash.com/photo-1588650364232-38997a78336b?q=80&w=2940&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1588650364232-38997a78336b?q=80&w=2940&auto=format&fit=crop'],
    farmerId: 'farmer01',
    createdAt: new Date().toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    hostId: 'host01',
    progress: 90,
    spotsLeft: 3,
    spotsTotal: 30,
    daysLeft: 3,
    farmer: {
      name: 'Sunrise Organics',
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg',
      id: 'farmer01',
      email: 'diana@sunriseorganics.com',
      role: 'farmer',
      bio: 'Level 1: Tendy Sprout - Family-owned organic farm specializing in premium apples and seasonal produce.',
      quote: '"Every apple tells the story of our soil, our care, and our commitment to quality."',
      practices: 'Certified Organic, Sustainable Farming',
      isVerified: true
    },
    members: [
      { id: '4', avatar: 'https://i.pravatar.cc/48?img=5', name: 'David C.' },
      { id: '5', avatar: 'https://i.pravatar.cc/48?img=6', name: 'Maria R.' },
      { id: '6', avatar: 'https://i.pravatar.cc/48?img=7', name: 'Chris B.' },
    ],
    host: {
      name: "Charles's Pickup Point",
      avatar: 'https://i.pravatar.cc/80?img=10'
    }
  },
  {
    id: 'prod03',
    title: 'Free-Range Eggs - Dozen',
    description: 'Farm fresh, large brown eggs from our happy, free-range chickens at Green Valley Produce. Rich, golden yolks and superior taste from pasture-raised hens.',
    price: 5.25,
    originalPrice: 7.50,
    weight: 'dozen',
    imageUrl: 'https://images.unsplash.com/photo-1587486913049-52fc082a934b?q=80&w=2894&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1587486913049-52fc082a934b?q=80&w=2894&auto=format&fit=crop'],
    farmerId: 'farmer02',
    createdAt: new Date().toISOString(),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    hostId: null,
    progress: 95,
    spotsLeft: 2,
    spotsTotal: 40,
    daysLeft: 2,
    farmer: {
      name: 'Green Valley Produce',
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg',
      id: 'farmer02',
      email: 'edward@greenvalley.com',
      role: 'farmer',
      bio: 'Level 2: Tendy Verified Harvest - Specializing in free-range eggs and artisanal baked goods.',
      quote: '"Happy chickens make the best eggs - it\'s that simple."',
      practices: 'Free-Range, Pasture-Raised, Humane Certified',
      isVerified: true
    },
    members: [
      { id: '7', avatar: 'https://i.pravatar.cc/48?img=8', name: 'Jessica W.' },
      { id: '8', avatar: 'https://i.pravatar.cc/48?img=9', name: 'Tom K.' },
      { id: '9', avatar: 'https://i.pravatar.cc/48?img=10', name: 'Anna S.' },
    ]
  },
  {
    id: 'prod04',
    title: 'Sourdough Bread - Large Loaf',
    description: 'Naturally leavened sourdough, baked fresh in our farm kitchen. Crusty on the outside, soft on the inside. Made with locally milled flour and our 100-year-old starter.',
    price: 7.00,
    originalPrice: 10.00,
    weight: 'large loaf',
    imageUrl: 'https://images.unsplash.com/photo-1533083328223-2396395d8523?q=80&w=2940&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1533083328223-2396395d8523?q=80&w=2940&auto=format&fit=crop'],
    farmerId: 'farmer02',
    createdAt: new Date().toISOString(),
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    hostId: null,
    progress: 60,
    spotsLeft: 6,
    spotsTotal: 15,
    daysLeft: 6,
    farmer: {
      name: 'Green Valley Produce',
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg',
      id: 'farmer02',
      email: 'edward@greenvalley.com',
      role: 'farmer',
      bio: 'Level 2: Tendy Verified Harvest - Specializing in free-range eggs and artisanal baked goods.',
      quote: '"Happy chickens make the best eggs - it\'s that simple."',
      practices: 'Free-Range, Pasture-Raised, Humane Certified',
      isVerified: true
    },
    members: [
      { id: '10', avatar: 'https://i.pravatar.cc/48?img=11', name: 'Mike D.' },
      { id: '11', avatar: 'https://i.pravatar.cc/48?img=12', name: 'Rachel T.' },
    ]
  },
  {
    id: 'prod05',
    title: 'Farmer\'s Surplus Selection - Medium Box',
    description: 'Help us reduce food waste! This box contains a surprise mix of cosmetically imperfect but perfectly delicious and fresh produce from our harvest this week. Contents are variable but always high quality.',
    price: 15.00,
    originalPrice: 25.00,
    weight: 'approx. 5-7kg',
    imageUrl: 'https://images.unsplash.com/photo-1598254505245-5ecd46d79a24?q=80&w=2940&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1598254505245-5ecd46d79a24?q=80&w=2940&auto=format&fit=crop'],
    farmerId: 'farmer03',
    createdAt: new Date().toISOString(),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    hostId: null,
    progress: 40,
    spotsLeft: 6,
    spotsTotal: 10,
    daysLeft: 4,
    farmer: {
      name: 'Landmark Heritage Farm',
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg',
      id: 'farmer03',
      email: 'fiona@landmarkfarm.com',
      role: 'farmer',
      bio: 'Level 3: Tendy Landmark Farm - Heritage farm committed to zero waste and sustainable practices.',
      quote: '"Every imperfect vegetable has perfect flavor - waste not, want not."',
      practices: 'Zero Waste, Heritage Varieties, Regenerative Agriculture',
      isVerified: true
    },
    members: [
      { id: '12', avatar: 'https://i.pravatar.cc/48?img=13', name: 'James H.' },
      { id: '13', avatar: 'https://i.pravatar.cc/48?img=14', name: 'Sophie L.' },
    ]
  },
  {
    id: 'prod06',
    title: 'Raw Wildflower Honey - 500g Jar',
    description: 'Pure, unfiltered honey from our heritage farm\'s beehives. Each jar captures the essence of our wildflower meadows. Never heated, never processed - just pure liquid gold.',
    price: 18.00,
    originalPrice: 24.00,
    weight: '500g jar',
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop'],
    farmerId: 'farmer03',
    createdAt: new Date().toISOString(),
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    hostId: null,
    progress: 20,
    spotsLeft: 20,
    spotsTotal: 25,
    daysLeft: 8,
    farmer: {
      name: 'Landmark Heritage Farm',
      avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg',
      id: 'farmer03',
      email: 'fiona@landmarkfarm.com',
      role: 'farmer',
      bio: 'Level 3: Tendy Landmark Farm - Heritage farm committed to zero waste and sustainable practices.',
      quote: '"Every imperfect vegetable has perfect flavor - waste not, want not."',
      practices: 'Zero Waste, Heritage Varieties, Regenerative Agriculture',
      isVerified: true
    },
    members: [
      { id: '14', avatar: 'https://i.pravatar.cc/48?img=15', name: 'Alex R.' },
    ]
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
   * NOTE: This is currently returning enhanced mock data for the hackathon demo.
   * The data includes different farmer verification levels and product types.
   */
  async getAllProducts(limit?: number): Promise<ProductWithFarmer[]> {
    console.log('Fetching ENHANCED MOCK products for hackathon demo...');

    // Simulate realistic network delay
    await new Promise(resolve => setTimeout(resolve, 400));

    const productsToReturn = limit ? mockProducts.slice(0, limit) : mockProducts;

    console.log(`Mock products fetched successfully: ${productsToReturn.length} products from ${new Set(productsToReturn.map(p => p.farmer.name)).size} different farms`);
    
    // Log verification levels for demo purposes
    const verificationLevels = productsToReturn.map(p => p.farmer.bio?.split(' - ')[0]).filter(Boolean);
    console.log('Farmer verification levels in demo:', [...new Set(verificationLevels)]);
    
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
  },

  // Load placeholder data from JSON files (for future use)
  async loadPlaceholderData() {
    try {
      const [usersResponse, productsResponse] = await Promise.all([
        fetch('/placeholder-users.json'),
        fetch('/placeholder-products.json')
      ]);

      const users = await usersResponse.json();
      const products = await productsResponse.json();

      console.log('Loaded placeholder data:', { users: users.length, products: products.length });
      return { users, products };
    } catch (error) {
      console.error('Failed to load placeholder data:', error);
      throw error;
    }
  }
};