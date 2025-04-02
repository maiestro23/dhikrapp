import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenBackground } from '../../components/ScreenBackground';
import { DhikrReader } from '../../components/DhikrReader';
import { useTheme } from '../../context/ThemeContext';
import { useProgressStore } from '../../stores/progressStore';
import { useDhikrStore } from '../../stores/dhikrStore';
import { useState } from 'react';

export default function DhikrScreen() {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { dailyGoal } = useProgressStore();
  const { dhikrs } = useDhikrStore();
  
  const handleNext = () => {
    if (currentIndex < (dailyGoal || 0) - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (!dailyGoal) {
    return (
      <ScreenBackground>
        <View style={styles.content}>
          <Text style={[styles.noGoalTitle, { color: theme.colors.text.primary }]}>
            Set Your Daily Goal
          </Text>
          <Text style={[styles.noGoalText, { color: theme.colors.text.secondary }]}>
            Please set your daily dhikr goal to begin
          </Text>
          <TouchableOpacity
            style={[styles.setGoalButton, { backgroundColor: theme.colors.accent }]}
            onPress={() => router.push('/profile/goal')}
          >
            <Text style={styles.setGoalButtonText}>Set Goal</Text>
          </TouchableOpacity>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <DhikrReader
        onNext={handleNext}
        onPrevious={handlePrevious}
        currentIndex={currentIndex}
        totalCount={dailyGoal}
        theme={theme}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  noGoalTitle: {
    fontFamily: 'Serif',
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  noGoalText: {
    fontFamily: 'Sans',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  setGoalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  setGoalButtonText: {
    fontFamily: 'Sans-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});