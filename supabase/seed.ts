import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { farmers } from '../src/data/farmers';
import { sampleProducts } from '../src/data/products';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_KEY!
);

async function seedDatabase() {
  // Clear and seed farmers (let IDs auto-generate)
  await supabase.from('farmers').delete().neq('id', 0);
  const { data: seededFarmers } = await supabase
    .from('farmers')
    .insert(farmers.map(f => ({
      name: f.name,
      story: f.story,
      quote: f.quote,
      image_url: f.imageUrl,
      banner_url: f.bannerUrl,
      farm_name: f.farmName,
      location: f.location,
      established: f.established,
      practices: f.practices
    })))
    .select();

  // Map original IDs to new auto-generated IDs
  const idMap: { [key: string]: number } = {};
  farmers.forEach((farmer, i) => {
    idMap[farmer.id] = seededFarmers![i].id;
  });

  // Clear and seed products (let IDs auto-generate)
  await supabase.from('products').delete().neq('id', 0);
  await supabase
    .from('products')
    .insert(sampleProducts.map(p => ({
      title: p.title,
      description: p.description,
      weight: p.weight,
      price: p.price,
      original_price: p.originalPrice,
      image_url: p.imageUrl,
      gallery: p.gallery || [p.imageUrl],
      farmer_id: idMap[p.farmerId],
      progress: p.progress,
      spots_left: p.spotsLeft,
      days_left: p.daysLeft
    })));

  console.log('✅ Database seeded successfully!');
}

seedDatabase().catch(console.error);