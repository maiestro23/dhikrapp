import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowUp } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CONTENT_PADDING = 24;
const CONTENT_WIDTH = Math.min(402, width - (CONTENT_PADDING * 2));

export default function InstructionsScreen() {
  const handleNext = () => {
    router.push('/goal-selection');
  };

  return (
    <LinearGradient
      colors={['rgb(240,244,234)', 'rgb(251,248,244)', 'rgb(251,240,238)']}
      locations={[0.158, 0.5112, 0.8644]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, { width: CONTENT_WIDTH }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Swipe up or tap</Text>
            <Text style={styles.subtitle}>
              Swipe up or tap through to read your daily adhkar
            </Text>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.arabicText}>الحمد لله</Text>
                <Text style={styles.transliteration}>Alhamdulillah</Text>
                <Text style={styles.translation}>(All praise is due to Allah)</Text>
              </View>
            </View>
            <View style={styles.gestureContainer}>
              <ArrowUp color="#7E0F3B" size={24} />
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>Next</Text>
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
  header: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Classico',
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
    color: '#181818',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Sofia-Pro-Light',
    //fontSize: 18,
    lineHeight: 18,
    textAlign: 'center',
    color: '#8C8F7B',
  },
  cardContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 325,
    height: 325,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backgroundBlendMode: 'hard-light',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E8EBD8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardContent: {
    alignItems: 'center',
    gap: 16,
  },
  arabicText: {
    fontFamily: 'NotoNaskhArabic',
    fontSize: 32,
    lineHeight: 48,
    textAlign: 'center',
    color: '#181818',
  },
  transliteration: {
    fontFamily: 'Classico',
    fontSize: 34,
    lineHeight: 42,
    textAlign: 'center',
    color: '#181818',
  },
  translation: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 18,
    lineHeight: 18,
    textAlign: 'center',
    color: '#8C8F7B',
  },
  gestureContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(126, 15, 59, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    //width: '100%',
    maxWidth: 182,
    minWidth: 182,
    height: 59,
    backgroundColor: '#7E0F3B',
    borderRadius: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 18,
    lineHeight: 26,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});