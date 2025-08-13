import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import PagerView from 'react-native-pager-view';
import { Heart } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../hooks/useProgress';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useDhikrStore } from '../../stores/dhikrStore';
import { ScreenBackground } from '../../components/ScreenBackground';
import { router, useLocalSearchParams } from 'expo-router';
import { Dhikr } from '@/config/dhikrs';
import { CompletionNotification } from '../../components/CompletionNotification';
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';
import GoalCompleteModal from '@/components/GoalCompleteModal';

const DhikrContent = ({ dhikr, isFavorite, onToggleFavorite, theme, positionIndex, categoryLength }: any) => (
  <View style={styles.dhikrCard}>
    <View style={styles.textWrapper}>
      <Text style={[styles.arabicText, { color: theme.colors.dhikrReader.arabicColor }]}>{dhikr.arabicText}</Text>
      <Text style={[styles.transliteration, { color: theme.colors.dhikrReader.transliterationColor }]}>{dhikr.transliteration}</Text>
      <Text style={[styles.translation, { color: theme.colors.dhikrReader.translationColor }]}>{dhikr.translation}</Text>
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

      <Text style={[styles.pageIndicator, { color: theme.colors.dhikrReader.pageIndicatorColor }]}>
        {getDisplayIndex(positionIndex, categoryLength)}/{categoryLength}
      </Text>
    </View>
  </View>
);

// Ajoutez cette fonction helper avant votre composant principal :
const getDisplayIndex = (currentIndex: number, totalLength: number) => {
  // Si on est sur l'élément dupliqué du début (index 0), afficher le dernier
  if (currentIndex === 0) {
    return totalLength;
  }
  // Si on est sur l'élément dupliqué de la fin (index totalLength + 1), afficher le premier
  if (currentIndex === totalLength + 1) {
    return 1;
  }
  // Sinon, afficher l'index normal (en soustrayant 1 car on commence à l'index 1)
  return currentIndex;
};

