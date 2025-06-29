import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { router } from 'expo-router';

interface SwipeBackWrapperProps {
  children: React.ReactNode;
  onSwipeBack?: () => void;
  backgroundComponent?: React.ReactNode; // Page précédente à afficher en arrière-plan
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const SwipeBackWrapper: React.FC<SwipeBackWrapperProps> = ({ 
  children, 
  onSwipeBack,
  backgroundComponent
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const borderRadius = useRef(new Animated.Value(0)).current;
  const backgroundScale = useRef(new Animated.Value(0.92)).current; // Page arrière légèrement réduite
  const backgroundOpacity = useRef(new Animated.Value(0.3)).current; // Page arrière assombrie

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { 
      useNativeDriver: false,
      listener: (event: any) => {
        const { translationX: tx } = event.nativeEvent;
        
        if (tx > 0) {
          const progress = Math.min(tx / SCREEN_WIDTH, 1);
          const smoothProgress = Math.min(progress * 1.2, 1);
          
          // Effet sur la page courante
          const scaleValue = 1 - (smoothProgress * 0.05);
          scale.setValue(scaleValue);
          
          const radiusValue = smoothProgress * 12;
          borderRadius.setValue(radiusValue);
          
          // Effet sur la page arrière (elle grandit et s'éclaircit)
          const backgroundScaleValue = 0.92 + (smoothProgress * 0.08); // De 0.92 à 1.0
          backgroundScale.setValue(backgroundScaleValue);
          
          const backgroundOpacityValue = 0.3 + (smoothProgress * 0.7); // De 0.3 à 1.0
          backgroundOpacity.setValue(backgroundOpacityValue);
        }
      }
    }
  );

  const handleStateChange = (event: any) => {
    const { translationX: tx, velocityX, state } = event.nativeEvent;
    
    if (state === State.END || state === State.CANCELLED) {
      const shouldNavigate = (tx > 80 && velocityX > 200) || (tx > SCREEN_WIDTH * 0.4);
      
      if (shouldNavigate) {
        // Animation de sortie
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: SCREEN_WIDTH,
            duration: 250,
            useNativeDriver: false,
          }),
          Animated.timing(scale, {
            toValue: 0.9,
            duration: 250,
            useNativeDriver: false,
          }),
          Animated.timing(borderRadius, {
            toValue: 20,
            duration: 250,
            useNativeDriver: false,
          }),
          Animated.timing(backgroundScale, {
            toValue: 1,
            duration: 250,
            useNativeDriver: false,
          }),
          Animated.timing(backgroundOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: false,
          })
        ]).start(() => {
          if (onSwipeBack) {
            onSwipeBack();
          } else {
            router.replace('/profile');
          }
          
          setTimeout(() => {
            translateX.setValue(0);
            scale.setValue(1);
            borderRadius.setValue(0);
            backgroundScale.setValue(0.92);
            backgroundOpacity.setValue(0.3);
          }, 50);
        });
      } else {
        // Animation de retour
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: false,
            tension: 120,
            friction: 9,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: false,
            tension: 120,
            friction: 9,
          }),
          Animated.spring(borderRadius, {
            toValue: 0,
            useNativeDriver: false,
            tension: 120,
            friction: 9,
          }),
          Animated.spring(backgroundScale, {
            toValue: 0.92,
            useNativeDriver: false,
            tension: 120,
            friction: 9,
          }),
          Animated.spring(backgroundOpacity, {
            toValue: 0.3,
            useNativeDriver: false,
            tension: 120,
            friction: 9,
          })
        ]).start();
      }
    }
  };

  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleStateChange}
      activeOffsetX={10}
      failOffsetY={[-20, 20]}
      simultaneousHandlers={[]}
      shouldCancelWhenOutside={false}
      enableTrackpadTwoFingerGesture={false}
    >
      <View style={styles.container}>
        {/* Page précédente en arrière-plan */}
        {backgroundComponent && (
          <Animated.View 
            style={[
              styles.backgroundContainer,
              {
                transform: [{ scale: backgroundScale }],
                opacity: backgroundOpacity,
              }
            ]}
          >
            {backgroundComponent}
          </Animated.View>
        )}
        
        {/* Page courante */}
        <Animated.View 
          style={[
            styles.foregroundContainer,
            {
              transform: [
                { translateX },
                { scale }
              ],
              borderRadius,
            }
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  foregroundContainer: {
    flex: 1,
    backgroundColor: '#fff',
    zIndex: 2,
    overflow: 'hidden',
  },
});