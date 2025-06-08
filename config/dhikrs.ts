export interface Dhikr {
    id: string;
    pageId?: string;
    arabicText: string;
    transliteration: string;
    translation: string;
    category: 'general' | 'morning' | 'evening' | 'Morning Adhkar';
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
    {
        "id": "8",
        "category": "general",
        "transliteration": "La hawla wa la quwwata illa billah",
        "arabicText": "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        "translation": "There is no might nor power except with Allah"
    },
    {
        "id": "9",
        "category": "general",
        "transliteration": "Hasbiyallahu wa ni'mal wakeel",
        "arabicText": "حَسْبِيَ اللَّهُ وَنِعْمَ الْوَكِيلُ",
        "translation": "Allah is sufficient for me, and He is the Best Guardian"
    },
    {
        "id": "10",
        "category": "general",
        "transliteration": "Rabbi-ghfir li",
        "arabicText": "رَبِّ اغْفِرْ لِي",
        "translation": "My Lord, forgive me"
    },
    {
        "id": "11",
        "category": "general",
        "transliteration": "Allahumma salli 'ala Muhammad",
        "arabicText": "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
        "translation": "O Allah, send blessings upon Muhammad"
    },
    {
        "id": "12",
        "category": "general",
        "transliteration": "Hasbiyallahu la ilaha illa Huwa",
        "arabicText": "حَسْبِيَ اللَّهُ لَا إِلٰهَ إِلَّا هُوَ",
        "translation": "Allah is sufficient for me; there is no deity except Him"
    },
    {
        "id": "13",
        "category": "general",
        "transliteration": "La ilaha illa Allah, wahdahu la sharika lah",
        "arabicText": "لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
        "translation": "There is no deity but Allah, alone without partner"
    },
    {
        "id": "14",
        "category": "general",
        "transliteration": "Allahumma inni as'aluka al-'afwa wal-'afiyah",
        "arabicText": "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ",
        "translation": "O Allah, I ask You for forgiveness and well-being"
    },
    {
        "id": "15",
        "category": "general",
        "transliteration": "Allahumma anta Rabbi la ilaha illa anta",
        "arabicText": "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ",
        "translation": "O Allah, You are my Lord, there is no deity except You"
    }
]