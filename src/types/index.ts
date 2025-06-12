import { z } from 'zod';

export const FarmerSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    farm_name: z.string(),
    image_url: z.string(),
    story: z.string(),
    created_at: z.string(),
  })
  .transform((data) => ({
    id: data.id,
    name: data.name,
    farmName: data.farm_name,
    imageUrl: data.image_url,
    story: data.story,
    createdAt: data.created_at,
  }));

export type Farmer = z.infer<typeof FarmerSchema>;

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
    // We get the full farmer object when we query, so we can define its shape.
    farmers: z
      .object({
        name: z.string(),
        image_url: z.string(),
      })
      .nullable(),
    spots_left: z.number().optional().default(0),
    days_left: z.number().optional().default(0),
    // FIX: Made host_id optional to handle products that may not have a host.
    host_id: z.string().nullable().optional(), 
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
    spotsLeft: data.spots_left,
    daysLeft: data.days_left,
    // FIX: Handle the optional hostId in the transformation
    hostId: data.host_id,
  }));

export type Product = z.infer<typeof ProductSchema>;
