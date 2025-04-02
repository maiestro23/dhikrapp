import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionButton } from '../../components/ActionButton';
import { useState } from 'react';
import { Check } from 'lucide-react-native';

type LanguageOption = {
  id: string;
  name: string;
  example: string;
};

const languageOptions: LanguageOption[] = [
  { id: 'english', name: 'English', example: '(Praise be to God)' },
  { id: 'arabic', name: 'Arabic', example: '(الحمد لله)' },
  { id: 'transliteration', name: 'Transliteration', example: '(Alhamdulillah)' },
];

export default function LanguageSelection() {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['english', 'transliteration']);

  const toggleLanguage = (id: string) => {
    if (selectedLanguages.includes(id)) {
      // Don't allow deselecting if it's the last selected language
      if (selectedLanguages.length > 1) {
        setSelectedLanguages(selectedLanguages.filter(langId => langId !== id));
      }
    } else {
      setSelectedLanguages([...selectedLanguages, id]);
    }
  };

  const handleContinue = () => {
    router.push('/setup/notifications');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Select dhikr languages</Text>
          <Text style={styles.subtitle}>You can select multiple and change later in settings</Text>
        </View>

        <View style={styles.mainContent}>
          {languageOptions.map((language) => {
            const isSelected = selectedLanguages.includes(language.id);
            return (
              <TouchableOpacity
                key={language.id}
                style={styles.languageOption}
                onPress={() => toggleLanguage(language.id)}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>
                    {language.name} <Text style={styles.languageExample}>{language.example}</Text>
                  </Text>
                </View>
                <View style={[
                  styles.checkCircle,
                  isSelected ? styles.selectedCheckCircle : styles.unselectedCheckCircle
                ]}>
                  {isSelected && <Check color="#FFFFFF" size={16} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <ActionButton 
            label="Continue" 
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
    gap: 16,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontFamily: 'Sans-Medium',
    fontSize: 16,
    color: '#1A1A1A',
  },
  languageExample: {
    fontFamily: 'Sans',
    fontSize: 14,
    color: '#666666',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckCircle: {
    backgroundColor: '#8E1A3B',
  },
  unselectedCheckCircle: {
    backgroundColor: '#EEEEEE',
  },
  footer: {
    alignItems: 'center',
  },
});