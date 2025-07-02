// tasbihGenerator.ts - Version avec cache

import { Dhikr } from "./dhikrs"
import {
    SubhanallahDhikrs,
    AlhamdulillahDhikrs,
    AllahuAkbarDhikrs,
    AstaghfirullahDhikrs
} from "./tasbih_dhikrs"

export type TasbihType = 'subhanallah' | 'alhamdulillah' | 'allahuakbar' | 'astaghfirullah';

// 🔥 SOLUTION : Cache pour éviter les re-générations
const tasbihCache = new Map<string, Dhikr[]>();

export const generateTasbihSession = (tasbihType: TasbihType, count: number = 33): Dhikr[] => {
    // Créer une clé unique pour ce type et count
    const cacheKey = `${tasbihType}-${count}`;
    
    // Vérifier si on a déjà généré cette combinaison
    if (tasbihCache.has(cacheKey)) {
        console.log(`Cache hit for ${cacheKey}`);
        return tasbihCache.get(cacheKey)!;
    }

    console.log(`Generating new tasbih session: ${cacheKey}`);

    let baseDhikr: Dhikr;

    switch (tasbihType) {
        case 'subhanallah':
            baseDhikr = SubhanallahDhikrs[0];
            break;
        case 'alhamdulillah':
            baseDhikr = AlhamdulillahDhikrs[0];
            break;
        case 'allahuakbar':
            baseDhikr = AllahuAkbarDhikrs[0];
            break;
        case 'astaghfirullah':
            baseDhikr = AstaghfirullahDhikrs[0];
            break;
        default:
            throw new Error(`Type de Tasbih non reconnu: ${tasbihType}`);
    }

    const validCount = Math.max(1, Math.min(count, 10000));

    const result = Array.from({ length: validCount }, (_, index) => ({
        ...baseDhikr,
        uuid: `${baseDhikr.uuid}-${index + 1}`,
        id: (index + 1).toString()
    }));

    // Mettre en cache le résultat
    tasbihCache.set(cacheKey, result);
    
    return result;
};

export const generateTasbihFromParams = (tasbihType: string, countParam: string): Dhikr[] => {
    const type = getTasbihTypeFromId(tasbihType);
    if (!type) {
        console.warn(`Type de tasbih non reconnu: ${tasbihType}`);
        return [];
    }

    const count = parseInt(countParam, 10);
    if (isNaN(count) || count <= 0) {
        console.warn(`Count invalide: ${countParam}, utilisation de 33 par défaut`);
        return generateTasbihSession(type, 33);
    }

    return generateTasbihSession(type, count);
};

export const getTasbihTypeFromId = (id: string): TasbihType | null => {
    switch (id) {
        case 'subhanallah':
            return 'subhanallah';
        case 'alhamdulillah':
            return 'alhamdulillah';
        case 'allahuakbar':
            return 'allahuakbar';
        case 'astaghfirullah':
            return 'astaghfirullah';
        default:
            return null;
    }
};

// Fonction pour vider le cache si nécessaire
export const clearTasbihCache = () => {
    tasbihCache.clear();
};

// Fonction pour obtenir la taille du cache (debugging)
export const getTasbihCacheSize = () => {
    return tasbihCache.size;
};