// src/loaders/productLoader.ts
import { LoaderFunctionArgs } from 'react-router-dom';
import { productService } from '../services/productService';

export const productLoader = async ({ params }: LoaderFunctionArgs) => {
  const { productId } = params;
  
  if (!productId) {
    throw new Response('Product ID is required', { status: 400 });
  }

  try {
    // Get all products and find the specific one
    const allProducts = await productService.getAllProducts();
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) {
      throw new Response('Product not found', { status: 404 });
    }

    return { product };
  } catch (error) {
    console.error('Product loader error:', error);
    throw new Response('Failed to load product data.', { status: 500 });
  }
};