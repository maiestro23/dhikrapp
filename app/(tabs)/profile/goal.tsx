 import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useProgressStore } from '@/stores/progressStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenBackground } from '@/components/ScreenBackground';
import { ChevronLeft } from 'lucide-react-native';
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';

const goalOptions = [
  { count: 100, time: '3 mins a day' },
  { count: 300, time: '10 mins a day' },
  { count: 1000, time: '30 mins a day' },
  { count: 3000, time: '90 mins a day' },
];

export default function GoalSelectionScreen() {
  const [customGoal, setCustomGoal] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setDailyGoal, dailyGoal } = useProgressStore();
  const { theme, isDarkBackground } = useTheme();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.replace('/profile');
  };

  const handleGoalSelect = (count: number) => {
    setSelectedGoal(count);
    setCustomGoal('');
    setError(null);

    // Mettre à jour immédiatement le goal
    setDailyGoal(count);
  };


  const handleCustomGoalChange = (text: string) => {
    if (text === '' || /^\d+$/.test(text)) {
      setCustomGoal(text);
      setSelectedGoal(null);
      setError(null);
    }
  };

  const handleCustomGoalSubmit = () => {
    if (customGoal && customGoal.trim() !== '') {
      const goal = parseInt(customGoal, 10);

      if (goal <= 0) {
        setError('Goal must be greater than 0');
        return;
      }

      if (goal > 10000) {
        setError('Goal cannot exceed 10,000');
        return;
      }

      // Mettre à jour le goal custom
      setDailyGoal(goal);
      setSelectedGoal(null);
      setError(null);
    }
  };

  return (
    <PageTransitionWrapper animationType="slide" duration={300}>
      <ScreenBackground>
        {isDarkBackground && (
          <LinearGradient
            colors={['#6B1A3A', '#4A1629', '#2D0E1A']}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        )}

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header avec bouton retour */}


          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ChevronLeft size={24} color={isDarkBackground ? '#FFFFFF' : '#181818'} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: isDarkBackground ? '#FFFFFF' : '#181818' }]}>
              Daily Goal
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 140 }
            ]}
            keyboardShouldPersistTaps="handled"
          >

            <View style={styles.content}>
              {/* Current Goal Badge */}
              <LinearGradient
                colors={isDarkBackground ?
                  ['#F5F4E4', '#FFD7DF'] :
                  ['#F5F4E4', '#FFD7DF']
                }
                locations={[0.1541, 0.829]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={styles.currentGoalContainer}
              >
                <Text style={styles.currentGoalLabel}>Your Current Goal:</Text>
                <View style={styles.currentGoalBadge}>
                  <Text style={styles.currentGoalValue}>{dailyGoal}</Text>
                </View>
              </LinearGradient>

              {/* Goals Grid */}
              <View style={styles.goalsGrid}>
                {goalOptions.map((option) => {
                  const isSelected = selectedGoal === option.count;

                  return (
                    <TouchableOpacity
                      key={option.count}
                      style={[
                        styles.goalCard,
                        {
                          backgroundColor: isDarkBackground ? '#7E0F3B' : '#FFFFFF',
                          borderColor: isSelected ? (isDarkBackground ? '#FFFFFF' : '#8B1538') : (isDarkBackground ? '#8B1538' : '#E8EBD8'),
                          borderWidth: isSelected ? 2 : 2
                        }
                      ]}
                      onPress={() => handleGoalSelect(option.count)}
                    >
                      <Text
                        style={[
                          styles.goalCount,
                          {
                            color: isDarkBackground ? '#FFFFFF' : '#8B1538'
                          }
                        ]}
                      >
                        {option.count}
                      </Text>
                      <Text
                        style={[
                          styles.goalLabel,
                          {
                            color: isDarkBackground ? 'rgba(255, 255, 255, 0.8)' : '#8C8F7B'
                          }
                        ]}
                      >
                        adhkar
                      </Text>
                      <Text
                        style={[
                          styles.goalTime,
                          {
                            color: isDarkBackground ? 'rgba(255, 255, 255, 0.6)' : '#8C8F7B'
                          }
                        ]}
                      >
                        ({option.time})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Custom Goal Section */}
              <View style={styles.customInputContainer}>
                <Text style={[
                  styles.customInputLabel,
                  { color: isDarkBackground ? 'rgba(255, 255, 255, 0.8)' : '#8C8F7B' }
                ]}>
                  Enter Custom Goal:
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[
                      styles.customInput,
                      {
                        backgroundColor: isDarkBackground ? '#FBF0EE' : '#FFFFFF',
                        borderColor: customGoal.length > 0 ? '#8B1538' : '#FFFFFF',
                        color: isDarkBackground ? '#7E0F3B' : '#8B1538'
                      }
                    ]}
                    value={customGoal}
                    onChangeText={handleCustomGoalChange}
                    placeholder="|5000"
                    placeholderTextColor={isDarkBackground ? '#F0E2E5' : '#F0E2E5'}
                    keyboardType="number-pad"
                    maxLength={5}
                    returnKeyType="done"
                    onSubmitEditing={handleCustomGoalSubmit}
                    onBlur={handleCustomGoalSubmit}
                  />
                </View>
                {error && <Text style={styles.errorText}>{error}</Text>}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenBackground>
    </PageTransitionWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,

  },
  currentGoalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#fff"

  },
  currentGoalLabel: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 20,
    color: '#8B1538',
  },
  currentGoalBadge: {
    backgroundColor: '#8B1538',
    paddingHorizontal: 16,
    //paddingVertical: 8,
    borderRadius: 12,

  },
  currentGoalValue: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 26,
    color: '#FFFFFF',
    paddingVertical: 6,
    //fontWeight: '600',
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  goalCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',

  },
  goalCount: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 4,
  },
  goalLabel: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 18,
    marginBottom: 2,
  },
  goalTime: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 14,
  },
  customInputContainer: {
    marginBottom: 40,
  },
  customInputLabel: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customInput: {
    flex: 1,
    height: 70,
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 20,
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 50,
    textAlign: 'center',
    fontWeight: '600',
  },
  errorText: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 8,
  },
});