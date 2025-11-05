import { useState, useEffect } from 'react';
import { Category } from '@/types/types';
import { fetchCategoriesWithCounts } from '@/lib/categoriesService';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCategoriesWithCounts();
      setCategories(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load categories';
      setError(errorMessage);
      if (__DEV__) {
        console.error('Error loading categories:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refresh: loadCategories };
}

