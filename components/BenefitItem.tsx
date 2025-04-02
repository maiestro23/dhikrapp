import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type BenefitItemProps = {
  icon: React.ReactNode;
  text: string;
};

export function BenefitItem({ icon, text }: BenefitItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(142, 26, 59, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Sans-Medium',
    fontSize: 16,
    color: '#1A1A1A',
    flex: 1,
  },
});