import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type OptionCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
};

export function OptionCard({ icon, title, description, isActive }: OptionCardProps) {
  return (
    <View style={[styles.container, isActive && styles.activeContainer]}>
      <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
        {icon}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, isActive && styles.activeTitle]}>{title}</Text>
        <Text style={[styles.description, isActive && styles.activeDescription]}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  activeContainer: {
    borderColor: '#8E1A3B',
    backgroundColor: 'rgba(142, 26, 59, 0.05)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F7F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(142, 26, 59, 0.1)',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Sans-Medium',
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  activeTitle: {
    color: '#8E1A3B',
  },
  description: {
    fontFamily: 'Sans',
    fontSize: 14,
    color: '#666666',
  },
  activeDescription: {
    color: '#8E1A3B',
  },
});