import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenBackgroundProps {
  children: React.ReactNode;
  withSafeArea?: boolean;
}

export const ScreenBackground: React.FC<ScreenBackgroundProps> = ({ 
  children, 
  withSafeArea = true 
}) => {
  const colors = [
    'rgb(240,244,234)',
    'rgb(251,248,244)', 
    'rgb(251,240,238)'
  ];

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
      locations={[0.158, 0.5112, 0.8644]}
      start={{ x: 0.8, y: 0 }}
      end={{ x: 1, y: 0.6 }}
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