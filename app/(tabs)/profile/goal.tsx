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
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const goalOptions = [
  { count: 100, time: '2 mins a day' },
  { count: 500, time: '10 mins a day' },
  { count: 1000, time: '20 mins a day' },
  { count: 3000, time: '60 mins a day' },
];

export default function GoalSelectionScreen() {
  const [customGoal, setCustomGoal] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setDailyGoal, dailyGoal } = useProgressStore();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.replace('/profile');
  };

  const handleGoalSelect = (count: number) => {
    setSelectedGoal(count);
    setCustomGoal('');
    setError(null);
  };

  const handleCustomGoalChange = (text: string) => {
    if (text === '' || /^\d+$/.test(text)) {
      setCustomGoal(text);
      setSelectedGoal(null);
      setError(null);
    }
  };

  const validateAndStart = () => {
    const goal = selectedGoal || (customGoal ? parseInt(customGoal, 10) : null);

    if (!goal) {
      setError('Please select or enter a goal');
      return;
    }

    if (goal <= 0) {
      setError('Goal must be greater than 0');
      return;
    }

    if (goal > 10000) {
      setError('Goal cannot exceed 10,000');
      return;
    }

    setDailyGoal(goal);
    router.replace('/profile');
  };

  return (
    <LinearGradient
      colors={['rgb(240,244,234)', 'rgb(251,248,244)', 'rgb(251,240,238)']}
      locations={[0.158, 0.5112, 0.8644]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 140 } // ⬅️ Padded to avoid tab bar
          ]}
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.content}>
            {/* 
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft color={theme.colors.text.primary} size={24} />
            </TouchableOpacity>
              */}
            <View style={styles.header}>
              <Text style={styles.title}>
                Daily Goal
              </Text>
              <Text style={styles.currentDailyGoal}>
                Your current goal is: {dailyGoal}
              </Text>
            </View>

            <View style={styles.goalsGrid}>
              {goalOptions.map((option) => (
                <TouchableOpacity
                  key={option.count}
                  style={[
                    styles.goalCard,
                    selectedGoal === option.count && styles.selectedGoal,
                  ]}
                  onPress={() => handleGoalSelect(option.count)}
                >
                  <Text
                    style={[
                      styles.goalCount,
                      selectedGoal === option.count && styles.selectedText,
                    ]}
                  >
                    {option.count}
                  </Text>
                  <Text
                    style={[
                      styles.goalLabel,
                      selectedGoal === option.count && styles.selectedText,
                    ]}
                  >
                    adhkar
                  </Text>
                  <Text
                    style={[
                      styles.goalTime,
                      selectedGoal === option.count && styles.selectedText,
                    ]}
                  >
                    ({option.time})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.customInputContainer}>
              <Text style={styles.customInputLabel}>Enter Custom Adhkar</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.customInput,
                    customGoal.length > 0 && styles.customInputActive,
                  ]}
                  value={customGoal}
                  onChangeText={handleCustomGoalChange}
                  placeholder="|5000"
                  placeholderTextColor="rgba(142, 26, 59, 0.3)"
                  keyboardType="number-pad"
                  maxLength={5}
                  returnKeyType="done"
                  onSubmitEditing={validateAndStart}
                />
              </View>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                !selectedGoal && !customGoal && styles.buttonDisabled,
              ]}
              onPress={validateAndStart}
              disabled={!selectedGoal && !customGoal}
            >
              <Text style={styles.buttonText}>Bismillah</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#F8F7F2',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 68,
    paddingBottom: 34,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  title: {
    fontFamily: 'Classico',
    fontSize: 24,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
    padding: 20,
  },
  subtitle: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    paddingBottom: 10,
  },

  currentDailyGoal: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 16,
    color: '#6F7C50',
    opacity: 0.5,
    textAlign: 'center',
    paddingBottom: 10,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    //marginBottom: 10,
  },

  goalCard: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#EEEEEE',
  },

  selectedGoal: {
    borderColor: '#8E1A3B',
    borderWidth: 2,
    aspectRatio: 1,
    padding: 20,
  },

  goalCount: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 36,
    color: '#8E1A3B',
    marginBottom: 4,
  },

  goalLabel: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },

  goalTime: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 12,
    color: '#999999',
  },

  selectedText: {
    color: '#8E1A3B',
  },

  customInputContainer: {
    marginBottom: 24,
  },

  customInputLabel: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 18,
    color: '#666666',
    marginBottom: 8,
    textAlign: 'center',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    //gap: 8,
  },
  customInput: {
    flex: 1,
    height: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(142, 26, 59, 0.1)',
    paddingHorizontal: 20,
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 32,
    color: '#8E1A3B',
    textAlign: 'center',
  },
  customInputActive: {
    borderColor: '#8E1A3B',
  },
  submitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8E1A3B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Sans',
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    maxWidth: 182,
    minWidth: 182,
    height: 59,
    backgroundColor: '#7E0F3B',
    borderRadius: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginHorizontal: 'auto'
  },
  buttonText: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 18,
    lineHeight: 26,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },

  backButton: {
    padding: 4,
  },
});