i have an app written in expo react native, I want to update my Dhikr reader component.
I need to add ONE functionality:


1. Page Indicator

Added getPageInfo() function that calculates page numbers for dhikrs with the same pageId
The page indicator (e.g., "2/5") appears below the favorite button, the values used are pageId/dhikrLength
Only shows when dhikrLenght is > 1
Uses tabular numbers for consistent spacing

Also hereunder you have the Dhikr Interface :
export interface Dhikr {
    id: string;
    pageId?: string;
    arabicText: string;
    transliteration: string;
    translation: string;
    category: 'general' | 'After Salah' | 'Evening Adhkar' | 'Morning Adhkar';
    count?: number;
    dhikrLength?: string;
}
Also add the design picture of what I want for the tag functionnality.
I ONLY NEED THE TAG FUNCTIONNALITY NOTHING MORE THAN THAT



J'ai ecrit une app avec expo et react native.
J'ai un soucis en ce qui concerne une fonctionnalitée.
J'ai deux composants, un qui sert a afficher et faire swiper des dhikrs, et le second qui sert a selectionner une catégorie de dhikrs.
Les dhikrs se trouvent dans des fichiers de configurations.
Lorsqu'un utilisateur clique sur une catégorie, il est redirigé vers la page où sont affichés les dhikrs et en fonction de la catégorie les nouvelles dhikrs sont chargées.
Je te fournis mes deux composants, indexedDB.ts (DhikrScreen) et discover.ts (le page pour selectionner la catégorie)
Le soucis est que lorsque l'utilisateur est redirigé sur la page des dhikrs, le premier element n'est pas le premier de la liste mais le dernier ce qui fait que je dois swiper une fois pour commencer.
Peux tu analyser le code et me dire d'ou le probleme vient...



J'ai ecrit une app avec expo et react native.
J'ai un soucis avec le design.
J'ai deux bouttons (General et Favourites), j'aimerais avoir le exact meme design que celui que je fournis dans le fichier (Discover - Main screen).
UNIQUEMENT CES DEUX BOUTTONS, RIEN DE PLUS
Aussi voici le code couleur pour le background de ces bouttons : #7E0F3B
Je te fournis aussi mon composant de maniere a ce que tu puisses me dire ce qu'il faut changer.


J'ai deux composants, un qui sert a afficher et faire swiper des dhikrs, et le second qui sert a selectionner une catégorie de dhikrs.



Les dhikrs se trouvent dans des fichiers de configurations.
Lorsqu'un utilisateur clique sur une catégorie, il est redirigé vers la page où sont affichés les dhikrs et en fonction de la catégorie les nouvelles dhikrs sont chargées.
Je te fournis mes deux composants, indexedDB.ts (DhikrScreen) et discover.ts (le page pour selectionner la catégorie)
Le soucis est que lorsque l'utilisateur est redirigé sur la page des dhikrs, le premier element n'est pas le premier de la liste mais le dernier ce qui fait que je dois swiper une fois pour commencer.
Peux tu analyser le code et me dire d'ou le probleme vient




J'ai ecrit une app avec expo et react native.
J'ai un soucis avec mon DhikrStore.
J'aimerais creer une methode qui puisse me retourner un mega objet qui serait la concatenation de tous mes objets dhikrs (morning, evening, genral,..) 
Je te fournis aussi mon composant de maniere a ce que tu puisses me dire ce qu'il faut changer.


j'ai une app en ract native expo, 

j'ai fini le developpement mais mainteant j'aimerais rendre certaines fonctionnalités payantes sur iphone. j'aimerais ajouter un system d'abonnement, si les utilisateurs sont abonnés alors ils pourront avoir access a certaines fonctionnalotés,

J'ai deja un compte AppleConnect et j'ai une license IOS

Peux tu me decrire les differentes etapes a suivre 




A serene beach scene at sunset. The sky is painted with soft hues of orange and blue, transitioning smoothly from the horizon upwards. The sun is low in the sky, casting a warm glow. Silhouettes of two birds are flying in the upper left part of the image. The beach is bordered by calm, gently rolling waves. In the foreground, there are a few tropical plants with broad leaves, adding a touch of green to the scene. The overall mood is peaceful and tranquil.