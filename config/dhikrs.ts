export interface Dhikr {
  id: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  category: 'general' | 'morning' | 'evening';
  count?: number;
}

export const dhikrs: Dhikr[] = [
    {
        "id": "1",
        "category": "general",
        "transliteration": "Alhamdulillah",
        "arabicText": "ٱلْحَمْدُ ٱللّٰه",
        "translation": "All praise is due to Allah"
    },
    {
        "id": "2",
        "category": "general",
        "transliteration": "Subhanallah",
        "arabicText": "سُـبْحانَ ٱللّٰه",
        "translation": "Glory be to Allah"
    },
    {
        "id": "3",
        "category": "general",
        "transliteration": "Allahu akbar",
        "arabicText": "‏اَللّٰهُ أَكْبَرُ‎",
        "translation": "Allah is the Greatest"
    },
    {
        "id": "4",
        "category": "general",
        "transliteration": "La ilaha illa Allah",
        "arabicText": "لَا إِلٰهَ إِلَّا اللّٰه",
        "translation": "There is no God but Allah"
    },
    {
        "id": "5",
        "category": "general",
        "transliteration": "Astaghfirullah",
        "arabicText": "أَسْتَغْفِرُ اللّٰه",
        "translation": "I seek forgiveness from Allah"
    },
    {
        "id": "6",
        "category": "general",
        "transliteration": "Subhanallahi wa bihamdih",
        "arabicText": "سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ",
        "translation": "Glory be to Allah and all praise is His"
    },
    {
        "id": "7",
        "category": "general",
        "transliteration": "Subhanallahil 'adheem",
        "arabicText": "سُبْحَانَ اللّٰهِ العَظِيم",
        "translation": "Glory be to Allah, the great"
    },
]