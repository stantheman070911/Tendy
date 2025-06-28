import { useState, useEffect } from 'react';
import { placeholderDataService, type PlaceholderProduct, type PlaceholderUser } from '../services/placeholderDataService';

// Hook to load all products
export const usePlaceholderProducts = () => {
  const [products, setProducts] = useState<PlaceholderProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await placeholderDataService.getProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { products, loading, error };
};

// Hook to load products with farmer information
export const usePlaceholderProductsWithFarmers = () => {
  const [products, setProducts] = useState<Array<PlaceholderProduct & { farmer: PlaceholderUser }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await placeholderDataService.getProductsWithFarmers();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { products, loading, error };
};

// Hook to load products by farmer ID
export const usePlaceholderProductsByFarmer = (farmerId: string) => {
  const [products, setProducts] = useState<PlaceholderProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await placeholderDataService.getProductsByFarmerId(farmerId);
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    if (farmerId) {
      loadProducts();
    }
  }, [farmerId]);

  return { products, loading, error };
};

// Hook to load all users
export const usePlaceholderUsers = () => {
  const [users, setUsers] = useState<PlaceholderUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await placeholderDataService.getUsers();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return { users, loading, error };
};

// Hook to load farmers only
export const usePlaceholderFarmers = () => {
  const [farmers, setFarmers] = useState<PlaceholderUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFarmers = async () => {
      try {
        setLoading(true);
        const data = await placeholderDataService.getFarmers();
        setFarmers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load farmers');
      } finally {
        setLoading(false);
      }
    };

    loadFarmers();
  }, []);

  return { farmers, loading, error };
};

// Hook to load hosts only
export const usePlaceholderHosts = () => {
  const [hosts, setHosts] = useState<PlaceholderUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHosts = async () => {
      try {
        setLoading(true);
        const data = await placeholderDataService.getHosts();
        setHosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load hosts');
      } finally {
        setLoading(false);
      }
    };

    loadHosts();
  }, []);

  return { hosts, loading, error };
};