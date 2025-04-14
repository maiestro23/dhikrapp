import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BookLine } from '../components/BookLine';
import { useProgressStore } from '@/stores/progressStore';
import CustomBookImage from '@/assets/images/customBookImage';

const { width } = Dimensions.get('window');
const CONTENT_PADDING = 24;
const CONTENT_WIDTH = Math.min(402, width - (CONTENT_PADDING * 2));

export default function SplashScreen() {
  const handleGetStarted = () => {
    router.replace('/instructions');
  };

  const { dailyGoal } = useProgressStore();
/*
  if (dailyGoal) {
    Redirect({ href: '/(tabs)' });
    return null;
  }
*/

  return (
    <LinearGradient
      colors={['rgb(240,244,234)', 'rgb(251,248,244)', 'rgb(251,240,238)']}
      locations={[0.158, 0.5112, 0.8644]}
      start={[0, 1]} end={[1, 0]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, { width: CONTENT_WIDTH }]}>
          <View style={styles.quoteContainer}>
            <Text style={styles.quote}>"Verily, in the</Text>
            <Text style={styles.quote}>remembrance of Allah</Text>
            <Text style={styles.quote}>do hearts find rest."</Text>
            <View style={styles.referenceContainer}>
              <Text style={styles.reference}>(13:28)</Text>
            </View>
          </View>

          <View style={styles.imageContainer}>
            <CustomBookImage/>
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