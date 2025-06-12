// src/loaders/productLoader.ts
import { LoaderFunctionArgs } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ProductWithFarmerSchema } from '../types';

export const productLoader = async ({ params }: LoaderFunctionArgs) => {
  const { productId } = params;
  
  if (!productId) {
    throw new Response('Product ID is required', { status: 400 });
  }

  // Fetch product with farmer information
  const { data: productData, error } = await supabase
    .from('products')
    .select(`
      *,
      farmer:farmers(name, image_url)
    `)
    .eq('id', productId)
    .single();

  if (error) {
    console.error('Supabase loader error:', error);
    throw new Response('Failed to load product data.', { status: 500 });
  }
  
  if (!productData) {
    throw new Response('Product not found', { status: 404 });
  }

  // Parse and transform the data using Zod schema
  try {
    const product = ProductWithFarmerSchema.parse(productData);
    return { product };
  } catch (parseError) {
    console.error('Data parsing error:', parseError);
    throw new Response('Invalid data format received from database.', { status: 500 });
  }
};