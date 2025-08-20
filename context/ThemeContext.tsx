import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeColors {
  background: string;
  card: string;
  statCard: string;
  statCardText: string;
  statCardTextSecondary: string;
  quoteCardText: string;


  profile: {
    icons: string;
    iconsPartTwo: string;
    iconsInside: string;
    toggleSwitch: string;
    arrows: string;
    menuEntries: string;
    goalAway: string;
  };

  reminders: {
    background: string;
  };

  favourites: {
    allColors: string;
    background: string;
    arabicText: string;
    transliteration: string;
    translation: string;
  }

  noFavourites: {
    titleColor: string;
    textColor: string;
  };

  goalModal: {
    titleColor: string;
    subTitleColor: string;
    quote: string;
  };

  text: {
    primary: string;
    secondary: string;
  };
  accent: string;
  border: string;
  progressBar: string;
  progressBackground: string;
  dhikrReader: {
    greetingColor: string;
    dateColor: string;
    khairisAndGoalColor: string;
    categoryColor: string;
    categoryText: string;
    pageIndicatorColor: string;
    arabicColor: string;
    transliterationColor: string;
    translationColor: string;
  };
  terms: {
    titleColor: string;
    subTitleColor: string;
    sectionTitleColor: string;
    sectionColor: string;
  };
  privacy: {
    titleColor: string;
    subTitleColor: string;
    sectionTitleColor: string;
    sectionColor: string;
  };

  discover: {
    hearderTitle: string;
    hearderSubTitle: string;
    countLabel: string;
    tabButton: {
      backgroundColor: string;
      textColor: string;
      selected: string;
      borderColor: string;
      gradientStart: string;
      gradientEnd: string;

    },
    tasbishButton: {
      backgroundColor: string;
      textColor: string;
      selected: string;
      borderColor: string;
    },

  }
}

export interface Theme {
  colors: ThemeColors;
  isDark: boolean;
}

const lightTheme: Theme = {
  colors: {
    background: '#F0F4EA', // Using the start color of the gradient
    card: '#bye',
    statCard: '#FFFBFA',
    statCardText: "#181818",
    statCardTextSecondary: "#8C8F7B",

    quoteCardText: '#7E0F3B',

    profile: {
      icons: '#E5E8D6',
      iconsPartTwo: '#E5E8D6',
      iconsInside: '#746D6D',
      toggleSwitch: '#8C8F7B',
      arrows: '#746D6D',
      menuEntries: '#5A5D4D',
      goalAway: '#5A5D4D'
    },

    reminders: {
      background: '#FEFEFD'
    },

    favourites: {
      allColors: '',
      background: "",
      arabicText: "#8C8F7B",
      transliteration: "",
      translation: "",
    },

    noFavourites: {
      titleColor: "#181818",
      textColor: "#8C8F7B",

    },

    goalModal: {
      titleColor: '#7E0F3B',
      subTitleColor: '#8C8F7B',
      quote: '#8C8F7B'
    },

    text: {
      primary: '#8C8F7B',
      secondary: '#181818',
    },
    accent: '#8E1A3B',
    border: '#EEEEEE',
    progressBar: '#8E1A3B',
    progressBackground: '#EEEEEE',
    dhikrReader: {
      greetingColor: '#5A5D4D',
      dateColor: '#5A5D4D',
      khairisAndGoalColor: '#5A5D4D',
      categoryColor: '#FEFCFC',
      categoryText: "#8C8F7B",
      pageIndicatorColor: '#8C8F7B',
      arabicColor: '#5A5D4D',
      transliterationColor: '#181818',
      translationColor: '#5A5D4D',
    },
    terms: {
      titleColor: "#fff",
      subTitleColor: "#fff",
      sectionTitleColor: "#fff",
      sectionColor: "#fff",
    },
    privacy: {
      titleColor: "#fff",
      subTitleColor: "#fff",
      sectionTitleColor: "#fff",
      sectionColor: "#fff",
    },

    discover: {
      hearderTitle: '#181818',
      hearderSubTitle: '#5A5D4D',

      countLabel: '#5A5D4D',
      tabButton: {
        backgroundColor: '#7E0F3B',
        textColor: '#7E0F3B',
        selected: '',
        borderColor: '#fff',
        gradientStart: "#F5F4E4",
        gradientEnd: "#FFD7DF",

      },

      tasbishButton: {
        backgroundColor: '#5A5D4D',
        textColor: '#8C8F7B',
        selected: '#8C8F7B',
        borderColor: '#9F1F52',
      },
    }

  },
  isDark: false,
};

