import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Theme } from '../context/ThemeContext';
import { useProgress } from '../hooks/useProgress';
import { useTimeTracking } from '../hooks/useTimeTracking';
import { Heart } from 'lucide-react-native';
import { useFavoritesStore } from '../stores/favoritesStore';
import { useDhikrStore } from '../stores/dhikrStore';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  runOnJS,
  interpolate,
  Extrapolate,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

const TRANSITION_DISTANCE = height * 0.4;

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 280,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

const TIMING_CONFIG = {
  duration: 300,
  easing: Easing.bezier(0.33, 1, 0.68, 1),
};

const DhikrContent = ({
  dhikr,
  isFavorite,
  onToggleFavorite,
  theme,
  style,
  pointerEvents = 'auto',
}: any) => (
  <Animated.View style={[styles.dhikrCard, style]} pointerEvents={pointerEvents}>
    <View style={styles.textWrapper}>
      <Text style={styles.arabicText} adjustsFontSizeToFit numberOfLines={3}>
        {dhikr.arabicText}
      </Text>

      <Text style={styles.transliteration} adjustsFontSizeToFit numberOfLines={3}>
        {dhikr.transliteration}
      </Text>

      <Text style={styles.translation} >
        {dhikr.translation}
      </Text>

      <TouchableOpacity
        style={[
          styles.favoriteButton,
          isFavorite && styles.favoriteButtonActive
        ]}
        onPress={() => {
          onToggleFavorite(dhikr, isFavorite)
        }
        }
      >
        <Heart
          size={24}
          color={theme.colors.accent}
          fill={!isFavorite ? 'transparent' : theme.colors.accent}
        />
      </TouchableOpacity>
    </View>
  </Animated.View>
);

