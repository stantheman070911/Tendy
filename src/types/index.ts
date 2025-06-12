import { z } from 'zod';

// Base schemas for database entities
export const DatabaseFarmerSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string(),
  story: z.string().nullable(),
  quote: z.string().nullable(),
  image_url: z.string().nullable(),
  banner_url: z.string().nullable(),
  farm_name: z.string(),
  location: z.string().nullable(),
  established: z.number().nullable(),
  practices: z.array(z.string()).default([]),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const DatabaseProductSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  title: z.string(),
  description: z.string().nullable(),
  weight: z.string().nullable(),
  price: z.number(),
  original_price: z.number().nullable(),
  image_url: z.string().nullable(),
  gallery: z.array(z.string()).nullable().default([]),
  farmer_id: z.union([z.string(), z.number()]).transform(String),
  progress: z.number().nullable().default(0),
  spots_left: z.number().nullable().default(0),
  days_left: z.number().nullable().default(0),
  group_type: z.string().default('one_time'),
  host_id: z.string().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Transformed schemas for frontend use
export const FarmerSchema = DatabaseFarmerSchema.transform(data => ({
  id: data.id,
  name: data.name,
  story: data.story || '',
  quote: data.quote || '',
  imageUrl: data.image_url || '',
  bannerUrl: data.banner_url || '',
  farmName: data.farm_name,
  location: data.location || '',
  established: data.established || new Date().getFullYear(),
  practices: data.practices,
}));

export const ProductSchema = DatabaseProductSchema.transform(data => ({
  id: data.id,
  title: data.title,
  description: data.description || '',
  weight: data.weight || '',
  price: data.price,
  originalPrice: data.original_price || data.price,
  imageUrl: data.image_url || '',
  gallery: data.gallery || [data.image_url || ''],
  farmerId: data.farmer_id,
  progress: data.progress || 0,
  spotsLeft: data.spots_left || 0,
  daysLeft: data.days_left || 0,
  groupType: data.group_type,
  hostId: data.host_id,
  // These will be populated by joins or separate queries
  farmer: {
    name: '',
    avatar: ''
  },
  host: null as { name: string; avatar: string } | null,
  members: [] as Array<{ id: string; avatar: string; name: string }>,
}));

// Schema for products with farmer data from joins
export const ProductWithFarmerSchema = DatabaseProductSchema.extend({
  farmer: z.object({
    name: z.string(),
    image_url: z.string().nullable(),
  }).nullable(),
}).transform(data => ({
  id: data.id,
  title: data.title,
  description: data.description || '',
  weight: data.weight || '',
  price: data.price,
  originalPrice: data.original_price || data.price,
  imageUrl: data.image_url || '',
  gallery: data.gallery || [data.image_url || ''],
  farmerId: data.farmer_id,
  progress: data.progress || 0,
  spotsLeft: data.spots_left || 0,
  daysLeft: data.days_left || 0,
  groupType: data.group_type,
  hostId: data.host_id,
  farmer: {
    name: data.farmer?.name || 'Unknown Farmer',
    avatar: data.farmer?.image_url || 'https://i.pravatar.cc/80?img=1'
  },
  host: null as { name: string; avatar: string } | null,
  members: [] as Array<{ id: string; avatar: string; name: string }>,
}));

// Infer TypeScript types from schemas
export type Farmer = z.infer<typeof FarmerSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductWithFarmer = z.infer<typeof ProductWithFarmerSchema>;

// Legacy interfaces for backward compatibility (will be removed gradually)
export interface NavigationItem {
  label: string;
  href: string;
}

export type UserRole = 'supporter' | 'farmer' | 'host';

export interface User {
  name: string;
  role: UserRole;
}

export type SupporterSection = 'group-buys' | 'order-history' | 'profile';
export type FarmerSection = 'listings' | 'sales' | 'farm-profile';
export type HostSection = 'manage-groups' | 'earnings' | 'host-profile';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (role: UserRole) => Promise<void>;
  logout: () => void;
}

export interface DashboardNavItem {
  id: string;
  icon: string;
  label: string;
  path: string;
}

export interface GroupPermissions {
  canCreatePublic: boolean;
  canCreatePrivate: boolean;
}