export default function DhikrScreen() {
  const { theme } = useTheme();
  const { start, stop } = useTimeTracking();
  const { incrementCount, goalProgress, totalCount, todayProgress } = useProgress();
  const dhikrs = useDhikrStore().getDhikrsByUrlCategory();
  const categoryLength = dhikrs.length;
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

  const pagerRef = useRef<PagerView>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [scrollState, setScrollState] = useState<'idle' | 'dragging' | 'settling'>('idle');
  const [isAdjustingPosition, setIsAdjustingPosition] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [lastGoalAchieved, setLastGoalAchieved] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    start();
    return () => {
      stop();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [start, stop]);

  // Surveiller quand l'objectif quotidien est atteint
  useEffect(() => {
    if (goalProgress >= 100 && !showGoalModal) {
      // Vérifier si c'est un nouvel objectif atteint
      const currentGoalCount = Math.floor(goalProgress / 100);
      
      if (lastGoalAchieved !== currentGoalCount) {
        // Petit délai pour une meilleure expérience utilisateur
        setTimeout(() => {
          setShowGoalModal(true);
          setLastGoalAchieved(currentGoalCount);
        }, 1000);
      }
    }
  }, [goalProgress, showGoalModal, lastGoalAchieved]);

  const [pagerKey, setPagerKey] = useState(0);

  useEffect(() => {
    if (dhikrs && dhikrs.length > 0) {
      setPagerKey(prev => prev + 1);
      setCurrentIndex(1);
      setCompletedCycles(0);
    }
  }, [dhikrs]);

  const toggleFavorite = useCallback((dhikr: any, isFav: boolean) => {
    if (isFav) removeFavorite(dhikr.uuid);
    else addFavorite(dhikr);
  }, [addFavorite, removeFavorite]);

  const handleCategoryPress = useCallback(() => {
    router.replace('/discover');
  }, []);

  // Obtenir les paramètres au niveau du composant
  const params = useLocalSearchParams();
  const categoryUrl = params.category as string || 'General';

  const handlePageSelected = useCallback((e: any) => {
    const index = e.nativeEvent.position;

    setCurrentIndex(index);

    // Logique existante pour le comptage et l'ajustement circulaire
    if (!isAdjustingPosition && index >= 1 && index <= dhikrs.length) {
      incrementCount();
    }

    console.log('Page selected:', index, 'isAdjusting:', isAdjustingPosition, 'scrollState:', scrollState);

    const lastRealIndex = dhikrs.length;
    const lastFakeIndex = dhikrs.length + 1;

    if (!isAdjustingPosition && (index === 0 || index === lastFakeIndex)) {
      console.log('Triggering immediate adjustment for index:', index);
      setIsAdjustingPosition(true);

      // Détecter le cycle complet et afficher la notification
      if (index === 0 || index === lastFakeIndex) {
        setCompletedCycles(prev => prev + 1);
        setShowNotification(true);
      }

      setTimeout(() => {
        if (pagerRef.current) {
          try {
            if (index === 0) {
              pagerRef.current.setPageWithoutAnimation(lastRealIndex);
              console.log('Adjusted from fake last (0) to real last (' + lastRealIndex + ')');
            } else if (index === lastFakeIndex) {
              pagerRef.current.setPageWithoutAnimation(1);
              console.log('Adjusted from fake first (' + lastFakeIndex + ') to real first (1)');
            }
          } catch (error) {
            console.warn('PagerView position adjustment failed:', error);
          }
        }

        setTimeout(() => {
          setIsAdjustingPosition(false);
        }, 50);
      }, 10);
    }
  }, [dhikrs.length, incrementCount, isAdjustingPosition, scrollState]);

  const handleScrollStateChanged = useCallback((e: any) => {
    const state = e.nativeEvent.pageScrollState;
    setScrollState(state);
  }, []);

  const handleCloseNotification = useCallback(() => {
    setShowNotification(false);
  }, []);

  const handleCloseGoalModal = useCallback(() => {
    setShowGoalModal(false);
  }, []);

  const handleShareAchievement = useCallback(async () => {
    try {
      const result = await Share.share({
        message: `🎉 J'ai complété mon objectif quotidien de dhikr ! Alhamdulillah 🤲\n\n"Verily, in the remembrance of Allah do hearts find rest." (13:28)`,
        title: 'Objectif Dhikr Complété!',
      });

      if (result.action === Share.sharedAction) {
        // L'utilisateur a partagé
        handleCloseGoalModal();
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager en ce moment.');
    }
  }, [handleCloseGoalModal]);

  if (!dhikrs || dhikrs.length === 0) {
    return (
      <ScreenBackground>
        <View style={[styles.container, styles.loadingContainer]}>
          <Text style={[styles.noFavouriteTitle]}>
            No favourites yet?
          </Text>
          <Text style={styles.loadingText}>Tap the heart 🤍 on any adhkar to start</Text>
          <Text style={styles.loadingText}>building your own custom playlist</Text>
          <TouchableOpacity
            style={styles.noFavbutton}
            onPress={handleCategoryPress}
          >
            <Text style={styles.noFavButtonText}>Explore Adhkar</Text>
          </TouchableOpacity>
        </View>
      </ScreenBackground>
    );
  }

  const circularPages = [
    dhikrs[dhikrs.length - 1],
    ...dhikrs,
    dhikrs[0],
  ];

  const barHeightPx = Math.max(0, Math.min((goalProgress / 100) * 500, 500));

  let currentCategory = 'General'
  if (categoryUrl && categoryUrl === 'favourites') {
    currentCategory = 'Favourites';
  } else {
    currentCategory = dhikrs[0]?.category;
  }

  return (
    <PageTransitionWrapper animationType="fade" duration={350}>
      <ScreenBackground>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.leftHeader}>
              <Text style={[styles.greeting, { color: theme.colors.dhikrReader.greetingColor }]}>Assalamu Alaikum</Text>
              <Text style={[styles.date, { color: theme.colors.dhikrReader.greetingColor }]}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>

            <View style={styles.rightHeader}>
              <Text style={[styles.goalText, { color: theme.colors.dhikrReader.khairisAndGoalColor }]}>Dhikr Goal: {Math.min(Math.round(goalProgress), 100)}%</Text>
              <Text style={[styles.khairisText, { color: theme.colors.dhikrReader.khairisAndGoalColor }]}>Khairis: {todayProgress >= 1000 ? `${(todayProgress / 1000).toFixed(1)}k` : todayProgress}✨</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.categoryTag, { backgroundColor: theme.colors.dhikrReader.categoryColor}]}
            onPress={handleCategoryPress}
            activeOpacity={0.7}
          >
            <Text style={[styles.categoryText, { color: theme.colors.dhikrReader.categoryText}]}>{currentCategory}</Text>
          </TouchableOpacity>

          <CompletionNotification
            visible={showNotification}
            onClose={handleCloseNotification}
            subtitle={`+${categoryLength} Khairis earned ✨`}
            categoryName={currentCategory}
            khairisAmount={categoryLength}
          />

          <PagerView
            key={pagerKey}
            ref={pagerRef}
            initialPage={1}
            style={{ flex: 1 }}
            orientation="vertical"
            onPageSelected={handlePageSelected}
            onPageScrollStateChanged={handleScrollStateChanged}
            scrollEnabled={!isAdjustingPosition}
          >
            {circularPages.map((dhikr: any, index: number) => (
              <View key={`dhikr-${dhikr?.id || index}-${index}`}>
                <DhikrContent
                  dhikr={dhikr as Dhikr}
                  isFavorite={isFavorite(dhikr?.uuid)}
                  onToggleFavorite={toggleFavorite}
                  theme={theme}
                  positionIndex={index}
                  categoryLength={categoryLength}
                />
              </View>
            ))}
          </PagerView>

          {/* Modal de félicitations pour objectif quotidien atteint */}
          <GoalCompleteModal
            visible={showGoalModal}
            onClose={handleCloseGoalModal}
            onShare={handleShareAchievement}
            khairisEarned={3000}
          />
        </View>
      </ScreenBackground>
    </PageTransitionWrapper>
  );
}

