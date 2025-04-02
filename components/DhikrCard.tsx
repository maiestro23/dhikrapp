import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type DhikrCardProps = {
  arabicText: string;
  transliteration: string;
  translation: string;
};

export function DhikrCard({ arabicText, transliteration, translation }: DhikrCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.arabicText}>{arabicText}</Text>
      <Text style={styles.transliteration}>{transliteration}</Text>
      <Text style={styles.translation}>{translation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  arabicText: {
    fontFamily: 'NotoNaskhArabic',
    fontSize: 32,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  transliteration: {
    fontFamily: 'Taviraj-ExtraLight',
    fontSize: 24,
    color: '#1A1A1A',
  },
  translation: {
    fontFamily: 'Sans',
    fontSize: 16,
    color: '#666666',
  },
});