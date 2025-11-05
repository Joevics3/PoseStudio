import { supabase } from './supabase';
import { Pose } from '@/types/types';

export async function fetchPosesByCategory(category: string): Promise<Pose[]> {
  if (!category) {
    throw new Error('Category is required');
  }

  try {
    const { data, error } = await supabase
      .from('poses')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      if (__DEV__) {
        console.error('Supabase error:', error);
      }
      // If table doesn't exist, return empty array instead of throwing
      if (error.code === 'PGRST116' || error.code === '42P01' || error.code === 'PGRST205') {
        if (__DEV__) {
          console.warn('Poses table not found. Please run the migration to create the table.');
        }
        return [];
      }
      throw new Error(error.message || 'Failed to fetch poses');
    }

    return (data || []).map((pose) => ({
      id: pose.id,
      title: pose.title,
      description: pose.description,
      imageUrl: pose.imageUrl,
      category: pose.category,
      isFavorite: false, // This will be managed locally
    }));
  } catch (error: any) {
    if (__DEV__) {
      console.error('Error fetching poses:', error);
    }
    // If it's already an Error object, re-throw it
    if (error instanceof Error) {
      throw error;
    }
    // Otherwise, wrap it in an Error
    throw new Error(error?.message || 'Failed to fetch poses from database');
  }
}

export async function fetchPoseById(id: string, category: string): Promise<Pose | null> {
  if (!id || !category) {
    throw new Error('Pose ID and category are required');
  }

  try {
    const { data, error } = await supabase
      .from('poses')
      .select('*')
      .eq('id', id)
      .eq('category', category)
      .maybeSingle();

    if (error) {
      if (__DEV__) {
        console.error('Supabase error fetching pose:', error);
      }
      // If table doesn't exist, return null instead of throwing
      if (error.code === 'PGRST116' || error.code === '42P01' || error.code === 'PGRST205') {
        if (__DEV__) {
          console.warn('Poses table not found. Please run the migration to create the table.');
        }
        return null;
      }
      throw new Error(error.message || 'Failed to fetch pose');
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      category: data.category,
      isFavorite: false, // This will be managed locally
    };
  } catch (error: any) {
    if (__DEV__) {
      console.error('Error fetching pose:', error);
    }
    // If it's already an Error object, re-throw it
    if (error instanceof Error) {
      throw error;
    }
    // Handle network errors
    if (error?.message?.includes('Failed to fetch') || error?.message?.includes('ERR_CONNECTION')) {
      throw new Error('Network error: Could not connect to the server. Please check your internet connection.');
    }
    // Otherwise, wrap it in an Error
    throw new Error(error?.message || 'Failed to fetch pose from database');
  }
}

