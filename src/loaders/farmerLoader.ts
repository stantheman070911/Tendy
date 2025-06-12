// src/loaders/farmerLoader.ts
import { LoaderFunctionArgs } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export const farmerLoader = async ({ params }: LoaderFunctionArgs) => {
  // 3. 'params' contains the dynamic parts of the URL. For a route like "/farmer/:farmerId",
  //    'params.farmerId' will be the ID from the URL (e.g., "1").
  const { farmerId } = params;

  if (!farmerId) {
    throw new Response('Farmer ID is required', { status: 400 });
  }

  // --- PERFORMANCE OPTIMIZATION: PARALLEL FETCHING ---
  // 4. Instead of fetching the farmer, then waiting, then fetching their products,
  //    we define both requests first and run them at the same time.
  const farmerPromise = supabase
    .from('farmers')
    .select('*')
    .eq('id', farmerId)
    .single(); // .single() ensures we get one object, not an array of one.

  const productsPromise = supabase
    .from('products')
    .select(`
      *,
      farmer:farmers(name, image_url)
    `)
    .eq('farmer_id', farmerId); // Fetches all products where farmer_id matches.

  // 5. `Promise.all()` is the key. It executes both promises simultaneously.
  //    The code will only proceed once BOTH requests have completed.
  //    This significantly reduces the total loading time.
  const [{ data: farmer, error: farmerError }, { data: products, error: productsError }] = await Promise.all([
    farmerPromise,
    productsPromise
  ]);

  // 6. After both promises resolve, we destructure the results to get the
  //    data and potential errors from each individual request.

  // 7. This is our robust error handling. If either the farmer or product request failed,
  //    we stop everything and throw an error that our ErrorBoundary will catch and display.
  if (farmerError || productsError) {
    console.error('Supabase loader error:', farmerError || productsError);
    throw new Response('Failed to load farmer data.', { status: 500 });
  }

  if (!farmer) {
    throw new Response('Farmer not found', { status: 404 });
  }

  // Transform products to match the expected interface
  const transformedProducts = products?.map(product => ({
    ...product,
    // Map database fields to interface fields for compatibility
    imageUrl: product.image_url,
    originalPrice: product.original_price,
    spotsLeft: product.spots_left || 0,
    daysLeft: product.days_left || 0,
    farmerId: product.farmer_id,
    // Ensure farmer object has the expected structure
    farmer: {
      name: product.farmer?.name || farmer.name,
      avatar: product.farmer?.image_url || farmer.image_url
    },
    // Add default values for fields that might not exist in database yet
    progress: product.progress || Math.floor(Math.random() * 80) + 10,
    members: product.members || [],
    gallery: product.gallery || [product.image_url],
    host: product.host || null
  })) || [];

  // Transform farmer data to match the expected interface
  const transformedFarmer = {
    ...farmer,
    // Map database fields to interface fields for compatibility
    imageUrl: farmer.image_url,
    bannerUrl: farmer.banner_url,
    farmName: farmer.farm_name
  };

  // 8. If successful, we return a single object containing all the data the page needs.
  //    The `FarmerProfilePage` can then access this object using the `useLoaderData()` hook.
  return { 
    farmer: transformedFarmer, 
    products: transformedProducts 
  };
};