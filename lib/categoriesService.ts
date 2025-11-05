import { supabase } from './supabase';
import { Category } from '@/types/types';

// Static category definitions (these don't change often)
const categoryDefinitions: Omit<Category, 'count'>[] = [
  {
    id: 'women-solo',
    name: 'Women Solo Poses',
    imageUrl: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg',
  },
  {
    id: 'men-solo',
    name: 'Men Solo Poses',
    imageUrl: 'https://images.pexels.com/photos/3785104/pexels-photo-3785104.jpeg',
  },
  {
    id: 'couples',
    name: 'Couples Poses',
    imageUrl: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
  },
  {
    id: 'kids-family',
    name: 'Kids & Family Poses',
    imageUrl: 'https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg',
  },
  {
    id: 'group-friends',
    name: 'Group & Friends Poses',
    imageUrl: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
  },
  {
    id: 'pets-dogs',
    name: 'Pets – Dogs',
    imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
  },
  {
    id: 'pets-cats',
    name: 'Pets – Cats',
    imageUrl: 'https://images.pexels.com/photos/2558605/pexels-photo-2558605.jpeg',
  },
  {
    id: 'owner-pet',
    name: 'Owner & Pet Poses',
    imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
  },
  {
    id: 'professional-portrait',
    name: 'Professional & Portrait Poses',
    imageUrl: 'https://images.pexels.com/photos/3785104/pexels-photo-3785104.jpeg',
  },
  {
    id: 'creative-themed',
    name: 'Creative & Themed Poses',
    imageUrl: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg',
  },
];

export async function fetchCategoriesWithCounts(): Promise<Category[]> {
  try {
    // Fetch counts for each category from Supabase
    const categoriesWithCounts = await Promise.all(
      categoryDefinitions.map(async (category) => {
        try {
          const { count, error } = await supabase
            .from('poses')
            .select('*', { count: 'exact', head: true })
            .eq('category', category.id);

          // If table doesn't exist, return 0 count
          if (error && (error.code === 'PGRST116' || error.code === '42P01')) {
            return {
              ...category,
              count: 0,
            };
          }

          return {
            ...category,
            count: error ? 0 : (count || 0),
          };
        } catch (err) {
          // If there's an error fetching count for a category, return 0
          if (__DEV__) {
            console.error(`Error fetching count for category ${category.id}:`, err);
          }
          return {
            ...category,
            count: 0,
          };
        }
      })
    );

    return categoriesWithCounts;
  } catch (error) {
    if (__DEV__) {
      console.error('Error fetching categories:', error);
    }
    // Return categories with 0 count on error
    return categoryDefinitions.map((cat) => ({ ...cat, count: 0 }));
  }
}

