import { farmers, getFarmerById, getFarmerByEmail, getAllFarmers } from '../data/farmers';
import type { Farmer } from '../types';

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

// In-memory storage for new farmers
let mockFarmers = [...farmers];

export const farmerService = {
  // Get farmer by ID
  async getFarmerById(farmerId: string) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    
    const farmer = getFarmerById(farmerId);
    if (!farmer) {
      throw new Error('Farmer not found');
    }
    
    return farmer;
  },

  // Get farmer by email
  async getFarmerByEmail(email: string) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    
    return getFarmerByEmail(email);
  },

  // Create a new farmer
  async createFarmer(farmerData: CreateFarmerData) {
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
    
    const newFarmer: Farmer = {
      id: `farmer-${Date.now()}`,
      name: farmerData.name,
      farmName: farmerData.farmName,
      location: farmerData.location,
      established: farmerData.established,
      practices: farmerData.practices,
      imageUrl: farmerData.imageUrl,
      bannerUrl: farmerData.bannerUrl,
      quote: farmerData.quote,
      story: farmerData.story,
      email: farmerData.email,
      createdAt: new Date().toISOString()
    };

    mockFarmers.push(newFarmer);
    return newFarmer;
  },

  // Update farmer profile
  async updateFarmer(farmerId: string, updates: Partial<CreateFarmerData>) {
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
    
    const farmerIndex = mockFarmers.findIndex(f => f.id === farmerId);
    if (farmerIndex === -1) {
      throw new Error('Farmer not found');
    }

    const updatedFarmer = {
      ...mockFarmers[farmerIndex],
      ...updates,
      farmName: updates.farmName || mockFarmers[farmerIndex].farmName
    };

    mockFarmers[farmerIndex] = updatedFarmer;
    return updatedFarmer;
  },

  // Get all farmers
  async getAllFarmers() {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    
    return getAllFarmers();
  }
};