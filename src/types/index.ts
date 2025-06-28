import { z } from 'zod';

// Base Farmer Schema
export const FarmerSchema = z
  .object({
    id: z.union([z.number(), z.string()]), // Accept both number and string
    name: z.string(),
    farm_name: z.string().optional(),
    image_url: z.string().optional(),
    banner_url: z.string().optional(),
    story: z.string().optional(),
    quote: z.string().optional(),
    location: z.string().optional(),
    established: z.number().optional(),
    practices: z.array(z.string()).optional(),
    created_at: z.string(),
    // New fields for mock data compatibility
    email: z.string().optional(),
    role: z.string().optional(),
    avatar_url: z.string().optional(),
    bio: z.string().optional(),
    is_verified: z.boolean().optional(),
  })
  .transform((data) => ({
    id: data.id.toString(),
    name: data.name,
    farmName: data.farm_name || '',
    imageUrl: data.image_url || data.avatar_url || '',
    bannerUrl: data.banner_url || '',
    story: data.story || data.bio || '',
    quote: data.quote || '',
    location: data.location || '',
    established: data.established || 0,
    practices: data.practices || [],
    createdAt: data.created_at,
    email: data.email || '',
    role: data.role || 'farmer',
    avatarUrl: data.avatar_url || data.image_url || '',
    bio: data.bio || data.story || '',
    isVerified: data.is_verified || false,
  }));

export type Farmer = z.infer<typeof FarmerSchema>;

// Base Product Schema (without farmer relation)
export const ProductSchema = z
  .object({
    id: z.union([z.number(), z.string()]), // Accept both number and string
    created_at: z.string(),
    title: z.string().optional(),
    name: z.string().optional(), // New field for mock data
    description: z.string(),
    weight: z.string().optional(),
    unit: z.string().optional(), // New field for mock data
    price: z.number(),
    original_price: z.number().optional(),
    image_url: z.string(),
    gallery: z.array(z.string()).nullable().optional(),
    farmer_id: z.union([z.number(), z.string()]), // Accept both number and string
    progress: z.number().optional().default(0),
    spots_left: z.number().optional().default(0),
    spots_total: z.number().optional(), // New field for mock data
    days_left: z.number().optional().default(0),
    end_date: z.string().optional(), // New field for mock data
    status: z.string().optional(), // New field for mock data
    host_id: z.string().nullable().optional(),
    // Add members field for compatibility
    members: z.array(z.object({
      id: z.string(),
      avatar: z.string(),
      name: z.string(),
    })).optional().default([]),
  })
  .transform((data) => ({
    id: data.id.toString(),
    createdAt: data.created_at,
    title: data.title || data.name || '',
    description: data.description,
    weight: data.weight || data.unit || '',
    price: data.price,
    originalPrice: data.original_price || 0,
    imageUrl: data.image_url,
    gallery: data.gallery ?? [],
    farmerId: data.farmer_id.toString(),
    progress: data.progress,
    spotsLeft: data.spots_left,
    spotsTotal: data.spots_total || 0,
    daysLeft: data.days_left || (data.end_date ? Math.ceil((new Date(data.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0),
    endDate: data.end_date,
    status: data.status || 'active',
    hostId: data.host_id,
    members: data.members,
  }));

export type Product = z.infer<typeof ProductSchema>;

// Product with Farmer relation (for queries that include farmer data)
export const ProductWithFarmerSchema = z
  .object({
    id: z.union([z.number(), z.string()]), // Accept both number and string
    created_at: z.string(),
    title: z.string().optional(),
    name: z.string().optional(), // New field for mock data
    description: z.string(),
    weight: z.string().optional(),
    unit: z.string().optional(), // New field for mock data
    price: z.number(),
    original_price: z.number().optional(),
    image_url: z.string(),
    gallery: z.array(z.string()).nullable().optional(),
    farmer_id: z.union([z.number(), z.string()]), // Accept both number and string
    progress: z.number().optional().default(0),
    spots_left: z.number().optional().default(0),
    spots_total: z.number().optional(), // New field for mock data
    days_left: z.number().optional().default(0),
    end_date: z.string().optional(), // New field for mock data
    status: z.string().optional(), // New field for mock data
    host_id: z.string().nullable().optional(),
    // Farmer relation - support both old and new structure
    farmers: z
      .object({
        name: z.string(),
        image_url: z.string(),
      })
      .nullable()
      .optional(),
    farmer: z
      .object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        role: z.string(),
        avatar_url: z.string(),
        bio: z.string(),
        quote: z.string(),
        practices: z.string(),
        created_at: z.string(),
        is_verified: z.boolean(),
      })
      .optional(),
    // Add members field for compatibility
    members: z.array(z.object({
      id: z.string(),
      avatar: z.string(),
      name: z.string(),
    })).optional().default([]),
    // Add host field for compatibility
    host: z.object({
      name: z.string(),
      avatar: z.string(),
    }).nullable().optional(),
  })
  .transform((data) => ({
    id: data.id.toString(),
    createdAt: data.created_at,
    title: data.title || data.name || '',
    description: data.description,
    weight: data.weight || data.unit || '',
    price: data.price,
    originalPrice: data.original_price || 0,
    imageUrl: data.image_url,
    gallery: data.gallery ?? [],
    farmerId: data.farmer_id.toString(),
    farmer: data.farmer
      ? { 
          name: data.farmer.name, 
          avatar: data.farmer.avatar_url,
          id: data.farmer.id,
          email: data.farmer.email,
          role: data.farmer.role,
          bio: data.farmer.bio,
          quote: data.farmer.quote,
          practices: data.farmer.practices,
          isVerified: data.farmer.is_verified
        }
      : data.farmers
      ? { name: data.farmers.name, avatar: data.farmers.image_url }
      : { name: 'Unknown Farmer', avatar: '' },
    progress: data.progress,
    spotsLeft: data.spots_left,
    spotsTotal: data.spots_total || 0,
    daysLeft: data.days_left || (data.end_date ? Math.ceil((new Date(data.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0),
    endDate: data.end_date,
    status: data.status || 'active',
    hostId: data.host_id,
    members: data.members,
    host: data.host,
  }));

export type ProductWithFarmer = z.infer<typeof ProductWithFarmerSchema>;

export interface NavigationItem {
  label: string;
  href: string;
}

// Centralized user role types
export type UserRole = 'supporter' | 'farmer' | 'host';

export interface User {
  name: string;
  role: UserRole;
}

// Dashboard section types for better type safety
export type SupporterSection = 'group-buys' | 'order-history' | 'profile';
export type FarmerSection = 'listings' | 'sales' | 'farm-profile';
export type HostSection = 'manage-groups' | 'earnings' | 'host-profile' | 'dispute-management';

// API response types for better structure
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Authentication context types
export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (role: UserRole) => Promise<void>;
  logout: () => void;
}

// Navigation item interface for dashboard
export interface DashboardNavItem {
  id: string;
  icon: string;
  label: string;
  path: string;
}

// Group creation permissions
export interface GroupPermissions {
  canCreatePublic: boolean;
  canCreatePrivate: boolean;
}