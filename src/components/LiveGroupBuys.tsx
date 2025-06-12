import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { ProductCard } from './ProductCard';
import { supabase } from '../lib/supabaseClient';
import { ProductSchema, type Product } from '../types';

export const LiveGroupBuys: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // FIX: The query now explicitly selects all columns from `products` (`*`)
        // and joins the related data from `farmers`. This ensures `host_id`
        // and any other fields are correctly fetched.
        const { data, error: dbError } = await supabase
          .from('products')
          .select(`
            *,
            farmers (
              name,
              image_url
            )
          `)
          .limit(4);

        if (dbError) {
          throw dbError;
        }

        // The Zod schema now safely parses the data from the corrected query.
        const parsedProducts = z.array(ProductSchema).parse(data);
        setProducts(parsedProducts);
      } catch (e) {
        console.error('Data parsing error:', e);
        if (e instanceof z.ZodError) {
          setError(`There was an issue loading the products. (Validation failed)`);
        } else if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-12 md:py-24 bg-parchment">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-evergreen mb-12 font-lora">
          Live Group Buys
        </h2>
        {loading && (
          <div className="text-center text-stone">Loading fresh deals...</div>
        )}
        {error && (
          <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
