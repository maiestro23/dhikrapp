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

  // Nouveau background sombre
  const darkColors = [
    '#37041A',
    '#4C0524',
    '#820738'
  ];

  const colors = isDarkBackground ? darkColors : lightColors;
  const locations = isDarkBackground 
    ? [0, 0.5, 1]
    : [0.158, 0.5112, 0.8644];

  // Couleur de fallback (couleur moyenne du gradient) - CRUCIAL pour éviter le flash
  const fallbackColor = isDarkBackground ? '#4C0524' : 'rgb(251,244,238)';

  const Content = withSafeArea ? SafeAreaView : View;

  if (Platform.OS === 'web') {
    return (
      <Content style={styles.container} className="gradient-background">
        {children}
      </Content>
    );
  }

  // SOLUTION: Wrapper avec couleur de fond + gradient par-dessus
  return (
    <View style={[styles.container, { backgroundColor: fallbackColor }]}>
      <LinearGradient
        colors={colors}
        locations={locations}
        start={{ x: 0., y: 0.2 }}
        end={{ x: 1, y: 0.7 }}
        style={StyleSheet.absoluteFill}
      >
        <Content style={styles.transparentContainer}>
          {children}
        </Content>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  transparentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});