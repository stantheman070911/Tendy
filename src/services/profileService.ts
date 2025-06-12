import { supabase } from '../lib/supabaseClient';

export interface UpdateProfileData {
  fullName?: string;
  zipCode?: string;
  groupsHosted?: number;
  totalMembersServed?: number;
}

export const profileService = {
  // Get user profile
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message || 'Failed to fetch profile');
    }

    return data;
  },

  // Create user profile
  async createProfile(userId: string, profileData: UpdateProfileData) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        full_name: profileData.fullName,
        zip_code: profileData.zipCode,
        groups_hosted: profileData.groupsHosted || 0,
        total_members_served: profileData.totalMembersServed || 0
      }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'Failed to create profile');
    }

    return data;
  },

  // Update user profile
  async updateProfile(userId: string, updates: UpdateProfileData) {
    const updateData: any = {};
    
    if (updates.fullName !== undefined) updateData.full_name = updates.fullName;
    if (updates.zipCode !== undefined) updateData.zip_code = updates.zipCode;
    if (updates.groupsHosted !== undefined) updateData.groups_hosted = updates.groupsHosted;
    if (updates.totalMembersServed !== undefined) updateData.total_members_served = updates.totalMembersServed;

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'Failed to update profile');
    }

    return data;
  }
};