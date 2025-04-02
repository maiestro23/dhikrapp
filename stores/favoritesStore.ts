import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FavoriteDhikr {
  id: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  timestamp: number;
}

interface FavoritesState {
  favorites: FavoriteDhikr[];
  addFavorite: (dhikr: Omit<FavoriteDhikr, 'timestamp'>) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (dhikr) => {
        set((state) => ({
          favorites: [
            ...state.favorites,
            { ...dhikr, timestamp: Date.now() },
          ],
        }));
      },
      
      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((d) => d.id !== id),
        }));
      },
      
      isFavorite: (id) => {
        return get().favorites.some((d) => d.id === id);
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);