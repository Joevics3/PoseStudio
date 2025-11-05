import { useState, useEffect } from 'react';
import { Pose } from '@/types/types';
import { fetchPosesByCategory } from '@/lib/posesService';

export function usePoses(category: string) {
  const [poses, setPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      loadPoses();
    } else {
      setLoading(false);
      setError('Category not specified');
    }
  }, [category]);

  const loadPoses = async () => {
    if (!category) {
      setError('Category not specified');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fetchPosesByCategory(category);
      setPoses(data);
    } catch (err: any) {
      let errorMessage = 'Failed to load poses';
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.code === 'PGRST116') {
        errorMessage = 'No poses found in this category';
      } else if (err?.code === '42P01') {
        errorMessage = 'Database table not found. Please check your Supabase setup.';
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
      if (__DEV__) {
        console.error('Error loading poses:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return { poses, loading, error, refresh: loadPoses };
}

