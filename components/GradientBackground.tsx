import React from 'react';
import { Platform, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const GradientBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colors = [
    'rgb(240,244,234)',
    'rgb(251,248,244)', 
    'rgb(251,240,238)'
  ];

  if (Platform.OS === 'web') {
    // On web, we use CSS for the gradient
    return <View style={{ flex: 1 }} className="gradient-background">{children}</View>;
  }

  return (
    <LinearGradient
      colors={colors}
      locations={[0.158, 0.5112, 0.8644]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  );
};