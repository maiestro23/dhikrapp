import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BookLine } from '../components/BookLine';
import { useProgressStore } from '@/stores/progressStore';
import CustomBookImage from '@/assets/images/customBookImage';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

const { width, height } = Dimensions.get('window');
const CONTENT_PADDING = 24;
const CONTENT_WIDTH = Math.min(402, width - (CONTENT_PADDING * 2));
const isSmallDevice = height <= 667;

export default function SplashScreen() {
  const [showLoading, setShowLoading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const { dailyGoal } = useProgressStore();

  const handleGetStarted = () => {
    router.replace('/instructions');
  };

  const handleLoadingComplete = () => {
    setLoadingComplete(true);
  };

  const handleLoadingFadeOut = () => {
    setShowLoading(false);
    
    // Si dailyGoal existe, rediriger vers les tabs
    if (dailyGoal) {
      router.replace('/(tabs)');
    }
  };

  // Si dailyGoal existe et le loading est terminé, rediriger immédiatement
  if (dailyGoal && !showLoading) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <>
      {/* Afficher le contenu seulement pour la première utilisation ET après le loading */}
      {!dailyGoal && !showLoading && (
        <LinearGradient
          colors={['rgb(240,244,234)', 'rgb(251,248,244)', 'rgb(251,240,238)']}
          locations={[0.158, 0.5112, 0.8644]}
          start={[0, 1]} end={[1, 0]}
          style={styles.container}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={[
              styles.content,
              isSmallDevice && styles.noPadding,
              { width: CONTENT_WIDTH }
            ]}>
              <View style={styles.quoteContainer}>
                <Text style={styles.quote}>"Verily, in the remembrance of Allah do hearts find rest."</Text>
                <Text style={styles.quote}></Text>
                <Text style={styles.quote}></Text>
                <View style={styles.referenceContainer}>
                  <Text style={styles.reference}>(13:28)</Text>
                </View>
              </View>

              <View style={styles.imageContainer}>
                <CustomBookImage />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleGetStarted}
              >
                <Text style={styles.buttonText}>Get started</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      )}

      <LoadingScreen
        visible={showLoading}
        category="Dhikr"
        onAnimationComplete={handleLoadingComplete}
        onFadeOutComplete={handleLoadingFadeOut}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: 102,
    paddingBottom: 34,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noPadding: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  quoteContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: 20,
  },
  quote: {
    fontFamily: 'Classico',
    fontSize: 28,
    lineHeight: 38,
    color: '#181818',
    textAlign: 'center',
  },
  referenceContainer: {
    marginTop: 16,
    paddingVertical: 4,
  },
  reference: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 18,
    lineHeight: 22,
    color: '#8C8F7B',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 50,
  },
  button: {
    width: '100%',
    height: 59,
    maxWidth: 182,
    minWidth: 182,
    backgroundColor: '#7E0F3B',
    borderRadius: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 40 : 32,
  },
  buttonText: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 18,
    lineHeight: 26,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});