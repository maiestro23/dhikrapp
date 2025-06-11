import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FavoriteDhikr {
  id: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  timestamp: number;
  uuid: string;
}

interface FavoritesState {
  favorites: FavoriteDhikr[];
  addFavorite: (dhikr: Omit<FavoriteDhikr, 'timestamp'>) => void;
  removeFavorite: (uuid: string) => void;
  isFavorite: (uuid: string) => boolean;
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
      
      removeFavorite: (uuid) => {
        set((state) => ({
          favorites: state.favorites.filter((d) => d.uuid !== uuid),
        }));
      },
      
      isFavorite: (uuid) => {
        return get().favorites.some((d) => d.uuid === uuid);
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);