import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '../../components/ActionButton';
import { useState } from 'react';
import { Minus, Plus, Sun, Moon } from 'lucide-react-native';

export default function NotificationSetting() {
  const [count, setCount] = useState(10);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('22:00');

  const increaseCount = () => {
    setCount(prev => prev + 1);
  };

  const decreaseCount = () => {
    if (count > 1) {
      setCount(prev => prev - 1);
    }
  };

  const handleContinue = () => {
    // In a real app, we would save these settings
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Set your daily sessions and total adhkar</Text>
          <Text style={styles.subtitle}>We will notify you when its time for morning/evening adhkar</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.quoteContainer}>
            <Text style={styles.quote}>Alhamdulillah, It's never too late to give up x</Text>
          </View>

          <View style={styles.counterContainer}>
            <TouchableOpacity 
              style={styles.counterButton} 
              onPress={decreaseCount}
            >
              <Minus color="#8E1A3B" size={20} />
            </TouchableOpacity>
            
            <View style={styles.countDisplay}>
              <Text style={styles.countText}>{count}x</Text>
              <Text style={styles.countLabel}>daily adhkar</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.counterButton} 
              onPress={increaseCount}
            >
              <Plus color="#8E1A3B" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.timeSettings}>
            <View style={styles.timeOption}>
              <View style={styles.timeIconContainer}>
                <Sun color="#8E1A3B" size={20} />
              </View>
              <Text style={styles.timeLabel}>Start at</Text>
              <View style={styles.timeSelector}>
                <Text style={styles.timeValue}>{startTime}</Text>
              </View>
            </View>

            <View style={styles.timeOption}>
              <View style={styles.timeIconContainer}>
                <Moon color="#8E1A3B" size={20} />
              </View>
              <Text style={styles.timeLabel}>End at</Text>
              <View style={styles.timeSelector}>
                <Text style={styles.timeValue}>{endTime}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <ActionButton 
            label="Allow and Continue" 
            onPress={handleContinue}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F2',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Serif',
    fontSize: 22,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Sans',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 32,
  },
  quoteContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  quote: {
    fontFamily: 'Serif',
    fontSize: 18,
    color: '#1A1A1A',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(142, 26, 59, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countDisplay: {
    alignItems: 'center',
  },
  countText: {
    fontFamily: 'Serif-Bold',
    fontSize: 24,
    color: '#8E1A3B',
  },
  countLabel: {
    fontFamily: 'Sans',
    fontSize: 14,
    color: '#666666',
  },
  timeSettings: {
    gap: 16,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(142, 26, 59, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeLabel: {
    fontFamily: 'Sans-Medium',
    fontSize: 16,
    color: '#1A1A1A',
    width: 60,
  },
  timeSelector: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  timeValue: {
    fontFamily: 'Sans',
    fontSize: 16,
    color: '#1A1A1A',
  },
  footer: {
    alignItems: 'center',
  },
});