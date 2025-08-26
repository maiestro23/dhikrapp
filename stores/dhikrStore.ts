import { create } from 'zustand';
import { GeneralTransition, dhikrs as initialDhikrs } from '../config/dhikrs';
import { MorningDhikrs } from '@/config/morning_dhikrs';
import { EveningDhikrs } from '@/config/evening_dhikrs';
import { useLocalSearchParams } from 'expo-router';
import { AfterSalahDhikrs } from '@/config/afterSalah_dhikrs';
import { IstighfarDhikrs, IstighfarTransition } from '@/config/istighfar_dhikrs';
import { FavoriteDhikr, useFavoritesStore } from './favoritesStore';
import { AlhamdulillahDhikrs, AllahuAkbarDhikrs, AstaghfirullahDhikrs, SubhanallahDhikrs } from '@/config/tasbih_dhikrs';
import { generateTasbihFromParams, generateTasbihSession } from '@/config/tasbihGenerator';
import { SalawatDhikrs, salawatTransition } from '@/config/salawat_dhikrs';
import { UponDhikrs, uponWakingTransition } from '@/config/upon_dhikrs';
import { SurahsDhikrs, surahsTransition } from '@/config/surahs_dhikrs';
import { RizqDhikrs, rizqTransition } from '@/config/rizq_dhikrs';
import { TravelDhikrs, travelTransition } from '@/config/travel_dhikrs';
import { BeforeSleepingDhikrs, beforeSleepTransition } from '@/config/before_dhikrs';
import { EvilEyeDhikrs, evilEyeTransition } from '@/config/evilEye_dhikrs';
import { AnxietyDhikrs, anxietyReliefTransition } from '@/config/anxiety_dhikrs';

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
  shuffledGeneralDhikrs: Dhikr[] | null; // Cache pour les dhikrs General mélangés
  lastShuffleTimestamp: number; // Pour forcer un nouveau mélange si nécessaire
  getDhikrsByUrlCategory: () => Dhikr[] | FavoriteDhikr[];
  getAllDhikrs: () => Dhikr[];
  addDhikr: (dhikr: Dhikr) => void;
  removeDhikr: (id: string) => void;
  getDhikrsByCategory: (category: string) => any;
  shuffleGeneralDhikrs: () => void; // Méthode pour forcer un nouveau mélange
}

// Fonction pour mélanger un tableau (algorithme Fisher-Yates)
const shuffleArray = <T>(array: T[]): T[] => {
  // Créer une copie pour éviter de modifier le tableau original
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

export const useDhikrStore = create<DhikrState>()((set, get) => ({
  dhikrs: initialDhikrs,
  shuffledGeneralDhikrs: null,
  lastShuffleTimestamp: 0,

  // Méthode pour forcer un nouveau mélange des dhikrs General
  shuffleGeneralDhikrs: () => {
    console.log('Shuffling General dhikrs - creating new shuffle');
    set({
      shuffledGeneralDhikrs: shuffleArray(initialDhikrs),
      lastShuffleTimestamp: Date.now()
    });
  },

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
    const count = params.count as string;
    const tasbihType = params.tasbihType as string;

    // Si c'est un type de tasbih avec un count spécifique
    if (tasbihType && count) {
      console.log('Generating tasbih session:', { tasbihType, count });

      // Utiliser la nouvelle fonction pour éviter les boucles infinies
      const dhikrs = generateTasbihFromParams(tasbihType, count);

      if (dhikrs.length === 0) {
        console.warn('Aucun dhikr généré, retour aux dhikrs par défaut');
        // Retourner une valeur par défaut ou une liste vide
        return [];
      }

      return {
        dhikrs: dhikrs,
        transition: ''
      };
    }

    switch (category) {
      //Categories
      case 'anxiety':
        return {
          dhikrs: AnxietyDhikrs,
          transition: anxietyReliefTransition
        };

      case 'evilEye':
        return {
          dhikrs: EvilEyeDhikrs,
          transition: evilEyeTransition
        };

      case 'before':
        return {
          dhikrs: BeforeSleepingDhikrs,
          transition: beforeSleepTransition
        };

      case 'travel':
        return {
          dhikrs: TravelDhikrs,
          transition: travelTransition
        };

      case 'rizq':
        return {
          dhikrs: RizqDhikrs,
          transition: rizqTransition
        };

      case 'surahs':
        return {
          dhikrs: SurahsDhikrs,
          transition: surahsTransition
        };

      case 'upon':
        return {
          dhikrs: UponDhikrs,
          transition: uponWakingTransition
        };

      case 'salawat':
        return {
          dhikrs: SalawatDhikrs,
          transition: salawatTransition
        };

      // OLD CATEGORIES
      case 'morning':
        return {
          dhikrs: MorningDhikrs,
          transition: IstighfarTransition
        };

      case 'evening':
        return {
          dhikrs: EveningDhikrs,
          transition: IstighfarTransition
        };

      case 'afterSalah':
        return {
          dhikrs: AfterSalahDhikrs,
          transition: IstighfarTransition
        };

      case 'istighfar':
        return {
          dhikrs: IstighfarDhikrs,
          transition: IstighfarTransition
        };

      case 'favourites':
        return {
          dhikrs: useFavoritesStore.getState().favorites,
          transition: ''
        };

      default:
        // Pour la catégorie General, utiliser le cache ou créer un nouveau mélange
        const state = get();
        
        // Si pas de cache, créer le mélange initial
        if (!state.shuffledGeneralDhikrs) {
          console.log('No cached shuffled dhikrs, creating initial shuffle');
          const shuffled = shuffleArray(initialDhikrs);
          set({ 
            shuffledGeneralDhikrs: shuffled,
            lastShuffleTimestamp: Date.now()
          });
          return {
            dhikrs: shuffled,
            transition: GeneralTransition
          };
        }
        
        // Utiliser le cache existant
        console.log('Using cached shuffled dhikrs');
        return {
          dhikrs: state.shuffledGeneralDhikrs,
          transition: GeneralTransition
        };
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