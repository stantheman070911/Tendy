// supabase/seed.ts

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { farmers } from '../src/data/farmers';
import { sampleProducts } from '../src/data/products';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY;

// --- Debugging Block ---
// This will now run correctly after the variables have been declared.
console.log("--- V V V DEBUGGING V V V ---");
console.log("Is Supabase URL loaded?", supabaseUrl ? `Yes, starts with ${supabaseUrl.substring(0, 20)}` : "No, it's MISSING!");
console.log("Is Supabase Key loaded?", supabaseKey ? "Yes" : "No, it's MISSING!");
console.log("--- ^ ^ ^ DEBUGGING ^ ^ ^ ---");


if (!supabaseUrl || !supabaseKey) {
  throw new Error("Stopping script: Supabase URL and service key are required in your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Starting database seed process...');

  // --- 1. SEED FARMERS ---
  console.log('Clearing existing farmers...');
  const { error: deleteFarmersError } = await supabase.from('farmers').delete().neq('id', 0); // Delete all
  if (deleteFarmersError) {
    console.error('Error clearing farmers:', deleteFarmersError);
    return;
  }

  console.log('Inserting farmers...');
  const transformedFarmers = farmers.map(farmer => ({
    id: farmer.id,
    name: farmer.name,
    story: farmer.story,
    quote: farmer.quote,
    image_url: farmer.imageUrl,
    banner_url: farmer.bannerUrl,
    farm_name: farmer.farmName,
    location: farmer.location,
    established: farmer.established,
    practices: farmer.practices,
  }));

  const { data: seededFarmers, error: insertFarmersError } = await supabase
    .from('farmers')
    .insert(transformedFarmers)
    .select();

  if (insertFarmersError) {
    console.error('Error seeding farmers:', insertFarmersError);
    return;
  }
  console.log(`✅ Seeded ${seededFarmers.length} farmers.`);

  // --- 2. SEED PRODUCTS ---
  console.log('Clearing existing products...');
  const { error: deleteProductsError } = await supabase.from('products').delete().neq('id', 0);
  if (deleteProductsError) {
    console.error('Error clearing products:', deleteProductsError);
    return;
  }
  
  console.log('Inserting products...');
  const transformedProducts = sampleProducts.map(product => ({
    id: product.id,
    title: product.title,
    description: product.description,
    weight: product.weight,
    price: product.price,
    original_price: product.originalPrice,
    image_url: product.imageUrl,
    gallery: product.gallery || [product.imageUrl],
    farmer_id: product.farmerId,
    progress: product.progress,
    spots_left: product.spotsLeft,
    days_left: product.daysLeft,
  }));

  const { data: seededProducts, error: insertProductsError } = await supabase
    .from('products')
    .insert(transformedProducts)
    .select();

  if (insertProductsError) {
    console.error('Error seeding products:', insertProductsError);
    return;
  }
  console.log(`✅ Seeded ${seededProducts.length} products.`);
  
  console.log('🏆 Database seeding completed successfully!');
}

seedDatabase().catch(console.error);