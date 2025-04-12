import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function TermsScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const handleBack = () => {
    router.replace('/profile');
  };  

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft color={theme.colors.text.primary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Terms of Service</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.date, { color: theme.colors.text.secondary }]}>
            Effective Date: 19/03/2025
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Introduction
          </Text>
          <Text style={[styles.text, { color: theme.colors.text.secondary }]}>
            Welcome to Khair, an app designed to help users amplify their dhikr through aesthetic, simple adhkar (remembrances) and goal-setting features. By accessing or using the Khair app ("the App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree with these Terms, you should not use the App.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            App Usage
          </Text>
          <Text style={[styles.text, { color: theme.colors.text.secondary }]}>
            Khair offers basic dhikr (remembrances) from the Quran and Hadith, curated by our team. In the future, we may allow users to customize their dhikr experience. The app provides a goal-setting feature to help users track and amplify their dhikr.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            No Account Creation
          </Text>
          <Text style={[styles.text, { color: theme.colors.text.secondary }]}>
            Currently, users do not need to create an account or provide any personal information to use the App. In the future, we may introduce accounts, but for now, the app is available for use without registration.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Content
          </Text>
          <Text style={[styles.text, { color: theme.colors.text.secondary }]}>
            The content provided within the App is based on the Quran and Hadith, and is curated by our team. Users are not permitted to upload or share content within the App at this time. In the future, we may allow users to customize their dhikr.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Payments and Subscriptions
          </Text>
          <Text style={[styles.text, { color: theme.colors.text.secondary }]}>
            Free Features: Currently, the App is free to use.{'\n\n'}
            Future Features: In the future, we will offer a subscription model with a free trial. Payment methods accepted will include credit card, Apple Pay, and Google Pay.{'\n\n'}
            Refund Policy: We do not offer refunds for any payments made for subscription services after the transaction is complete. Refunds may only be considered in exceptional cases, such as technical issues preventing access to the service, and will be at the sole discretion of Khair.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Data Collection and Privacy
          </Text>
          <Text style={[styles.text, { color: theme.colors.text.secondary }]}>
            Personal Data: We do not collect personal data at this time.{'\n\n'}
            Cookies: We use cookies to enhance your experience. These cookies do not track your personal information but may track usage patterns for performance improvements.{'\n\n'}
            Tracking: We do not use tracking technologies beyond cookies at this time.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Termination of Access
          </Text>
          <Text style={[styles.text, { color: theme.colors.text.secondary }]}>
            Users may choose to stop using the App at any time. In the future, if accounts are introduced, you will have the ability to terminate or delete your account.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Disclaimers
          </Text>
          <Text style={[styles.text, { color: theme.colors.text.secondary }]}>
            We make no warranties or guarantees regarding the functionality of the App. The content provided is based on Quranic verses and Hadith, and we aim to provide accurate and meaningful dhikr, but we do not guarantee perfection.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Governing Law
          </Text>
          <Text style={[styles.text, { color: theme.colors.text.secondary }]}>
            These Terms are governed by the laws of France. By using the App, you agree to resolve any disputes related to these Terms in the courts located in France.
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Changes to These Terms
          </Text>
          <Text style={[styles.text, { color: theme.colors.text.secondary }]}>
            We reserve the right to update these Terms at any time. If changes are made, we will update the "Effective Date" above. Please review these Terms periodically to stay informed about any updates.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontFamily: 'Serif',
    fontSize: 22,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    paddingVertical: 24,
  },
  date: {
    fontFamily: 'Sans',
    fontSize: 14,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Sans-Medium',
    fontSize: 18,
    marginBottom: 12,
    marginTop: 24,
  },
  text: {
    fontFamily: 'Sans',
    fontSize: 16,
    lineHeight: 24,
  },
});