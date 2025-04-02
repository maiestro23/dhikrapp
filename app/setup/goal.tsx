import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useProgressStore } from '../../stores/progressStore';
import { LinearGradient } from 'expo-linear-gradient';

const goalOptions = [
  { count: 100, time: '2 mins a day' },
  { count: 500, time: '10 mins a day' },
  { count: 1000, time: '20 mins a day' },
  { count: 3000, time: '60 mins a day' },
];

export default function GoalSetting() {
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [customGoal, setCustomGoal] = useState('');
  const { setDailyGoal } = useProgressStore();

  const handleContinue = () => {
    const goal = customGoal ? parseInt(customGoal, 10) : selectedGoal;
    if (goal) {
      setDailyGoal(goal);
      router.push('/setup/language');
    }
  };

  return (
    <LinearGradient
      colors={['rgb(240,244,234)', 'rgb(251,248,244)', 'rgb(251,240,238)']}
      locations={[0.158, 0.5112, 0.8644]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>
            How much adhkar do you want to read per day?
          </Text>
          <Text style={styles.subtitle}>
            You can change your goal later
          </Text>

          <View style={styles.goalGrid}>
            {goalOptions.map((option, index) => {
              const isLeftColumn = index % 2 === 0;
              const isTopRow = index < 2;
              return (
                <TouchableOpacity
                  key={option.count}
                  style={[
                    styles.goalCard,
                    {
                      left: isLeftColumn ? 39 : 213,
                      top: isTopRow ? 236 : 417,
                    },
                    selectedGoal === option.count && styles.selectedGoalCard
                  ]}
                  onPress={() => setSelectedGoal(option.count)}
                >
                  <View style={styles.goalContent}>
                    <Text style={[
                      styles.goalNumber,
                      selectedGoal === option.count && styles.selectedText
                    ]}>
                      {option.count}
                    </Text>
                    <Text style={styles.goalLabel}>adhkar</Text>
                    <Text style={styles.goalTime}>({option.time})</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.customInputContainer}>
            <Text style={styles.customInputLabel}>Enter Custom Adhkar</Text>
            <TextInput
              style={styles.customInput}
              value={customGoal}
              onChangeText={setCustomGoal}
              placeholder="15000"
              placeholderTextColor="rgba(126, 15, 59, 0.1)"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.button,
              (!selectedGoal && !customGoal) && styles.buttonDisabled
            ]} 
            onPress={handleContinue}
            disabled={!selectedGoal && !customGoal}
          >
            <Text style={styles.buttonText}>Bismillah</Text>
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
    position: 'relative',
  },
  title: {
    width: 321,
    height: 88,
    left: 'calc(50% - 321px/2)',
    top: 102,
    fontFamily: 'Classico',
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
    color: '#181818',
  },
  subtitle: {
    width: 321,
    height: 18,
    left: 'calc(50% - 321px/2)',
    top: 198,
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 18,
    lineHeight: 18,
    textAlign: 'center',
    color: '#8C8F7B',
  },
  goalGrid: {
    position: 'relative',
    width: '100%',
    height: 339,
  },
  goalCard: {
    position: 'absolute',
    width: 151,
    height: 158,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backgroundBlendMode: 'hard-light',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E8EBD8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedGoalCard: {
    borderColor: '#7E0F3B',
    borderWidth: 2,
  },
  goalContent: {
    alignItems: 'center',
    gap: 6,
  },
  goalNumber: {
    fontFamily: 'Sofia-Pro',
    fontSize: 50,
    lineHeight: 51,
    textAlign: 'center',
    letterSpacing: -1,
    color: '#7E0F3B',
  },
  selectedText: {
    color: '#7E0F3B',
  },
  goalLabel: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 18,
    lineHeight: 18,
    textAlign: 'center',
    color: '#8C8F7B',
  },
  goalTime: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 12,
    lineHeight: 14,
    textAlign: 'center',
    color: '#BABFAD',
  },
  customInputContainer: {
    position: 'absolute',
    width: 325,
    height: 117,
    left: 39,
    top: 598,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backgroundBlendMode: 'hard-light',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8EBD8',
    alignItems: 'center',
    paddingTop: 21,
  },
  customInputLabel: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 18,
    lineHeight: 18,
    color: '#8C8F7B',
    marginBottom: 11,
  },
  customInput: {
    fontFamily: 'Sofia-Pro',
    fontSize: 50,
    lineHeight: 51,
    color: '#7E0F3B',
    letterSpacing: -1,
    textAlign: 'center',
    width: '100%',
  },
  button: {
    position: 'absolute',
    width: 337,
    height: 59,
    left: 33,
    bottom: 34,
    backgroundColor: '#7E0F3B',
    borderRadius: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'Sofia-Pro',
    fontSize: 22,
    lineHeight: 26,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});