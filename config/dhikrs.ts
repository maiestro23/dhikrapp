export interface Dhikr {
    id: string;
    pageId?: string;
    arabicText: string;
    transliteration: string;
    translation: string;
    category: string;
    count?: number;
    dhikrLength?: string;
    uuid: string;
}

export const dhikrs: Dhikr[] = [
    {
        "uuid": "cab9ded9-f7ca-4008-836b-5818663ad769",
        "id": "1",
        "category": "General",
        "transliteration": "Alhamdulillah",
        "arabicText": "ٱلْحَمْدُ ٱللّٰه",
        "translation": "All praise is due to Allah"
    },
    {
        "uuid": "14c4fded-a750-4959-92a5-71710683fe71",
        "id": "2",
        "category": "General",
        "transliteration": "Subhanallah",
        "arabicText": "سُـبْحانَ ٱللّٰه",
        "translation": "Glory be to Allah"
    },
    {
        "uuid": "6ebb787d-6a50-40a3-a0ff-9cbfe69c869c",
        "id": "3",
        "category": "General",
        "transliteration": "Allahu akbar",
        "arabicText": "‏اَللّٰهُ أَكْبَرُ‎",
        "translation": "Allah is the Greatest"
    },
    {
        "uuid": "5fb67686-0432-4fab-bf8a-079c134d9cfa",
        "id": "4",
        "category": "General",
        "transliteration": "La ilaha illa Allah",
        "arabicText": "لَا إِلٰهَ إِلَّا اللّٰه",
        "translation": "There is no God but Allah"
    },
    {
        "uuid": "6ebb787d-6a50-40a3-a0ff-9cbfe69c869c",
        "id": "5",
        "category": "General",
        "transliteration": "Astaghfirullah",
        "arabicText": "أَسْتَغْفِرُ اللّٰه",
        "translation": "I seek forgiveness from Allah"
    },
    {
        "uuid": "68828cb1-76e0-4884-a008-b21235e8a20a",
        "id": "6",
        "category": "General",
        "transliteration": "Subhanallahi wa bihamdih",
        "arabicText": "سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ",
        "translation": "Glory be to Allah and all praise is His"
    },
    {
        "uuid": "c9d3ad6a-3d76-409d-a97a-4c57a90ece6d",
        "id": "7",
        "category": "General",
        "transliteration": "Subhanallahil 'adheem",
        "arabicText": "سُبْحَانَ اللّٰهِ العَظِيم",
        "translation": "Glory be to Allah, the great"
    },
    {
        "uuid": "dd1980b1-f03d-4140-b76b-493a3d9b0ac5",
        "id": "8",
        "category": "General",
        "transliteration": "La hawla wa la quwwata illa billah",
        "arabicText": "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        "translation": "There is no might nor power except with Allah"
    },
    {
        "uuid": "9f1c41cd-1743-4ec9-865a-eec4a48ae37d",
        "id": "9",
        "category": "General",
        "transliteration": "Hasbiyallahu wa ni'mal wakeel",
        "arabicText": "حَسْبِيَ اللَّهُ وَنِعْمَ الْوَكِيلُ",
        "translation": "Allah is sufficient for me, and He is the Best Guardian"
    },
    {
        "uuid": "4b080cc6-3068-418e-bf34-52f9af19f223",
        "id": "10",
        "category": "General",
        "transliteration": "Rabbi-ghfir li",
        "arabicText": "رَبِّ اغْفِرْ لِي",
        "translation": "My Lord, forgive me"
    },
    {
        "uuid": "e8131577-7f46-41dd-afa8-756747ffb66e",
        "id": "11",
        "category": "General",
        "transliteration": "Allahumma salli 'ala Muhammad",
        "arabicText": "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ",
        "translation": "O Allah, send blessings upon Muhammad"
    },
    {
        "uuid": "0279a44c-ae02-4612-a0fe-c24f7ec445ce",
        "id": "12",
        "category": "General",
        "transliteration": "Hasbiyallahu la ilaha illa Huwa",
        "arabicText": "حَسْبِيَ اللَّهُ لَا إِلٰهَ إِلَّا هُوَ",
        "translation": "Allah is sufficient for me; there is no deity except Him"
    },
    {
        "uuid": "8419b60d-eb82-4105-8fb7-63edecdf95b9",
        "id": "13",
        "category": "General",
        "transliteration": "La ilaha illa Allah, wahdahu la sharika lah",
        "arabicText": "لَا إِلٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
        "translation": "There is no deity but Allah, alone without partner"
    },
    {
        "uuid": "0b0f1ffe-2095-45e2-9cad-0eaf5ee4f2b7",
        "id": "14",
        "category": "General",
        "transliteration": "Allahumma inni as'aluka al-'afwa wal-'afiyah",
        "arabicText": "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ",
        "translation": "O Allah, I ask You for forgiveness and well-being"
    },
    {
        "uuid": "dd22b09b-faed-4f19-b86b-da49bf8a0a71",
        "id": "15",
        "category": "General",
        "transliteration": "Allahumma anta Rabbi la ilaha illa anta",
        "arabicText": "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ",
        "translation": "O Allah, You are my Lord, there is no deity except You"
    }
]