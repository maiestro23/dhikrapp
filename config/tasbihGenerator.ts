import { Dhikr } from "./dhikrs"
import {
    SubhanallahDhikrs,
    AlhamdulillahDhikrs,
    AllahuAkbarDhikrs,
    AstaghfirullahDhikrs
} from "./tasbih_dhikrs" // Remplacez par le bon chemin

// Type pour les différents types de Tasbih
export type TasbihType = 'subhanallah' | 'alhamdulillah' | 'allahuakbar' | 'astaghfirullah';

// Fonction qui génère 33 fois le même dhikr
export const generateTasbihSession = (tasbihType: TasbihType): Dhikr[] => {
    let baseDhikr: Dhikr;

    // Sélectionner le dhikr de base selon le type
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

    // Générer un tableau de 33 éléments avec le même dhikr
    return Array.from({ length: 33 }, (_, index) => ({
        ...baseDhikr,
        uuid: `${baseDhikr.uuid}-${index + 1}`, // UUID unique pour chaque répétition
        id: (index + 1).toString() // ID séquentiel de 1 à 33
    }));
};

// Fonction utilitaire pour obtenir le type de Tasbih à partir d'un ID
export const getTasbihTypeFromId = (id: string): TasbihType | null => {
    switch (id) {
        case 'subhanallah':
            return 'subhanallah';
        case 'alhamdulillah':
            return 'alhamdulillah';
        case 'allahu-akbar':
            return 'allahuakbar';
        case 'astaghfirullah':
            return 'astaghfirullah';
        default:
            return null;
    }
};

// Exemple d'utilisation :
/*
// Générer une session de 33 Subhanallah
const subhanallahSession = generateTasbihSession('subhanallah');
console.log(subhanallahSession.length); // 33

// Générer une session de 33 Alhamdulillah
const alhamdulillahSession = generateTasbihSession('alhamdulillah');
console.log(alhamdulillahSession[0].transliteration); // "Alhamdulillah"
console.log(alhamdulillahSession[32].id); // "33"

// Utilisation avec les paramètres de navigation
const tasbihType = getTasbihTypeFromId('subhanallah');
if (tasbihType) {
  const session = generateTasbihSession(tasbihType);
  // Utiliser la session...
}
*/