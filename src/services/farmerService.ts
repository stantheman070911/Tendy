import { supabase } from '../lib/supabaseClient';
import { FarmerSchema } from '../types';
import { z } from 'zod';

export interface CreateFarmerData {
  name: string;
  email: string;
  farmName: string;
  location: string;
  established: number;
  story: string;
  quote: string;
  imageUrl: string;
  bannerUrl: string;
  practices: string[];
}

export const farmerService = {
  // Get farmer by ID
  async getFarmerById(farmerId: string) {
    const { data, error } = await supabase
      .from('farmers')
      .select('*')
      .eq('id', farmerId)
      .single();

    if (error) {
      throw new Error(error.message || 'Failed to fetch farmer');
    }

    return FarmerSchema.parse(data);
  },

  // Get farmer by email
  async getFarmerByEmail(email: string) {
    const { data, error } = await supabase
      .from('farmers')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message || 'Failed to fetch farmer');
    }

    return data ? FarmerSchema.parse(data) : null;
  },

  // Create a new farmer
  async createFarmer(farmerData: CreateFarmerData) {
    const { data, error } = await supabase
      .from('farmers')
      .insert([{
        name: farmerData.name,
        email: farmerData.email,
        farm_name: farmerData.farmName,
        location: farmerData.location,
        established: farmerData.established,
        story: farmerData.story,
        quote: farmerData.quote,
        image_url: farmerData.imageUrl,
        banner_url: farmerData.bannerUrl,
        practices: farmerData.practices
      }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'Failed to create farmer profile');
    }

    return FarmerSchema.parse(data);
  },

  // Update farmer profile
  async updateFarmer(farmerId: string, updates: Partial<CreateFarmerData>) {
    const updateData: any = {};
    
    if (updates.name) updateData.name = updates.name;
    if (updates.farmName) updateData.farm_name = updates.farmName;
    if (updates.location) updateData.location = updates.location;
    if (updates.established) updateData.established = updates.established;
    if (updates.story) updateData.story = updates.story;
    if (updates.quote) updateData.quote = updates.quote;
    if (updates.imageUrl) updateData.image_url = updates.imageUrl;
    if (updates.bannerUrl) updateData.banner_url = updates.bannerUrl;
    if (updates.practices) updateData.practices = updates.practices;

    const { data, error } = await supabase
      .from('farmers')
      .update(updateData)
      .eq('id', farmerId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'Failed to update farmer profile');
    }

    return FarmerSchema.parse(data);
  },

  // Get all farmers
  async getAllFarmers() {
    const { data, error } = await supabase
      .from('farmers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message || 'Failed to fetch farmers');
    }

    return z.array(FarmerSchema).parse(data || []);
  }
};