const darkBackgroundTheme: Theme = {
  colors: {
    background: 'rgba(255, 255, 255, 0.1)', // Background transparent pour les cartes
    card: '#bye', // Cartes semi-transparentes
    statCard: '#F8E2DF',

    statCardText: "#3C041A",
    statCardTextSecondary: "#181818",

    quoteCardText: "#7F0A34",

    profile: {
      icons: '#3A0518',
      iconsPartTwo: '#3A0518',
      iconsInside: '#E5C7D3',
      toggleSwitch: '#3C041A',
      arrows: '#fff',
      menuEntries: '#fff',
      goalAway: '#FFFFFF'
    },

    reminders: {
      background: '#93174848'
    },

    favourites: {
      allColors: "#fff",
      background: "#fff",
      arabicText: "#fff",
      transliteration: "#fff",
      translation: "#fff",
    },

    noFavourites: {
      titleColor: "#fff",
      textColor: "#fff",
    },

    goalModal: {
      titleColor: '#7E0F3B',
      subTitleColor: '#7E0F3B',
      quote: '#7E0F3B'
    },

    text: {
      primary: '#FFFFFF', // Texte principal en blanc
      secondary: '#F5F5F5', // Texte secondaire en blanc cassÃ©
    },
    accent: '#FFB6C1', // Rose clair pour l'accent
    border: 'rgba(255, 255, 255, 0.2)', // Bordures transparentes
    progressBar: '#8E1A3B', // Barre de progression rose
    progressBackground: 'rgba(255, 255, 255, 0.3)', // Background de la progress bar
    dhikrReader: {
      greetingColor: '#FFF',
      dateColor: '#FFF',
      khairisAndGoalColor: '#FFF',
      categoryColor: '#7E0F3B',
      categoryText: "#FFF",
      pageIndicatorColor: '#FFF',
      arabicColor: '#FFF',
      transliterationColor: '#FFF',
      translationColor: '#FFF',
    },
    terms: {
      titleColor: "#fff",
      subTitleColor: "#fff",
      sectionTitleColor: "#fff",
      sectionColor: "#fff",
    },
    privacy: {
      titleColor: "#fff",
      subTitleColor: "#fff",
      sectionTitleColor: "#fff",
      sectionColor: "#fff",
    },

    discover: {
      countLabel: '#FFFFFF',
      hearderTitle: '#F5F5F5',
      hearderSubTitle: '#FFFFFF',
      tabButton: {
        backgroundColor: '#7E0F3B',
        textColor: '#7E0F3B',
        selected: '',
        borderColor: '#F9E9E6',
        gradientStart: "#ECEAC4",
        gradientEnd: "#E0A1AE",

      },
      tasbishButton: {
        backgroundColor: '#340317',
        textColor: '',
        selected: '',
        borderColor: '#E0E0E0',
      },
    }

  },
  isDark: true,
};

interface ThemeContextType {
  theme: Theme;
  toggleDarkMode: () => void;
  isDarkBackground: boolean;
  toggleBackgroundTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDarkMode] = useState(colorScheme === 'dark');
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger la préférence sauvegardée au démarrage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDarkBackground(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.log('Error loading theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  useEffect(() => {
    //setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const toggleDarkMode = () => {
    //setIsDarkMode(prev => !prev);
  };

  const toggleBackgroundTheme = async () => {
    const newTheme = !isDarkBackground;
    setIsDarkBackground(newTheme);

    // Sauvegarder la nouvelle préférence
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme));
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const value = {
    theme: isDarkBackground ? darkBackgroundTheme : lightTheme,
    toggleDarkMode,
    isDarkBackground,
    toggleBackgroundTheme,
    isLoading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};