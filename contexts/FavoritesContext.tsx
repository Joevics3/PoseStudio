import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pose } from '@/types/types';

const FAVORITES_STORAGE_KEY = '@posestudio:favorites';

interface FavoritesContextType {
  favorites: Pose[];
  loading: boolean;
  error: string | null;
  toggleFavorite: (pose: Pose) => Promise<void>;
  isFavorite: (poseId: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      
      if (stored) {
        const parsed = JSON.parse(stored) as Pose[];
        setFavorites(parsed);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load favorites';
      setError(errorMessage);
      if (__DEV__) {
        console.error('Error loading favorites:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: Pose[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (err) {
      if (__DEV__) {
        console.error('Error saving favorites:', err);
      }
      throw err;
    }
  };

  const toggleFavorite = async (pose: Pose) => {
    try {
      setError(null);
      const isCurrentlyFavorite = favorites.some((fav) => fav.id === pose.id);

      let newFavorites: Pose[];
      
      if (isCurrentlyFavorite) {
        newFavorites = favorites.filter((fav) => fav.id !== pose.id);
      } else {
        newFavorites = [{ ...pose, isFavorite: true }, ...favorites];
      }

      setFavorites(newFavorites);
      await saveFavorites(newFavorites);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update favorite';
      setError(errorMessage);
      if (__DEV__) {
        console.error('Error toggling favorite:', err);
      }
      // Revert optimistic update on error
      await loadFavorites();
      throw err;
    }
  };

  const isFavorite = (poseId: string) => {
    return favorites.some((fav) => fav.id === poseId);
  };

  const refreshFavorites = async () => {
    await loadFavorites();
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading, error, toggleFavorite, isFavorite, refreshFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
