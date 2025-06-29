import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { ScreenBackground } from '@/components/ScreenBackground';
import { SwipeBackWrapper } from '@/components/SwipeBackWrapper';
import { ProfileBackground } from '@/components/ProfileBackground';

export default function PrivacyScreen() {
  const router = useRouter();
  const { theme } = useTheme();


  const handleSwipeBack = () => {
    router.replace('/profile');
  };

  return (
    <SwipeBackWrapper
      onSwipeBack={handleSwipeBack}
      backgroundComponent={<ProfileBackground />}
    >
      <ScreenBackground>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>Privacy Policy</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.date, { color: theme.colors.text.primary }]}>
              Effective Date: 19/03/2025
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Introduction
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              At Khair, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our app. By accessing or using the Khair app ("the App"), you agree to the collection and use of information in accordance with this Privacy Policy.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Information We Collect
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              Currently, Khair does not collect any personal information from its users. The app does not require registration or login, and we do not ask for your name, email address, or other personal identifiers.{'\n\n'}
              However, we do collect certain non-personal information, such as:{'\n\n'}
              Cookies: We use cookies to improve your user experience and enhance app functionality. Cookies help us understand how you interact with the App, but do not collect personal data.{'\n\n'}
              Usage Data: We may collect information on how you use the App, such as the frequency of use and feature preferences, to help improve our services and content.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              How We Use the Information
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              The information we collect is used solely for the following purposes:{'\n\n'}
              • To improve the functionality and performance of the App.{'\n'}
              • To track user engagement with the app to enhance user experience.{'\n'}
              • To analyze trends and understand how the app is being used.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Data Sharing
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              We do not share any personal information because we do not collect it. However, Khair may use third-party service providers for functions such as analytics or advertising, and these providers may collect non-personal information.{'\n\n'}
              Third-party Services: The App may integrate with third-party services like Google Analytics, Apple Pay, or Google Pay, which may collect certain data to operate properly. For example, payment processors collect payment details but we do not store or handle them directly.{'\n\n'}
              Cookies: If third-party services (such as advertisers or analytics providers) use cookies, those cookies are managed by the respective service providers. Please refer to the privacy policies of these third-party providers for more information on how they handle your data.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Data Security
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              We are committed to protecting your data. However, please be aware that no method of electronic transmission or storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Your Rights
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              Since we do not collect personal data, there are no specific user rights to request access, correction, or deletion of personal data. However, if in the future we collect personal data, we will provide you with the ability to access, update, or delete that data as required by applicable laws.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Children's Privacy
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              The App is not intended for children under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have collected personal data from a child under 13, we will take steps to delete that information as soon as possible.
            </Text>

            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
              Changes to This Privacy Policy
            </Text>
            <Text style={[styles.text, { color: theme.colors.text.primary }]}>
              We reserve the right to update or modify this Privacy Policy at any time. Any changes will be reflected by an updated "Effective Date" at the top of this page. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.
            </Text>
          </View>
        </ScrollView>
      </ScreenBackground>
    </SwipeBackWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
  },
  title: {
    fontFamily: 'Classico', // EXACT : Font cohérente
    fontSize: 32, // EXACT : Taille du titre
    color: '#181818', // EXACT : Noir foncé
    marginBottom: 8, // EXACT : Espacement sous le titre
  },
  content: {
    paddingHorizontal: 20, // EXACT : 20px de chaque côté
    paddingTop:20,
    flex: 1,
  },
  section: {
    paddingVertical: 24,
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