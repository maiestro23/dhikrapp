import { create } from 'zustand';
import { dhikrs as initialDhikrs } from '../config/dhikrs';
import { MorningDhikrs } from '@/config/morning_dhikrs';
import { EveningDhikrs } from '@/config/evening_dhikrs';
import { useLocalSearchParams } from 'expo-router';
import { AfterSalahDhikrs } from '@/config/afterSalah_dhikrs';
import { IstighfarDhikrs } from '@/config/istighfar_dhikrs';

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
  getDhikrsByUrlCategory: () => Dhikr[];
  getAllDhikrs: () => Dhikr[];
  addDhikr: (dhikr: Dhikr) => void;
  removeDhikr: (id: string) => void;
  getDhikrsByCategory: (category: string) => Dhikr[];

}

export const useDhikrStore = create<DhikrState>()((set, get) => ({
  dhikrs: initialDhikrs,

  // Nouvelle méthode pour récupérer TOUS les dhikrs concatenés
  getAllDhikrs: () => {
    const allDhikrs = [
      ...initialDhikrs,
      ...MorningDhikrs,
      ...EveningDhikrs,
      ...AfterSalahDhikrs,
      ...IstighfarDhikrs
    ];

        // Optionnel : supprimer les doublons basés sur le texte de traduction
    const uniqueDhikrs = allDhikrs.filter((dhikr, index, self) => 
      index === self.findIndex(d => d.arabicText === dhikr.arabicText)
    );
    
    return uniqueDhikrs;
  },

  getDhikrsByUrlCategory: () => {
    // Get URL params inside the store
    const params = useLocalSearchParams();
    const category = params.category as string || 'General';

    switch (category) {
      case 'morning':
        return MorningDhikrs;
      case 'evening':
        return EveningDhikrs;
      case 'afterSalah':
        return AfterSalahDhikrs;
      case 'istighfar':
        return IstighfarDhikrs;
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