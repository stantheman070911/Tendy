export interface Product {
  id: string;
  title: string;
  description: string;
  weight: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  image_url?: string; // Database field name
  gallery?: string[];
  farmer: {
    name: string;
    avatar: string;
  };
  farmerId: string;
  farmer_id?: string; // Database field name
  host?: {
    name: string;
    avatar: string;
  };
  progress: number;
  spotsLeft: number;
  spots_left?: number; // Database field name
  daysLeft: number;
  days_left?: number; // Database field name
  members: Array<{
    id: string;
    avatar: string;
    name: string;
  }>;
}

export interface Farmer {
  id: string;
  name: string;
  story: string;
  quote: string;
  imageUrl: string;
  image_url?: string; // Database field name
  bannerUrl: string;
  banner_url?: string; // Database field name
  farmName: string;
  farm_name?: string; // Database field name
  location: string;
  established: number;
  practices: string[];
}

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

// Database types for Supabase integration
export interface DatabaseProduct {
  id: string;
  title: string;
  description: string;
  weight: string;
  price: number;
  original_price: number;
  image_url: string;
  gallery?: string[];
  farmer_id: string;
  progress?: number;
  spots_left?: number;
  days_left?: number;
  members?: Array<{
    id: string;
    avatar: string;
    name: string;
  }>;
  host?: {
    name: string;
    avatar: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseFarmer {
  id: string;
  name: string;
  story: string;
  quote: string;
  image_url: string;
  banner_url: string;
  farm_name: string;
  location: string;
  established: number;
  practices: string[];
  created_at?: string;
  updated_at?: string;
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