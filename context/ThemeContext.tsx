import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

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
      menuEntries: '#746D6D'
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

    text: {
      primary: '#8C8F7B',
      secondary: '#181818',
    },
    accent: '#8E1A3B',
    border: '#EEEEEE',
    progressBar: '#8E1A3B',
    progressBackground: '#EEEEEE',
    dhikrReader: {
      greetingColor: '#8C8F7B',
      dateColor: '#6F7C50',
      khairisAndGoalColor: '#6F7C50',
      categoryColor: '#FEFCFC',
      categoryText: "#8C8F7B",
      pageIndicatorColor: '#8C8F7B',
      arabicColor: '#8C8F7B',
      transliterationColor: '#181818',
      translationColor: '#8C8F7B',
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
      tabButton: {
        backgroundColor: '#7E0F3B',
        textColor: '#7E0F3B',
        selected: '',
        borderColor: '#fff',
        gradientStart: "#F5F4E4",
        gradientEnd: "#FFD7DF",
      },

      tasbishButton: {
        backgroundColor: '#FEFEFD',
        textColor: '#8C8F7B',
        selected: '',
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
      menuEntries: '#fff'
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

    text: {
      primary: '#FFFFFF', // Texte principal en blanc
      secondary: '#F5F5F5', // Texte secondaire en blanc cassé
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
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDarkMode] = useState(colorScheme === 'dark');
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  useEffect(() => {
    //setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const toggleDarkMode = () => {
    //setIsDarkMode(prev => !prev);
  };

  const toggleBackgroundTheme = () => {
    setIsDarkBackground(prev => !prev);
  };

  const value = {
    theme: isDarkBackground ? darkBackgroundTheme : lightTheme,
    toggleDarkMode,
    isDarkBackground,
    toggleBackgroundTheme,
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