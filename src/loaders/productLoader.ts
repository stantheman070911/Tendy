// src/loaders/productLoader.ts
import { LoaderFunctionArgs } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export const productLoader = async ({ params }: LoaderFunctionArgs) => {
  const { productId } = params;
  
  if (!productId) {
    throw new Response('Product ID is required', { status: 400 });
  }

  // Fetch product with farmer information
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      farmer:farmers(name, avatar)
    `)
    .eq('id', productId)
    .single();

  if (error) {
    console.error('Supabase loader error:', error);
    throw new Response('Failed to load product data.', { status: 500 });
  }
  
  if (!product) {
    throw new Response('Product not found', { status: 404 });
  }

  return { product };
};