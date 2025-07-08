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