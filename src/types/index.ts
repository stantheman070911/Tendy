import { z } from 'zod';

// Base Farmer Schema
export const FarmerSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    farm_name: z.string(),
    image_url: z.string(),
    banner_url: z.string(),
    story: z.string(),
    quote: z.string(),
    location: z.string(),
    established: z.number(),
    practices: z.array(z.string()),
    created_at: z.string(),
  })
  .transform((data) => ({
    id: data.id,
    name: data.name,
    farmName: data.farm_name,
    imageUrl: data.image_url,
    bannerUrl: data.banner_url,
    story: data.story,
    quote: data.quote,
    location: data.location,
    established: data.established,
    practices: data.practices,
    createdAt: data.created_at,
  }));

export type Farmer = z.infer<typeof FarmerSchema>;

// Base Product Schema (without farmer relation)
export const ProductSchema = z
  .object({
    id: z.string(),
    created_at: z.string(),
    title: z.string(),
    description: z.string(),
    weight: z.string(),
    price: z.number(),
    original_price: z.number(),
    image_url: z.string(),
    gallery: z.array(z.string()).nullable(),
    farmer_id: z.string(),
    progress: z.number().optional().default(0),
    spots_left: z.number().optional().default(0),
    days_left: z.number().optional().default(0),
    host_id: z.string().nullable().optional(),
    // Add members field for compatibility
    members: z.array(z.object({
      id: z.string(),
      avatar: z.string(),
      name: z.string(),
    })).optional().default([]),
  })
  .transform((data) => ({
    id: data.id,
    createdAt: data.created_at,
    title: data.title,
    description: data.description,
    weight: data.weight,
    price: data.price,
    originalPrice: data.original_price,
    imageUrl: data.image_url,
    gallery: data.gallery ?? [],
    farmerId: data.farmer_id,
    progress: data.progress,
    spotsLeft: data.spots_left,
    daysLeft: data.days_left,
    hostId: data.host_id,
    members: data.members,
  }));

export type Product = z.infer<typeof ProductSchema>;

// Product with Farmer relation (for queries that include farmer data)
export const ProductWithFarmerSchema = z
  .object({
    id: z.string(),
    created_at: z.string(),
    title: z.string(),
    description: z.string(),
    weight: z.string(),
    price: z.number(),
    original_price: z.number(),
    image_url: z.string(),
    gallery: z.array(z.string()).nullable(),
    farmer_id: z.string(),
    progress: z.number().optional().default(0),
    spots_left: z.number().optional().default(0),
    days_left: z.number().optional().default(0),
    host_id: z.string().nullable().optional(),
    // Farmer relation
    farmers: z
      .object({
        name: z.string(),
        image_url: z.string(),
      })
      .nullable(),
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
    id: data.id,
    createdAt: data.created_at,
    title: data.title,
    description: data.description,
    weight: data.weight,
    price: data.price,
    originalPrice: data.original_price,
    imageUrl: data.image_url,
    gallery: data.gallery ?? [],
    farmerId: data.farmer_id,
    farmer: data.farmers
      ? { name: data.farmers.name, avatar: data.farmers.image_url }
      : { name: 'Unknown Farmer', avatar: '' },
    progress: data.progress,
    spotsLeft: data.spots_left,
    daysLeft: data.days_left,
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
export type HostSection = 'manage-groups' | 'earnings' | 'host-profile';

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