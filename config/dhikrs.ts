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
    id: '1',
    arabicText: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    transliteration: 'Bismillahi rahmani raheem',
    translation: 'In the name of Allah, Most Gracious, Most Merciful',
    category: 'general',
  },
  {
    id: '2',
    arabicText: 'ٱلْحَمْدُ لِلهِ',
    transliteration: 'Alhamdulillah',
    translation: 'All praise is due to Allah',
    category: 'general',
  },
  {
    id: '3',
    arabicText: 'سُـبْحانَ الله',
    transliteration: 'Subhanallah',
    translation: 'Glory be to Allah',
    category: 'general',
  },
  {
    id: '4',
    arabicText: '‏اَللَّٰهُ أَكْبَرُ‎',
    transliteration: 'Allahu akbar',
    translation: 'Allah is the Greatest',
    category: 'general',
  },
  {
    id: '5',
    arabicText: 'لَا إِلٰهَ إِلَّا الله',
    transliteration: 'La ilaha illa Allah',
    translation: 'There is no God but Allah',
    category: 'general',
  },
  {
    id: '6',
    arabicText: 'أَسْتَغْفِرُ الله',
    transliteration: 'Astaghfirullah',
    translation: 'I seek forgiveness from Allah',
    category: 'general',
  },
  {
    id: '7',
    arabicText: 'سُبْحَانَ الِلهِ وَبِحَمْدِهِ',
    transliteration: 'Subhanallahi wa bihamdih',
    translation: 'Glory be to Allah and all praise is His',
    category: 'general',
  },
  {
    id: '8',
    arabicText: 'سُبْحَانَ الِلهِ العَظِيم',
    transliteration: 'Subhanallahil adheem',
    translation: 'Glory be to Allah, the Great',
    category: 'general',
  }
];