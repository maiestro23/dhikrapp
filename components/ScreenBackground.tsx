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
    'rgb(232,238,224)',
    'rgb(251,244,238)', 
    'rgb(251,235,232)'
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