// Les styles avec la notification ajoutée
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 16,
    color: '#8C8F7B',
  },
  noFavouriteTitle: {
    paddingLeft: 16,
    marginTop: 28,
    fontFamily: 'Classico',
    fontSize: 24,
    color: '#181818',
    marginBottom: 8
  },
  noFavbutton: {
    width: '50%',
    height: 42,
    maxWidth: 252,
    backgroundColor: '#7E0F3B',
    borderRadius: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 36,
  },
  noFavButtonText: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 16,
    lineHeight: 26,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  leftHeader: {
    flex: 1,
  },
  rightHeader: {},
  greeting: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 17,
    lineHeight: 20,
    color: '#8C8F7B',
    marginBottom: 4,
  },
  date: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 14,
    lineHeight: 14,
    color: '#6F7C50',
    opacity: 0.5,
  },
  goalText: {
    fontFamily: 'Sofia-Pro',
    fontSize: 15,
    lineHeight: 20,
    color: '#6F7C50',
    opacity: 0.5,
    marginBottom: 4,
    textAlign: 'left',
    fontVariant: ['tabular-nums'],
  },
  khairisText: {
    fontFamily: 'Sofia-Pro',
    fontSize: 15,
    lineHeight: 14,
    color: '#6F7C50',
    opacity: 0.5,
    textAlign: 'left',
    fontVariant: ['tabular-nums'],
  },
  categoryTag: {
    zIndex: 3,
    position: "absolute",
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 20,
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
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 14,
    color: '#FFF',
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
  },
  textWrapper: {
    paddingTop: 15,
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