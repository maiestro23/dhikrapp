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
import { CategoryCompleteModal } from '../../components/CategoryCompleteModal'; // Import du nouveau composant
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Dhikr } from '@/config/dhikrs';
import LoadingScreen from '@/components/LoadingScreen'; // Ajustez le chemin selon votre structure

const DhikrContent = ({ dhikr, isFavorite, onToggleFavorite, theme, positionIndex, categoryLength }: any) => (
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

      <Text style={styles.pageIndicator}>
        {positionIndex}/{categoryLength}
      </Text>
    </View>
  </View>
);

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // États pour la modal de catégorie complète
  const [showCategoryCompleteModal, setShowCategoryCompleteModal] = useState(false);
  const [completedCategoryName, setCompletedCategoryName] = useState('');

  // Compteur simple pour détecter les tours complets
  const [pagesVisitedInCurrentTour, setPagesVisitedInCurrentTour] = useState(0);
  const [tourCompletionCount, setTourCompletionCount] = useState(0);

  // Nouveau state pour tracker si la popup a déjà été montrée pour cette catégorie
  const [categoryPopupShown, setCategoryPopupShown] = useState(false);

  /*
  // États pour le LoadingScreen
  const [isLoading, setIsLoading] = useState(false);

  // Détection quand l'écran est focalisé (navigation vers cette page)
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      return () => {
        // Cleanup quand on quitte l'écran
        setIsLoading(false);
      };
    }, [])
  );

  const handleLoadingComplete = () => {
    // L'animation d'entrée est terminée
  };

  const handleFadeOutComplete = () => {
    // Le fade out est terminé, on peut masquer le loading
    setIsLoading(false);
  };
*/
  useEffect(() => {
    start();
    return () => {
      stop();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [start, stop]);

  const [pagerKey, setPagerKey] = useState(0);

  useEffect(() => {
    if (dhikrs && dhikrs.length > 0) {
      setPagerKey(prev => prev + 1);
      setCurrentIndex(1);
      // Réinitialiser les compteurs quand on change de catégorie
      setPagesVisitedInCurrentTour(0);
      setTourCompletionCount(0);
      // Réinitialiser le flag de popup pour la nouvelle catégorie
      setCategoryPopupShown(false);
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

  // Fonction pour vérifier si la catégorie est complète
  const showCategoryCompletePopup = useCallback(() => {
    // Vérifier si la popup a déjà été montrée pour cette catégorie
    if (categoryPopupShown) {
      console.log('🚫 Category popup already shown, skipping...');
      return;
    }

    // Obtenir le nom de la catégorie
    let categoryName = 'General';

    if (categoryUrl && categoryUrl === 'favourites') {
      categoryName = 'Favourites';
    } else {
      categoryName = dhikrs[0]?.category || 'General';
    }

    setCompletedCategoryName(categoryName);
    setShowCategoryCompleteModal(true);
    // Marquer que la popup a été montrée pour cette catégorie
    setCategoryPopupShown(true);

    console.log('🎉 Category Complete popup shown for:', categoryName);
  }, [dhikrs, categoryUrl, categoryPopupShown]);

  const handlePageSelected = useCallback((e: any) => {
    const index = e.nativeEvent.position;

    setCurrentIndex(index);

    // Logique existante pour le comptage et l'ajustement circulaire
    if (!isAdjustingPosition && index >= 1 && index <= dhikrs.length) {
      incrementCount();

      // Convertir l'index circulaire en index réel (0-based)
      const realPageIndex = index - 1;

      // Incrémenter le compteur de pages visitées
      setPagesVisitedInCurrentTour(prev => {
        const newCount = prev + 1;

        console.log(`📄 Page visited: ${realPageIndex + 1}/${dhikrs.length}, Total in tour: ${newCount}`);
        console.log(`📄 New count : ${newCount}`);

        // Vérifier si on a completé un tour (visité autant de pages que la longueur de la catégorie)
        if (newCount === dhikrs.length) {
          console.log('🔄 Tour completed! Checking if popup should be shown...');

          // Montrer la popup seulement si elle n'a pas encore été montrée
          if (!categoryPopupShown) {
            setTimeout(() => {
              showCategoryCompletePopup();
            }, 100);
          } else {
            console.log('🚫 Category popup already shown, skipping...');
          }

          // Incrémenter le compteur de tours et réinitialiser le compteur de pages
          setTourCompletionCount(prevTours => prevTours + 1);
          return 0; // Réinitialiser pour le prochain tour
        }

        return newCount;
      });
    }

    console.log('Page selected:', index, 'isAdjusting:', isAdjustingPosition, 'scrollState:', scrollState);

    const lastRealIndex = dhikrs.length;
    const lastFakeIndex = dhikrs.length + 1;

    if (!isAdjustingPosition && (index === 0 || index === lastFakeIndex)) {
      console.log('Triggering immediate adjustment for index:', index);
      setIsAdjustingPosition(true);

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
  }, [dhikrs.length, incrementCount, isAdjustingPosition, scrollState, showCategoryCompletePopup, categoryPopupShown]);

  const handleScrollStateChanged = useCallback((e: any) => {
    const state = e.nativeEvent.pageScrollState;
    setScrollState(state);
  }, []);

  // Fonction pour fermer la modal
  const handleCloseModal = useCallback(() => {
    setShowCategoryCompleteModal(false);
  }, []);

  /*
  // Afficher le LoadingScreen pendant le chargement
  if (isLoading) {
    return (
      <LoadingScreen 
        visible={isLoading} 
        onAnimationComplete={handleLoadingComplete}
        onFadeOutComplete={handleFadeOutComplete}
        category={dhikrs[0].category}
      />
    );
  }
*/
  if (!dhikrs || dhikrs.length === 0) {
    return (
      <ScreenBackground>
        <View style={[styles.container, styles.loadingContainer]}>
          <Text style={[styles.noFavouriteTitle, { color: theme.colors.text.primary }]}>
            No favourites yet?
          </Text>
          <Text style={styles.loadingText}>Tap the heart 🤍 on any adhkar to start</Text>
          <Text style={styles.loadingText}>building your own custom playlist.</Text>
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
    <ScreenBackground>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <Text style={styles.greeting}>Assalamu Alaikum</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>

          <View style={styles.rightHeader}>
            <Text style={styles.goalText}>Dhikr Goal: {Math.min(Math.round(goalProgress), 100)}%</Text>
            <Text style={styles.khairisText}>Khairis: {todayProgress >= 1000 ? `${(todayProgress / 1000).toFixed(1)}k` : todayProgress}✨</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.categoryTag}
          onPress={handleCategoryPress}
          activeOpacity={0.7}
        >
          <Text style={styles.categoryText}>{currentCategory}</Text>
        </TouchableOpacity>

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

        {/* Modal de catégorie complète */}
        <CategoryCompleteModal
          visible={showCategoryCompleteModal}
          onClose={handleCloseModal}
          categoryName={completedCategoryName}
          khairisEarned={categoryLength} // Vous pouvez ajuster la logique des Khairis earned
        />
      </View>
    </ScreenBackground>
  );
}

// Les styles restent identiques
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
    fontSize: 32,
    color: '#181818',
    marginBottom: 22
  },
  noFavbutton: {
    width: '100%',
    height: 42,
    maxWidth: 252,
    backgroundColor: '#7E0F3B',
    borderRadius: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  noFavButtonText: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 18,
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
    fontSize: 13,
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