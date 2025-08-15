import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

interface ScreenBackgroundProps {
  children: React.ReactNode;
  withSafeArea?: boolean;
}

export const ScreenBackground: React.FC<ScreenBackgroundProps> = ({ 
  children, 
  withSafeArea = true 
}) => {
  const { isDarkBackground } = useTheme();

  // Background clair (existant)
  const lightColors = [
    'rgb(232,238,224)',
    'rgb(251,244,238)', 
    'rgb(251,235,232)'
  ];


  // Nouveau background sombre (basé sur votre design exact)
  const darkColors = [
    '#37041A', // Couleur du haut
    '#4C0524', // Couleur du milieu
    '#820738'  // Couleur du bas
  ];

  const colors = isDarkBackground ? darkColors : lightColors;
  const locations = isDarkBackground 
    ? [0, 0.5, 1] // Répartition pour le thème sombre
    : [0.158, 0.5112, 0.8644]; // Répartition existante

  const Content = withSafeArea ? SafeAreaView : View;

  if (Platform.OS === 'web') {
    return (
      <Content style={styles.container} className="gradient-background">
        {children}
      </Content>
    );
  }

  return (
    <LinearGradient
      colors={colors}
      locations={locations}
      start={{ x: 0., y: 0.2 }}
      end={{ x: 1, y: 0.7 }}
      style={styles.container}
    >
      <Content style={styles.container}>
        {children}
      </Content>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});