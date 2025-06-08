import { create } from 'zustand';
import { dhikrs as initialDhikrs } from '../config/dhikrs';
import { MorningDhikrs } from '@/config/morning_dhikrs';
import { useLocalSearchParams } from 'expo-router';

interface Dhikr {
  id: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  category: string;
  pageId?: string | number;
}

interface DhikrState {
  dhikrs: Dhikr[];
  getDhikrsByUrlCategory: () => void;
  addDhikr: (dhikr: Dhikr) => void;
  removeDhikr: (id: string) => void;
  getDhikrsByCategory: (category: string) => Dhikr[];

}

export const useDhikrStore = create<DhikrState>()((set, get) => ({
  dhikrs: initialDhikrs,
  

  getDhikrsByUrlCategory: () => {
    // Get URL params inside the store
    const params = useLocalSearchParams();
    const category = params.category as string || 'general';
    
    switch (category) {
      case 'morning':
        return MorningDhikrs;
      case 'general':
      default:
        return initialDhikrs;
    }
  },

  addDhikr: (dhikr) =>
    set((state) => ({
      dhikrs: [...state.dhikrs, dhikr],
    })),
    
  removeDhikr: (id) =>
    set((state) => ({
      dhikrs: state.dhikrs.filter((d) => d.id !== id),
    })),
    
  getDhikrsByCategory: (category) => {
    return get().dhikrs.filter((d) => d.category === category);
  },
}));