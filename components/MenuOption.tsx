import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Theme } from '../context/ThemeContext';

type MenuOptionProps = {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  theme: Theme;
};

export function MenuOption({ icon, title, onPress, theme }: MenuOptionProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        }
      ]} 
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.background }]}>
        {icon}
      </View>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>{title}</Text>
      <ChevronRight color={theme.colors.text.secondary} size={20} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontFamily: 'Sans-Medium',
    fontSize: 16,
    flex: 1,
  },
});