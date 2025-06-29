import { z } from 'zod';

// Base Farmer Schema
export const FarmerSchema = z
  .object({
    id: z.union([z.number(), z.string()]), // Accept both number and string
    name: z.string(),
    farmName: z.string().optional(),
    imageUrl: z.string().optional(),
    bannerUrl: z.string().optional(),
    story: z.string().optional(),
    quote: z.string().optional(),
    location: z.string().optional(),
    established: z.number().optional(),
    practices: z.array(z.string()).optional(),
    createdAt: z.string(),
    email: z.string().optional(),
  })
  .transform((data) => ({
    id: data.id.toString(),
    name: data.name,
    farmName: data.farmName || '',
    imageUrl: data.imageUrl || '',
    bannerUrl: data.bannerUrl || '',
    story: data.story || '',
    quote: data.quote || '',
    location: data.location || '',
    established: data.established || 0,
    practices: data.practices || [],
    createdAt: data.createdAt,
    email: data.email || '',
  }));

export type Farmer = z.infer<typeof FarmerSchema>;

// Base Product Schema (without farmer relation)
export const ProductSchema = z
  .object({
    id: z.union([z.number(), z.string()]), // Accept both number and string
    createdAt: z.string(),
    title: z.string(),
    description: z.string(),
    weight: z.string(),
    price: z.number(),
    originalPrice: z.number().optional(),
    imageUrl: z.string(),
    gallery: z.array(z.string()).nullable().optional(),
    farmerId: z.union([z.number(), z.string()]), // Accept both number and string
    progress: z.number().optional().default(0),
    spotsLeft: z.number().optional().default(0),
    spotsTotal: z.number().optional(),
    daysLeft: z.number().optional().default(0),
    endDate: z.string().optional(),
    status: z.string().optional(),
    hostId: z.string().nullable().optional(),
    members: z.array(z.object({
      id: z.string(),
      avatar: z.string(),
      name: z.string(),
    })).optional().default([]),
  })
  .transform((data) => ({
    id: data.id.toString(),
    createdAt: data.createdAt,
    title: data.title,
    description: data.description,
    weight: data.weight,
    price: data.price,
    originalPrice: data.originalPrice || 0,
    imageUrl: data.imageUrl,
    gallery: data.gallery ?? [],
    farmerId: data.farmerId.toString(),
    progress: data.progress,
    spotsLeft: data.spotsLeft,
    spotsTotal: data.spotsTotal || 0,
    daysLeft: data.daysLeft || (data.endDate ? Math.ceil((new Date(data.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0),
    endDate: data.endDate,
    status: data.status || 'active',
    hostId: data.hostId,
    members: data.members,
  }));

export type Product = z.infer<typeof ProductSchema>;

// Product with Farmer relation (for queries that include farmer data)
export const ProductWithFarmerSchema = z
  .object({
    id: z.union([z.number(), z.string()]), // Accept both number and string
    createdAt: z.string(),
    title: z.string(),
    description: z.string(),
    weight: z.string(),
    price: z.number(),
    originalPrice: z.number().optional(),
    imageUrl: z.string(),
    gallery: z.array(z.string()).nullable().optional(),
    farmerId: z.union([z.number(), z.string()]), // Accept both number and string
    progress: z.number().optional().default(0),
    spotsLeft: z.number().optional().default(0),
    spotsTotal: z.number().optional(),
    daysLeft: z.number().optional().default(0),
    endDate: z.string().optional(),
    status: z.string().optional(),
    hostId: z.string().nullable().optional(),
    // Farmer relation - support mock data structure
    farmer: z
      .object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        role: z.string(),
        avatar: z.string(),
        bio: z.string(),
        quote: z.string(),
        practices: z.string(),
        isVerified: z.boolean(),
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
    createdAt: data.createdAt,
    title: data.title,
    description: data.description,
    weight: data.weight,
    price: data.price,
    originalPrice: data.originalPrice || 0,
    imageUrl: data.imageUrl,
    gallery: data.gallery ?? [],
    farmerId: data.farmerId.toString(),
    farmer: data.farmer || { 
      name: 'Unknown Farmer', 
      avatar: '',
      id: data.farmerId.toString(),
      email: '',
      role: 'farmer',
      bio: '',
      quote: '',
      practices: '',
      isVerified: false
    },
    progress: data.progress,
    spotsLeft: data.spotsLeft,
    spotsTotal: data.spotsTotal || 0,
    daysLeft: data.daysLeft || (data.endDate ? Math.ceil((new Date(data.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0),
    endDate: data.endDate,
    status: data.status || 'active',
    hostId: data.hostId,
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
export type SupporterSection = 'group-buys' | 'subscriptions' | 'order-history' | 'profile';
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