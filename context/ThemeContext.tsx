import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeColors {
  background: string;
  card: string;
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
    card: '#FFFFFF',
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
      categoryColor: '#8C8F7B',
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
        textColor: '',
        selected: '',
        borderColor: '#fff',
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
    card: 'rgba(255, 255, 255, 0.15)', // Cartes semi-transparentes
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
        textColor: '',
        selected: '',
        borderColor: '#9F1F52',
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