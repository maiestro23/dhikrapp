import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
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
import { useProgressStore } from '@/stores/progressStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CategoryTransitionScreen } from '../../components/CategoryTransitionScreen';

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

const getDisplayIndex = (currentIndex: number, totalLength: number) => {
  if (currentIndex === 0) {
    return totalLength;
  }
  if (currentIndex === totalLength + 1) {
    return 1;
  }
  return currentIndex;
};

export default function DhikrScreen() {
  const { theme } = useTheme();
  const { start, stop } = useTimeTracking();
  const { incrementCount, goalProgress, totalCount, todayProgress } = useProgress();
  const { setDailyGoal, dailyGoal } = useProgressStore();
  
  // Modification pour gérer le mélange des dhikrs General
  const dhikrStore = useDhikrStore();
  const shuffleGeneralDhikrs = useDhikrStore(state => state.shuffleGeneralDhikrs);
  const params = useLocalSearchParams();
  const categoryUrl = params.category as string || 'General';

  // Effet pour déclencher le mélange quand on arrive sur General
  useEffect(() => {
    if (categoryUrl === 'General') {
      console.log('Navigating to General category - shuffling dhikrs');
      shuffleGeneralDhikrs();
    }
  }, [categoryUrl, shuffleGeneralDhikrs]);

  const categoryData = dhikrStore.getDhikrsByUrlCategory();
  const { dhikrs, transition } = categoryData;
  const categoryLength = dhikrs?.length || 0;
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();

  const pagerRef = useRef<PagerView>(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [scrollState, setScrollState] = useState<'idle' | 'dragging' | 'settling'>('idle');
  const [isAdjustingPosition, setIsAdjustingPosition] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalCompletedToday, setGoalCompletedToday] = useState<string | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [isOnTransitionScreen, setIsOnTransitionScreen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Générer les pages circulaires avec écran de transition si nécessaire
  const circularPages = useMemo(() => {
    if (!dhikrs || dhikrs.length === 0) return [];

    let pages = [
      { ...dhikrs[dhikrs.length - 1], type: 'dhikr' },
      ...dhikrs.map((d: any) => ({ ...d, type: 'dhikr' }))
    ];

    // Ajouter l'écran de transition si disponible et si la catégorie est complétée
    if (transition && showTransition) {
      pages.push({
        type: 'transition',
        title: transition.title,
        subtitle: transition.subtitle,
        nextCategories: transition.nextCategories,
        id: 'transition-screen'
      });
    }

    pages.push({ ...dhikrs[0], type: 'dhikr' });
    return pages;
  }, [dhikrs, transition, showTransition]);

  useEffect(() => {
    start();

    const loadGoalCompletedDate = async () => {
      try {
        const savedDate = await AsyncStorage.getItem('goalCompletedDate');
        setGoalCompletedToday(savedDate);
      } catch (error) {
        console.log('Error loading goal completed date:', error);
      }
    };

    loadGoalCompletedDate();

    return () => {
      stop();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [start, stop]);

  // Surveiller quand l'objectif quotidien est atteint
  useEffect(() => {
    const progressPercentage = (todayProgress / dailyGoal) * 100;

    if (progressPercentage >= 100 && !showGoalModal) {
      const today = new Date().toISOString().split('T')[0];

      if (goalCompletedToday !== today) {
        setShowGoalModal(true);
        setGoalCompletedToday(today);

        AsyncStorage.setItem('goalCompletedDate', today).catch(error => {
          console.log('Error saving goal completed date:', error);
        });
      }
    }
  }, [todayProgress, dailyGoal, showGoalModal, goalCompletedToday]);

  const [pagerKey, setPagerKey] = useState(0);

  useEffect(() => {
    if (dhikrs && dhikrs.length > 0) {
      setPagerKey(prev => prev + 1);
      setCurrentIndex(1);
      setCompletedCycles(0);
      setShowTransition(false);
      setIsOnTransitionScreen(false);
    }
  }, [dhikrs]);

  const toggleFavorite = useCallback((dhikr: any, isFav: boolean) => {
    if (isFav) removeFavorite(dhikr.uuid);
    else addFavorite(dhikr);
  }, [addFavorite, removeFavorite]);

  const handleCategoryPress = useCallback(() => {
    router.replace('/discover');
  }, []);

  console.log('DhikrScreen - Current params:', params);
  console.log('DhikrScreen - Category data:', { dhikrsLength: dhikrs?.length, hasTransition: !!transition });

  const handlePageSelected = useCallback((e: any) => {
    if (!dhikrs || dhikrs.length === 0) return;

    const index = e.nativeEvent.position;
    setCurrentIndex(index);

    console.log('Page selected:', {
      index,
      dhikrsLength: dhikrs.length,
      showTransition,
      circularPagesLength: circularPages.length,
      isAdjusting: isAdjustingPosition
    });

    // Vérifier si on est sur l'écran de transition
    const currentItem = circularPages[index];
    const isTransitionScreen = currentItem && currentItem.type === 'transition';
    setIsOnTransitionScreen(isTransitionScreen);

    // Logique de comptage - ne compter que les vrais dhikrs
    if (!isAdjustingPosition && index >= 1 && index <= dhikrs.length) {
      if (currentItem && currentItem.type === 'dhikr') {
        incrementCount();
      }
    }

    // Détecter la fin de catégorie pour activer l'écran de transition
    if (!isAdjustingPosition && index === dhikrs.length && transition && !showTransition) {
      console.log('Activating transition screen');
      setShowTransition(true);
      setCompletedCycles(prev => prev + 1);
    }

    // Afficher la notification quand on arrive sur l'écran de transition
    if (!isAdjustingPosition && isTransitionScreen && !showNotification) {
      console.log('Showing notification on transition screen');
      setShowNotification(true);
    }

    // Calculer les indices en fonction de si la transition est affichée
    const actualDhikrsLength = dhikrs.length;
    const hasTransition = showTransition && transition;
    const lastRealIndex = hasTransition ? actualDhikrsLength + 1 : actualDhikrsLength;
    const lastFakeIndex = hasTransition ? actualDhikrsLength + 2 : actualDhikrsLength + 1;

    console.log('Circular bounds:', { lastRealIndex, lastFakeIndex, hasTransition });

    // Gestion de la navigation circulaire
    if (!isAdjustingPosition && (index === 0 || index === lastFakeIndex)) {
      console.log('Triggering circular adjustment for index:', index);
      setIsAdjustingPosition(true);

      setTimeout(() => {
        if (pagerRef.current) {
          try {
            if (index === 0) {
              console.log('Adjusting from start to:', lastRealIndex);
              pagerRef.current.setPageWithoutAnimation(lastRealIndex);
            } else if (index === lastFakeIndex) {
              console.log('Adjusting from end to: 1');
              pagerRef.current.setPageWithoutAnimation(1);
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
  }, [dhikrs, incrementCount, isAdjustingPosition, circularPages, transition, showTransition, showNotification]);

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
      const shareContent = {
        message: `🎉 I completed my daily dhikr goal! Alhamdulillah 🤲\n\nJoin me in building a daily dhikr habit with this amazing app! 🤲\n\n"Verily, in the remembrance of Allah do hearts find rest." (13:28)`,
        title: 'Dhikr App - Daily Goal Complete!',
        url: 'https://apps.apple.com/app/khair-daily-adhkar/id6744126455',
      };

      const result = await Share.share(shareContent);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared via:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
        handleCloseGoalModal();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Unable to share at the moment.');
    }
  }, [handleCloseGoalModal]);

  const handleTransitionContinue = useCallback(() => {
    // Naviguer vers une catégorie suggérée (première par défaut)
    if (transition && transition.nextCategories.length > 0) {
      const nextCategory = transition.nextCategories[0];
      console.log('Navigating to category:', nextCategory);

      // Utiliser router.replace au lieu de router.push pour forcer le rechargement
      router.replace({
        pathname: '/(tabs)',
        params: {
          category: nextCategory,
        }
      });
    }
  }, [transition]);

  if (!dhikrs || dhikrs.length === 0) {
    return (
      <ScreenBackground>
        <View style={[styles.container, styles.loadingContainer]}>
          <Text style={[
            styles.noFavouriteTitle,
            { color: theme.colors.noFavourites.titleColor }
          ]}>
            No favourites yet?
          </Text>
          <Text style={[
            styles.loadingText,
            { color: theme.colors.noFavourites.textColor }
          ]}>Tap the heart 🤍 on any adhkar to start</Text>
          <Text style={[
            styles.loadingText,
            { color: theme.colors.noFavourites.textColor }
          ]}>building your own custom playlist</Text>

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
            style={[styles.categoryTag, { backgroundColor: theme.colors.dhikrReader.categoryColor }]}
            onPress={handleCategoryPress}
            activeOpacity={0.7}
          >
            <Text style={[styles.categoryText, { color: theme.colors.dhikrReader.categoryText }]}>{currentCategory}</Text>
          </TouchableOpacity>

          {/* CompletionNotification - Affichée seulement sur l'écran de transition */}
          <CompletionNotification
            visible={showNotification && currentCategory !== 'General' && isOnTransitionScreen}
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
            {circularPages.map((item: any, index: number) => (
              <View key={`page-${item?.id || index}-${index}`}>
                {item.type === 'transition' ? (
                  <CategoryTransitionScreen
                    title={item.title}
                    subtitle={item.subtitle}
                    nextCategories={item.nextCategories}
                    categoryName={currentCategory}
                    onContinue={handleTransitionContinue}
                    onDismiss={() => { }} // Pas d'action spéciale, le swipe gère la navigation
                  />
                ) : (
                  <DhikrContent
                    dhikr={item as Dhikr}
                    isFavorite={isFavorite(item?.uuid)}
                    onToggleFavorite={toggleFavorite}
                    theme={theme}
                    positionIndex={index}
                    categoryLength={categoryLength}
                  />
                )}
              </View>
            ))}
          </PagerView>

          <GoalCompleteModal
            visible={showGoalModal}
            onClose={handleCloseGoalModal}
            onShare={handleShareAchievement}
            khairisEarned={dailyGoal || undefined}
          />
        </View>
      </ScreenBackground>
    </PageTransitionWrapper>
  );
}

// Styles identiques à votre version précédente
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
    fontSize: 18,
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