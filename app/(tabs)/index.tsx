import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Heart } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../hooks/useProgress';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useDhikrStore } from '../../stores/dhikrStore';
import { useProgressStore } from '../../stores/progressStore';
import { ScreenBackground } from '../../components/ScreenBackground';

const DhikrContent = ({ dhikr, isFavorite, onToggleFavorite, theme }: any) => (
  <View style={styles.dhikrCard}>
    <View style={styles.textWrapper}>
      <Text style={styles.arabicText}>{dhikr.arabicText}</Text>
      <Text style={styles.transliteration}>{dhikr.transliteration}</Text>
      <Text style={styles.translation}>{dhikr.translation}</Text>
      <TouchableOpacity
        style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
        onPress={() => onToggleFavorite(dhikr, isFavorite)}
      >
        <Heart
          size={24}
          color={theme.colors.accent}
          fill={!isFavorite ? 'transparent' : theme.colors.accent}
        />
      </TouchableOpacity>
    </View>
  </View>
);

export default function DhikrScreen() {
  const { theme } = useTheme();
  const { start, stop } = useTimeTracking();
  const { incrementCount, goalProgress } = useProgress();
  const { dhikrs } = useDhikrStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

  const pagerRef = useRef<PagerView>(null);
  const [currentIndex, setCurrentIndex] = useState(1); // Start at first real item
  const [scrollState, setScrollState] = useState<'idle' | 'dragging' | 'settling'>('idle');

  useEffect(() => {
    start();
    return () => stop();
  }, []);

  const toggleFavorite = useCallback((dhikr: any, isFav: boolean) => {
    if (isFav) removeFavorite(dhikr.id);
    else addFavorite(dhikr);
  }, [addFavorite, removeFavorite]);

  const handlePageSelected = (e: any) => {
    const index = e.nativeEvent.position;
    setCurrentIndex(index); // Store the index even for fake pages
    if (index !== 0 && index !== dhikrs.length + 1) {
      incrementCount(); // Increment only if not on fake page
    }
  };

  const handleScrollStateChanged = (e: any) => {
    const state = e.nativeEvent.pageScrollState;
    setScrollState(state);
  };

  // Correct position after swipe finishes
  useEffect(() => {
    if (scrollState === 'idle') {
      const lastIndex = dhikrs.length;
      if (currentIndex === 0) {
        pagerRef.current?.setPageWithoutAnimation(lastIndex);
        setCurrentIndex(lastIndex);
      } else if (currentIndex === lastIndex + 1) {
        pagerRef.current?.setPageWithoutAnimation(1);
        setCurrentIndex(1);
      }
    }
  }, [scrollState]);

  // Create pages with extra fake first and last
  const circularPages = [
    dhikrs[dhikrs.length - 1], // fake last
    ...dhikrs,                 // real items
    dhikrs[0],                 // fake first
  ];

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Assalamu Alaikum</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { height: `${goalProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {goalProgress < 100 ? goalProgress : 100}%
          </Text>
        </View>

        <PagerView
          ref={pagerRef}
          initialPage={1}
          style={{ flex: 1 }}
          orientation="vertical"
          onPageSelected={handlePageSelected}
          onPageScrollStateChanged={handleScrollStateChanged}
        >
          {circularPages.map((dhikr: any, index: number) => (
            <View key={`dhikr-${index}`}>
              <DhikrContent
                dhikr={dhikr}
                isFavorite={isFavorite(dhikr.id)}
                onToggleFavorite={toggleFavorite}
                theme={theme}
              />
            </View>
          ))}
        </PagerView>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {},
  greeting: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 17,
    lineHeight: 20,
    color: '#8C8F7B',
    marginBottom: 4,
    marginLeft: 20
  },
  date: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 13,
    lineHeight: 14,
    color: '#6F7C50',
    opacity: 0.5,
    marginLeft: 20
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
    paddingRight: 20,
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
    lineHeight: 30,
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
  favoriteButtonActive: {},
});
