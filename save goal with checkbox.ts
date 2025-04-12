import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useProgressStore } from '../stores/progressStore';
import { Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';


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
  const { setDailyGoal } = useProgressStore();

  const handleGoalSelect = (count: number) => {
    setSelectedGoal(count);
    setCustomGoal('');
    setError(null);
  };

  const handleCustomGoalChange = (text: string) => {
    // Only allow numbers
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
    router.push('/(tabs)');
  };

  return (

    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
                <LinearGradient
          colors={['rgb(240,244,234)', 'rgb(251,248,244)', 'rgb(251,240,238)']}
          locations={[0.158, 0.5112, 0.8644]}
          style={styles.container}
        >

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>How much adhkar do you want to read per day?</Text>
            <Text style={styles.subtitle}>You can change your goal later</Text>
          </View>

          <View style={styles.goalsGrid}>
            {goalOptions.map((option) => (
              <TouchableOpacity
                key={option.count}
                style={[
                  styles.goalCard,
                  selectedGoal === option.count && styles.selectedGoal
                ]}
                onPress={() => handleGoalSelect(option.count)}
              >
                <Text style={[
                  styles.goalCount,
                  selectedGoal === option.count && styles.selectedText
                ]}>
                  {option.count}
                </Text>
                <Text style={[
                  styles.goalLabel,
                  selectedGoal === option.count && styles.selectedText
                ]}>
                  adhkar
                </Text>
                <Text style={[
                  styles.goalTime,
                  selectedGoal === option.count && styles.selectedText
                ]}>
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
                  customGoal.length > 0 && styles.customInputActive
                ]}
                value={customGoal}
                onChangeText={handleCustomGoalChange}
                placeholder="15000"
                placeholderTextColor="rgba(142, 26, 59, 0.3)"
                keyboardType="number-pad"
                maxLength={5}
                returnKeyType="done"
                onSubmitEditing={validateAndStart}
              />
               {Platform.OS !== 'web' && customGoal ? (
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={validateAndStart}
                >
                  <Check color="#FFFFFF" size={20} />
                </TouchableOpacity>
              ) : null}
            </View>
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>

          <TouchableOpacity 
            style={[
              styles.button,
              (!selectedGoal && !customGoal) && styles.buttonDisabled
            ]} 
            onPress={validateAndStart}
            disabled={!selectedGoal && !customGoal}
          >
            <Text style={styles.buttonText}>Bismillah</Text>
          </TouchableOpacity>
        </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
