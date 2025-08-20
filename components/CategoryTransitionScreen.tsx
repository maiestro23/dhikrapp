import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

interface CategoryTransitionScreenProps {
  title: string;
  subtitle: string;
  nextCategories: string[];
  categoryName: string;
  onContinue: () => void;
  onDismiss: () => void;
  onCategorySelect?: (categoryId: string) => void;
}

export const CategoryTransitionScreen: React.FC<CategoryTransitionScreenProps> = ({
  title,
  subtitle,
  nextCategories,
  categoryName,
  onContinue,
  onDismiss,
  onCategorySelect
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Titre principal */}
        <Text style={[styles.title, { color: theme.colors.text.secondary }]}>
          {title}
        </Text>

        {/* Sous-titre */}
        <Text style={[styles.subtitle, { color: theme.colors.text.primary }]}>
          {subtitle}
        </Text>

        {/* Bouton partager */}
        <LinearGradient
          colors={["#A21245", "#5D0424"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.continueButton}
        >
          {/* Bouton Continue */}
          <TouchableOpacity
            onPress={onContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Texte "Swipe to dismiss" - informatif seulement */}
        <Text style={[styles.dismissText, { color: theme.colors.text.primary }]}>
          Swipe to dismiss
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 350,
    width: '100%',
  },
  title: {
    fontFamily: 'Classico',
    fontSize: 32,
    lineHeight: 40,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 48,
    opacity: 0.8,
  },
  continueButton: {
    width: 200,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 44,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonText: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dismissText: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 14,
    opacity: 0.6,
  },
});