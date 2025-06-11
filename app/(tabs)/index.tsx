import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Heart } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../hooks/useProgress';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useDhikrStore } from '../../stores/dhikrStore';
import { ScreenBackground } from '../../components/ScreenBackground';
import { router } from 'expo-router';
import { Dhikr } from '@/config/dhikrs';

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
      {/* Page Indicator */}
      {dhikr.dhikrLength && dhikr.dhikrLength > '1' && (
        <Text style={styles.pageIndicator}>
          {dhikr.pageId}/{dhikr.dhikrLength}
        </Text>
      )}
    </View>
  </View>
);

export default function DhikrScreen() {
  const { theme } = useTheme();
  const { start, stop } = useTimeTracking();
  const { incrementCount, goalProgress } = useProgress();
  const dhikrs = useDhikrStore().getDhikrsByUrlCategory();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

  const pagerRef = useRef<PagerView>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [scrollState, setScrollState] = useState<'idle' | 'dragging' | 'settling'>('idle');
  const [isAdjustingPosition, setIsAdjustingPosition] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    start();
    return () => {
      stop();
      // Clean up timeout on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [start, stop]);

  // Ajoutez un état pour la clé
  const [pagerKey, setPagerKey] = useState(0);

  // Dans l'useEffect qui surveille les changements de dhikrs
  useEffect(() => {
    if (dhikrs && dhikrs.length > 0) {
      setPagerKey(prev => prev + 1); // Force la re-création du PagerView
      setCurrentIndex(1);
    }
  }, [dhikrs]);

  const toggleFavorite = useCallback((dhikr: any, isFav: boolean) => {
    if (isFav) removeFavorite(dhikr.uuid);
    else addFavorite(dhikr);
  }, [addFavorite, removeFavorite]);

  const handleCategoryPress = useCallback(() => {
    router.replace('/discover');
  }, []);

  const handlePageSelected = useCallback((e: any) => {
    const index = e.nativeEvent.position;

    // Always update currentIndex to track where we are
    setCurrentIndex(index);

    // Only increment count for real pages (indices 1 to dhikrs.length)
    // Don't increment during adjustments or on fake pages
    if (!isAdjustingPosition && index >= 1 && index <= dhikrs.length) {
      incrementCount();
    }

    console.log('Page selected:', index, 'isAdjusting:', isAdjustingPosition, 'scrollState:', scrollState);

    // Handle circular adjustment immediately when we hit fake pages
    const lastRealIndex = dhikrs.length;
    const lastFakeIndex = dhikrs.length + 1;

    if (!isAdjustingPosition && (index === 0 || index === lastFakeIndex)) {
      console.log('Triggering immediate adjustment for index:', index);
      setIsAdjustingPosition(true);

      // Use a shorter timeout for immediate response
      setTimeout(() => {
        if (pagerRef.current) {
          try {
            if (index === 0) {
              // Move from fake last to real last
              pagerRef.current.setPageWithoutAnimation(lastRealIndex);
              console.log('Adjusted from fake last (0) to real last (' + lastRealIndex + ')');
            } else if (index === lastFakeIndex) {
              // Move from fake first to real first
              pagerRef.current.setPageWithoutAnimation(1);
              console.log('Adjusted from fake first (' + lastFakeIndex + ') to real first (1)');
            }
          } catch (error) {
            console.warn('PagerView position adjustment failed:', error);
          }
        }

        // Reset adjustment flag
        setTimeout(() => {
          setIsAdjustingPosition(false);
        }, 50);
      }, 10); // Much shorter delay for immediate response
    }
  }, [dhikrs.length, incrementCount, isAdjustingPosition, scrollState]);

  const handleScrollStateChanged = useCallback((e: any) => {
    const state = e.nativeEvent.pageScrollState;
    setScrollState(state);
  }, []);

  // Simplified circular scrolling - removed the complex useEffect approach
  // The adjustment now happens directly in handlePageSelected for immediate response

  // Early return if no data
  if (!dhikrs || dhikrs.length === 0) {
    return (
      <ScreenBackground>
        <View style={[styles.container, styles.loadingContainer]}>
          <Text style={styles.loadingText}>Loading dhikrs...</Text>
        </View>
      </ScreenBackground>
    );
  }

  // Create circular pages with validation
  const circularPages = [
    dhikrs[dhikrs.length - 1], // fake last
    ...dhikrs,                 // real items
    dhikrs[0],                 // fake first
  ];

  const barHeightPx = Math.max(0, Math.min((goalProgress / 100) * 500, 500));

  // Get current category from the first dhikr (all dhikrs in the array should have the same category)
  const currentCategory = dhikrs[0]?.category || '';

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

          {/* Category Tag */}
          <TouchableOpacity
            style={styles.categoryTag}
            onPress={handleCategoryPress}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryText}>{currentCategory}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { height: Math.round(barHeightPx) }]} />
          </View>
          <Text style={styles.progressText}>
            {Math.min(Math.round(goalProgress), 100)}%
          </Text>
        </View>

        <PagerView
          key={pagerKey}
          ref={pagerRef}
          initialPage={1}
          style={{ flex: 1 }}
          orientation="vertical"
          onPageSelected={handlePageSelected}
          onPageScrollStateChanged={handleScrollStateChanged}
          scrollEnabled={!isAdjustingPosition} // Disable scrolling during adjustments
        >
          {circularPages.map((dhikr: any, index: number) => (
            <View key={`dhikr-${dhikr?.id || index}-${index}`}>
              <DhikrContent
                dhikr={dhikr as Dhikr}
                isFavorite={isFavorite(dhikr?.uuid)}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 16,
    color: '#8C8F7B',
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
  categoryTag: {
    zIndex: 3,
    position: "absolute",
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    //marginTop: 20,
    top: 70,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontFamily: 'Sofia-Pro',
    fontSize: 14,
    color: '#8C8F7B',
    textAlign: 'center',
  },

  pageIndicator: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 14,
    color: '#8C8F7B',
    marginTop: 12,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
  },

  progressContainer: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -270 }],
    alignItems: 'center',
    height: 500,
  },
  progressBarContainer: {
    width: 4,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    width: '100%',
    backgroundColor: '#7E0F3B',
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
  },
  progressText: {
    fontFamily: 'Sofia-Pro',
    color: '#8C8F7B',
    marginTop: 8,
    width: 40,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    left: 2
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
    paddingLeft: 30,
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