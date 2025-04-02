import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function ActionButton({ label, onPress, disabled = false }: ActionButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        Platform.select({
          android: styles.buttonAndroid,
          ios: styles.buttonIOS,
        }),
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={Platform.select({
        ios: 0.6,
        android: 0.8,
        default: 0.7,
      })}
    >
      <Text style={[
        styles.buttonText,
        Platform.select({
          android: styles.buttonTextAndroid,
          ios: styles.buttonTextIOS,
        }),
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#8E1A3B',
    paddingVertical: Platform.select({
      ios: 16,
      android: 12,
      default: 16,
    }),
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonAndroid: {
    elevation: 4,
    borderRadius: 24,
  },
  buttonIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Sans-Medium',
    fontSize: Platform.select({
      ios: 16,
      android: 14,
      default: 16,
    }),
  },
  buttonTextAndroid: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonTextIOS: {
    letterSpacing: 0.5,
  },
});