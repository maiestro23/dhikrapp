import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Platform } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../hooks/useProgress';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useDhikrStore } from '../../stores/dhikrStore';
import { ScreenBackground } from '../../components/ScreenBackground';

const screenHeight = Dimensions.get('window').height;

const DhikrContent = ({ dhikr, isFavorite, onToggleFavorite, theme }: any) => (
  <View style={[styles.dhikrCard, { height: screenHeight }]}>
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

  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(1);

  const circularPages = [
    dhikrs[dhikrs.length - 1], // fake first
    ...dhikrs,
    dhikrs[0],                 // fake last
  ];

  useEffect(() => {
    start();
    return () => stop();
  }, []);

  const toggleFavorite = useCallback((dhikr: any, isFav: boolean) => {
    if (isFav) removeFavorite(dhikr.id);
    else addFavorite(dhikr);
  }, [addFavorite, removeFavorite]);

  const handleMomentumScrollEnd = (e: any) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const newIndex = Math.round(offsetY / screenHeight);
    setCurrentIndex(newIndex);

    // Update progress only for real pages
    if (newIndex !== 0 && newIndex !== circularPages.length - 1) {
      incrementCount();
    }

    // Handle infinite scroll
    if (newIndex === 0) {
      flatListRef.current?.scrollToIndex({ index: dhikrs.length, animated: false });
      setCurrentIndex(dhikrs.length);
    } else if (newIndex === circularPages.length - 1) {
      flatListRef.current?.scrollToIndex({ index: 1, animated: false });
      setCurrentIndex(1);
    }
  };

  const barHeightPx = (goalProgress / 100) * 500;

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
            <View style={[styles.progressBar, { height: Math.round(barHeightPx) }]} />
          </View>
          <Text style={styles.progressText}>
            {goalProgress < 100 ? goalProgress : 100}%
          </Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={circularPages}
          keyExtractor={(_, index) => `dhikr-${index}`}
          renderItem={({ item }) => (
            <DhikrContent
              dhikr={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={toggleFavorite}
              theme={theme}
            />
          )}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          initialScrollIndex={1}
          getItemLayout={(_, index) => (
            { length: screenHeight, offset: screenHeight * index, index }
          )}
        />
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
