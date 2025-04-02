import { create } from 'zustand';
import { dhikrs as initialDhikrs } from '../config/dhikrs';

interface Dhikr {
  id: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  category: string;
}

interface DhikrState {
  dhikrs: Dhikr[];
  addDhikr: (dhikr: Dhikr) => void;
  removeDhikr: (id: string) => void;
  getDhikrsByCategory: (category: string) => Dhikr[];
}

export const useDhikrStore = create<DhikrState>()((set, get) => ({
  dhikrs: initialDhikrs,
  
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