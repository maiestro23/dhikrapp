import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

interface CompletionNotificationProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: string;
  duration?: number;
  backgroundColor?: string;
}

export const CompletionNotification: React.FC<CompletionNotificationProps> = ({
  visible,
  onClose,
  title = "Category Complete!",
  subtitle = "+25 Khairis earned ✨",
  icon = "🎉",
  duration = 3000,
  backgroundColor = "#7E0F3B"
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -50,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start(() => {
          onClose();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim, slideAnim, onClose, duration]);

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.notificationContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
      pointerEvents="none"
    >
      <View style={[styles.notificationContent, { backgroundColor }]}>
        <View style={styles.notificationIcon}>
          <Text style={styles.notificationIconText}>{icon}</Text>
        </View>
        <View style={styles.notificationTextContainer}>
          <Text style={styles.notificationTitle}>{title}</Text>
          <Text style={styles.notificationSubtitle}>{subtitle}</Text>
        </View>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}

        >
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    zIndex: 10,
    alignItems: 'center',
  },
  notificationContent: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: 300,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationIconText: {
    fontSize: 16,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  notificationSubtitle: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  closeButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 20,
    fontWeight: 'bold',
  },
});