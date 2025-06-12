// src/loaders/farmerLoader.ts
import { LoaderFunctionArgs } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { FarmerSchema, ProductWithFarmerSchema } from '../types';
import { z } from 'zod';

export const farmerLoader = async ({ params }: LoaderFunctionArgs) => {
  const { farmerId } = params;

  if (!farmerId) {
    throw new Response('Farmer ID is required', { status: 400 });
  }

  // PERFORMANCE OPTIMIZATION: PARALLEL FETCHING
  const farmerPromise = supabase
    .from('farmers')
    .select('*')
    .eq('id', farmerId)
    .single();

  const productsPromise = supabase
    .from('products')
    .select(`
      *,
      farmer:farmers(name, image_url)
    `)
    .eq('farmer_id', farmerId);

  const [{ data: farmerData, error: farmerError }, { data: productsData, error: productsError }] = await Promise.all([
    farmerPromise,
    productsPromise
  ]);

  if (farmerError || productsError) {
    console.error('Supabase loader error:', farmerError || productsError);
    throw new Response('Failed to load farmer data.', { status: 500 });
  }

  if (!farmerData) {
    throw new Response('Farmer not found', { status: 404 });
  }

  // Parse and transform the data using Zod schemas
  try {
    const farmer = FarmerSchema.parse(farmerData);
    const products = z.array(ProductWithFarmerSchema).parse(productsData || []);

    return { farmer, products };
  } catch (parseError) {
    console.error('Data parsing error:', parseError);
    throw new Response('Invalid data format received from database.', { status: 500 });
  }
};