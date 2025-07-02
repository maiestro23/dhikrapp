import { create } from 'zustand';
import { dhikrs as initialDhikrs } from '../config/dhikrs';
import { MorningDhikrs } from '@/config/morning_dhikrs';
import { EveningDhikrs } from '@/config/evening_dhikrs';
import { useLocalSearchParams } from 'expo-router';
import { AfterSalahDhikrs } from '@/config/afterSalah_dhikrs';
import { IstighfarDhikrs } from '@/config/istighfar_dhikrs';
import { FavoriteDhikr, useFavoritesStore } from './favoritesStore';
import { AlhamdulillahDhikrs, AllahuAkbarDhikrs, AstaghfirullahDhikrs, SubhanallahDhikrs } from '@/config/tasbih_dhikrs';
import { generateTasbihFromParams, generateTasbihSession } from '@/config/tasbihGenerator';

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
  getDhikrsByUrlCategory: () => Dhikr[] | FavoriteDhikr[];
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

    // Méthode pour récupérer uniquement les dhikrs favoris
  // getFavoriteDhikrs: () => {
  //   // Récupérer tous les dhikrs
  //   const allDhikrs = get().getAllDhikrs();
    
  //   // Récupérer les favoris depuis le store des favoris
  //   const favorites = useFavoritesStore.getState().favorites;
    
  //   // Filtrer les dhikrs qui sont dans les favoris
  //   // On utilise l'UUID du favori qui correspond à l'ID du dhikr
  //   const favoriteDhikrs = allDhikrs.filter(dhikr => 
  //     favorites.some(favorite => favorite.uuid === dhikr.id)
  //   );
    
  //   return favoriteDhikrs;
  // },

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
      
      return dhikrs;
    }
    
    switch (category) {
      //Categories
      case 'morning':
        return MorningDhikrs;
      case 'evening':
        return EveningDhikrs;
      case 'afterSalah':
        return AfterSalahDhikrs;
      case 'istighfar':
        return IstighfarDhikrs;
      case 'favourites':
        return useFavoritesStore.getState().favorites;    
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