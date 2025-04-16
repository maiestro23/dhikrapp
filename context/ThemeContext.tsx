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

const darkTheme: Theme = {
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

interface ThemeContextType {
  theme: Theme;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDarkMode] = useState(colorScheme === 'dark');

  useEffect(() => {
    //setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  const toggleDarkMode = () => {
    //setIsDarkMode(prev => !prev);
  };

  const value = {
    theme: isDarkMode ? lightTheme : lightTheme,
    toggleDarkMode,
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