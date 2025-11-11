import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ScreenBackground } from '@/components/ScreenBackground';
import { ChevronLeft } from 'lucide-react-native';
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';

export default function TermsScreen() {
  const router = useRouter();
  const { theme, isDarkBackground } = useTheme();

  const handleBack = () => {
    router.replace('/profile');
  };

  return (
    <PageTransitionWrapper animationType="slide" duration={300}>
      <ScreenBackground>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ChevronLeft size={24} color={isDarkBackground ? '#FFFFFF' : '#181818'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDarkBackground ? '#FFFFFF' : '#181818' }]}>
            Terms of Service
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={[styles.date]}>
              Effective Date: 19/03/2025
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Introduction
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              Welcome to Khair, an app designed to help users amplify their dhikr through aesthetic, simple adhkar (remembrances) and goal-setting features. By accessing or using the Khair app ("the App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree with these Terms, you should not use the App.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              App Usage
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              Khair offers basic dhikr (remembrances) from the Quran and Hadith, curated by our team. In the future, we may allow users to customize their dhikr experience. The app provides a goal-setting feature to help users track and amplify their dhikr.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              No Account Creation
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              Currently, users do not need to create an account or provide any personal information to use the App. In the future, we may introduce accounts, but for now, the app is available for use without registration.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Content
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              The content provided within the App is based on the Quran and Hadith, and is curated by our team. Users are not permitted to upload or share content within the App at this time. In the future, we may allow users to customize their dhikr.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Payments and Subscriptions
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              Free Features: Currently, the App is free to use.{'\n\n'}
              Future Features: In the future, we will offer a subscription model with a free trial. Payment methods accepted will include credit card, Apple Pay, and Google Pay.{'\n\n'}
              Refund Policy: We do not offer refunds for any payments made for subscription services after the transaction is complete. Refunds may only be considered in exceptional cases, such as technical issues preventing access to the service, and will be at the sole discretion of Khair.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Data Collection and Privacy
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              Personal Data: We do not collect personal data at this time.{'\n\n'}
              Cookies: We use cookies to enhance your experience. These cookies do not track your personal information but may track usage patterns for performance improvements.{'\n\n'}
              Tracking: We do not use tracking technologies beyond cookies at this time.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Termination of Access
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              Users may choose to stop using the App at any time. In the future, if accounts are introduced, you will have the ability to terminate or delete your account.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Disclaimers
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              We make no warranties or guarantees regarding the functionality of the App. The content provided is based on Quranic verses and Hadith, and we aim to provide accurate and meaningful dhikr, but we do not guarantee perfection.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Governing Law
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              These Terms are governed by the laws of France. By using the App, you agree to resolve any disputes related to these Terms in the courts located in France.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Changes to These Terms
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              We reserve the right to update these Terms at any time. If changes are made, we will update the "Effective Date" above. Please review these Terms periodically to stay informed about any updates.
            </Text>
          </View>
        </ScrollView>
      </ScreenBackground>
    </PageTransitionWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },

  title: {
    fontFamily: 'Classico', // EXACT : Font cohérente
    fontSize: 30, // EXACT : Taille du titre
    color: '#181818', // EXACT : Noir foncé
    marginBottom: 8, // EXACT : Espacement sous le titre
  },
  content: {
    paddingHorizontal: 20, // EXACT : 20px de chaque côté
    paddingTop: 20,
    flex: 1,
  },
  section: {
    paddingVertical: 10,
  },
  date: {
    fontFamily: 'Sofia-Pro-ExtraLight', // EXACT : Font cohérente
    fontSize: 16, // EXACT : Taille du sous-titre
    color: '#8C8F7B', // EXACT : Gris-vert du design
    opacity: 0.8, // EXACT : Légère transparence
  },
  sectionTitle: {
    flex: 1,
    fontFamily: 'Sofia-Pro-Light', // EXACT : Font cohérente
    color: '#181818', // EXACT : Couleur du texte
    fontSize: 18,
    marginBottom: 12,
    marginTop: 24,
  },
  text: {
    fontFamily: 'Sofia-Pro-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
});