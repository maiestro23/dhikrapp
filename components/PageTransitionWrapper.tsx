// components/PageTransitionWrapper.tsx
import React, { useEffect, useRef } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';

interface PageTransitionWrapperProps {
  children: React.ReactNode;
  duration?: number;
}

export const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({ 
  children, 
  duration = 250
}) => {
  const isFocused = useIsFocused();
  const isInitialMount = useRef(true);
  
  // Fade pur - juste l'opacity
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Pas d'animation au premier mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      opacity.value = 1;
      return;
    }

    if (isFocused) {
      // L'astuce: commence à 0.88 au lieu de 0 pour éviter le flash blanc
      opacity.value = 0.8;
      
      // Puis fade vers 1
      opacity.value = withTiming(1, {
        duration: duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Easing standard iOS
      });
    } else {
      // Reset pour la prochaine fois
      opacity.value = 1;
    }
  }, [isFocused, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[
      { 
        flex: 1, 
        backgroundColor: 'rgb(251,244,238)',
      }, 
      animatedStyle
    ]}>
      {children}
    </Animated.View>
  );
};

// Hook personnalisé pour les transitions premium
export const usePremiumTransition = (isActive: boolean) => {
  const opacity = useSharedValue(isActive ? 1 : 0);
  const translateY = useSharedValue(isActive ? 0 : 20);
  const scale = useSharedValue(isActive ? 1 : 0.98);

  useEffect(() => {
    opacity.value = withTiming(isActive ? 1 : 0, { duration: 300 });
    translateY.value = withTiming(isActive ? 0 : 20, { duration: 300 });
    scale.value = withTiming(isActive ? 1 : 0.98, { duration: 300 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
  }));

  return animatedStyle;
};

// Composant pour les éléments de navigation avec micro-interactions
export const InteractiveTabElement = ({ 
  children, 
  onPress, 
  isActive 
}: { 
  children: React.ReactNode; 
  onPress: () => void; 
  isActive: boolean; 
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      {children}
    </Animated.View>
  );
};