export function DhikrReader({
  onNext,
  onPrevious,
  currentIndex,
  dailyGoal,
  theme,
}: any) {


  const { start, stop } = useTimeTracking();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { dhikrs } = useDhikrStore();

  //const currentIndex = useState();
  const [isTransitioning, setIsTransitioning] = useState();
  //const isFocused = useIsFocused();

  const currentDhikr = dhikrs[currentIndex % dhikrs.length];
  const nextDhikr = dhikrs[(currentIndex + 1) % dhikrs.length];
  const prevDhikr = dhikrs[(currentIndex - 1 + dhikrs.length) % dhikrs.length];


  const isCurrentFavorite = currentDhikr ? isFavorite(currentDhikr.id) : false;
  const isNextFavorite = nextDhikr ? isFavorite(nextDhikr.id) : false;
  const isPrevFavorite = prevDhikr ? isFavorite(prevDhikr.id) : false;


  const { incrementCount, goalProgress } = useProgress();
  const progressPercentage = goalProgress

  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const nextOffset = useSharedValue(height);
  const prevOffset = useSharedValue(-height);
  const currentOpacity = useSharedValue(1);
  const nextOpacity = useSharedValue(0);
  const prevOpacity = useSharedValue(0);

  useEffect(() => {
    start();
    return () => stop();
  }, []);

  const toggleFavorite = useCallback((dhikr: any, isFav: boolean) => {
    if (!dhikr) return;
    if (isFav) {
      removeFavorite(dhikr.id);
    } else {
      addFavorite(dhikr);
    }
  }, [addFavorite, removeFavorite]);

  const resetAnimationValues = useCallback((direction?: 'up' | 'down') => {
    if (direction) {
      translateY.value = 0;
      scale.value = 1;
      currentOpacity.value = 1;
      nextOpacity.value = 0;
      prevOpacity.value = 0;
      nextOffset.value = height;
      prevOffset.value = -height;
    } else {
      translateY.value = withSpring(0, SPRING_CONFIG);
      scale.value = withSpring(1, SPRING_CONFIG);
      nextOffset.value = withSpring(height, SPRING_CONFIG);
      prevOffset.value = withSpring(-height, SPRING_CONFIG);
      currentOpacity.value = withTiming(1, TIMING_CONFIG);
      nextOpacity.value = withTiming(0, TIMING_CONFIG);
      prevOpacity.value = withTiming(0, TIMING_CONFIG);
    }
    runOnJS(setIsTransitioning)(false);
  }, [height]);

  const handleComplete = useCallback((direction: 'up' | 'down') => {
    if (direction === 'up') {
      incrementCount();
      onNext();
    } else {
      onPrevious();
    }
    requestAnimationFrame(() => {
      resetAnimationValues(direction);

      // Simplified reset (maybe instantaneous is better here?)
      translateY.value = 0;
      scale.value = 1;
      currentOpacity.value = 1;
      nextOpacity.value = 0;
      prevOpacity.value = 0;
      nextOffset.value = height;
      prevOffset.value = -height;
      runOnJS(setIsTransitioning)(false);
    });
  }, [incrementCount, onNext, onPrevious, resetAnimationValues]);

  const gesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .onBegin(() => {
      if (isTransitioning) return;
      runOnJS(setIsTransitioning)(true);
      scale.value = withSpring(0.98, SPRING_CONFIG);
    })
    .onUpdate((event) => {
      if (event.translationY > 0 && currentIndex === 0) {
        translateY.value = event.translationY * 0.2;
        return;
      }

      translateY.value = event.translationY;

      const progress = Math.abs(event.translationY) / TRANSITION_DISTANCE;
      const clampedProgress = Math.min(Math.max(progress, 0), 1);

      if (event.translationY < 0) {
        const nextTranslation = interpolate(
          event.translationY,
          [-TRANSITION_DISTANCE, 0],
          [0, height],
          'clamp'
        );
        nextOffset.value = nextTranslation;
        nextOpacity.value = clampedProgress;
        currentOpacity.value = interpolate(
          clampedProgress,
          [0, 1],
          [1, 0.7],
          'clamp'
        );
        prevOpacity.value = 0;
      } else if (currentIndex > 0) {
        const prevTranslation = interpolate(
          event.translationY,
          [0, TRANSITION_DISTANCE],
          [-height, 0],
          'clamp'
        );
        prevOffset.value = prevTranslation;
        prevOpacity.value = clampedProgress;
        currentOpacity.value = interpolate(
          clampedProgress,
          [0, 1],
          [1, 0.7],
          'clamp'
        );
        nextOpacity.value = 0;
      }
    })
    .onEnd((event) => {
      const velocity = event.velocityY;
      const shouldComplete =
        Math.abs(event.translationY) > SWIPE_THRESHOLD ||
        Math.abs(velocity) > 500;

      if (shouldComplete) {
        if (event.translationY > 0 && currentIndex > 0) {
          translateY.value = withSpring(height, {
            ...SPRING_CONFIG,
            velocity,
          }, () => {
            runOnJS(handleComplete)('down');
          });
          prevOffset.value = withSpring(0, SPRING_CONFIG);
          scale.value = withSpring(1, SPRING_CONFIG);
          prevOpacity.value = withTiming(1, TIMING_CONFIG);
          currentOpacity.value = withTiming(0, TIMING_CONFIG);
        } else if (event.translationY < 0) {
          translateY.value = withSpring(-height, {
            ...SPRING_CONFIG,
            velocity,
          }, () => {
            runOnJS(handleComplete)('up');
          });
          nextOffset.value = withSpring(0, SPRING_CONFIG);
          scale.value = withSpring(1, SPRING_CONFIG);
          nextOpacity.value = withTiming(1, TIMING_CONFIG);
          currentOpacity.value = withTiming(0, TIMING_CONFIG);
        } else {
          runOnJS(resetAnimationValues)();
        }
      } else {
        runOnJS(resetAnimationValues)();
      }
    });

  const currentStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    opacity: currentOpacity.value,
  }));

  const nextStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: nextOffset.value },
      {
        scale: interpolate(
          nextOpacity.value,
          [0, 1],
          [0.95, 1],
          'clamp'
        )
      }
    ],
    opacity: nextOpacity.value,
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  }));

  const prevStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: prevOffset.value },
      {
        scale: interpolate(
          prevOpacity.value,
          [0, 1],
          [0.95, 1],
          'clamp'
        )
      }
    ],
    opacity: prevOpacity.value,
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  }));

  if (!currentDhikr) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Assalamu Alaikum</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        })}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarContainer}>
          <View style={[
            styles.progressBar,
            { height: `${progressPercentage}%` }
          ]} />
        </View>
        <Text style={styles.progressText}>{progressPercentage < 100 ? progressPercentage : 100}%</Text>
      </View>

      <GestureDetector gesture={gesture}>
        <View style={styles.contentContainer}>
          {currentIndex > 0 && (
            <DhikrContent
              dhikr={prevDhikr}
              isFavorite={isPrevFavorite}
              onToggleFavorite={toggleFavorite}
              theme={theme}
              style={prevStyle}
              pointerEvents={isTransitioning ? 'auto' : 'auto'}
            />
          )}

          <DhikrContent
            dhikr={currentDhikr}
            isFavorite={isCurrentFavorite}
            onToggleFavorite={toggleFavorite}
            theme={theme}
            style={currentStyle}
            pointerEvents={isTransitioning ? 'auto' : 'auto'}
          />

          <DhikrContent
            dhikr={nextDhikr}
            isFavorite={isNextFavorite}
            onToggleFavorite={toggleFavorite}
            theme={theme}
            style={nextStyle}
            pointerEvents={isTransitioning ? 'auto' : 'auto'}
          />
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  header: {

  },
  greeting: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 17,
    lineHeight: 20,
    color: '#8C8F7B',
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 13,
    lineHeight: 14,
    color: '#6F7C50',
    opacity: 0.5,
  },
  progressContainer: {
    position: 'absolute',
    left: 17,
    top: '50%',
    transform: [{ translateY: -270.5 }],
    alignItems: 'center',
    height: 500,
  },
  progressBarContainer: {
    width: 5,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progressBar: {
    width: '100%',
    backgroundColor: '#7E0F3B',
    borderRadius: 2.5,
    position: 'absolute',
    bottom: 0,
  },
  progressText: {
    fontFamily: 'Sofia-Pro',
    //fontSize: 10,
    //lineHeight: 12,
    color: '#8C8F7B',
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    paddingBottom: 15,
  },
  dhikrCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20
    //paddingHorizontal: 20,
  },
  textWrapper: {
    paddingTop: 15,
    paddingLeft: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    maxWidth: 350,
    width: '100%',
    paddingHorizontal: 0,
  },
  arabicText: {
    fontFamily: 'NotoNaskhArabic',
    fontSize: 25,
    textAlign: 'center',
    color: '#8C8F7B',
  },
  transliteration: {
    fontFamily: 'Classico',
    fontSize: 28,
    textAlign: 'center',
    color: '#181818',
    lineHeight: 30
  },
  translation: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 16,
    textAlign: 'center',
    color: '#8C8F7B',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  favoriteButtonActive: {
    //backgroundColor: 'rgba(126, 15, 59, 0.1)',
  },
});