// src/loaders/farmerLoader.ts
import { LoaderFunctionArgs } from 'react-router-dom';
import { farmerService } from '../services/farmerService';
import { productService } from '../services/productService';

export const farmerLoader = async ({ params }: LoaderFunctionArgs) => {
  const { farmerId } = params;

  if (!farmerId) {
    throw new Response('Farmer ID is required', { status: 400 });
  }

  try {
    // PERFORMANCE OPTIMIZATION: PARALLEL FETCHING
    const [farmer, allProducts] = await Promise.all([
      farmerService.getFarmerById(farmerId),
      productService.getAllProducts()
    ]);

    if (!farmer) {
      throw new Response('Farmer not found', { status: 404 });
    }

    // Filter products by farmer ID
    const products = allProducts.filter(p => p.farmerId === farmerId);

    return { farmer, products };
  } catch (error) {
    console.error('Farmer loader error:', error);
    throw new Response('Failed to load farmer data.', { status: 500 });
  }
};