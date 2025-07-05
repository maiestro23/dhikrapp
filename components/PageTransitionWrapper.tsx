// components/PageTransitionWrapper.tsx
import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';

interface PageTransitionWrapperProps {
  children: React.ReactNode;
  animationType?: 'fade' | 'slide' | 'scale';
  duration?: number;
}

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

export const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({ 
  children, 
  animationType = 'fade',
  duration = 300 
}) => {
  const isFocused = useIsFocused();
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(50);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    if (isFocused) {
      opacity.value = withTiming(1, { duration });
      translateX.value = withSpring(0, SPRING_CONFIG);
      scale.value = withSpring(1, SPRING_CONFIG);
    } else {
      opacity.value = withTiming(0, { duration: duration / 2 });
      translateX.value = withSpring(-50, SPRING_CONFIG);
      scale.value = withSpring(0.95, SPRING_CONFIG);
    }
  }, [isFocused, duration]);

  const animatedStyle = useAnimatedStyle(() => {
    switch (animationType) {
      case 'slide':
        return {
          opacity: opacity.value,
          transform: [{ translateX: translateX.value }],
        };
      case 'scale':
        return {
          opacity: opacity.value,
          transform: [{ scale: scale.value }],
        };
      case 'fade':
      default:
        return {
          opacity: opacity.value,
        };
    }
  });

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
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
    translateY.value = withSpring(isActive ? 0 : 20, SPRING_CONFIG);
    scale.value = withSpring(isActive ? 1 : 0.98, SPRING_CONFIG);
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
    scale.value = withSpring(0.95, { damping: 10, stiffness: 400 });
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_CONFIG);
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