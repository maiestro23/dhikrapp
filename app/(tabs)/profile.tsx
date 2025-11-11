import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform, Switch, Share, Linking } from 'react-native';
import { router } from 'expo-router';
import { Flag, Bookmark, ChevronRight, Moon, Bell, Share2, Mail, Star } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../hooks/useProgress';
import { ScreenBackground } from '../../components/ScreenBackground';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PageTransitionWrapper } from '@/components/PageTransitionWrapper';


const TAB_BAR_HEIGHT = 80;

const isTablet = () => {
  const { height, width } = Dimensions.get('window');
  const aspectRatio = height / width;
  return Platform.OS === 'ios' && aspectRatio < 1.6; // simple heuristic for tablets
};

export default function ProfileScreen() {
  const { theme, isDarkBackground, toggleBackgroundTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    totalCount,
    totalMinutes,
    currentStreak,
    goalProgress,
    remainingToGoal,
    todayProgress
  } = useProgress();

  const handleNavigation = (route: string) => {
    router.replace(route);
  };

  // Fonction pour partager l'app
  const handleShareApp = async () => {
    try {
      const shareContent = {
        message: `🤲 I've been using this amazing Dhikr app to build a daily remembrance habit!\n\nJoin me in earning Khairis and strengthening our connection with Allah. ✨\n\n"Verily, in the remembrance of Allah do hearts find rest." (13:28)`,
        title: 'Khair - Daily Adhkar App',
        url: 'https://apps.apple.com/app/khair-daily-adhkar/id6744126455',
      };

      const result = await Share.share(shareContent);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared via:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      }
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

  // Fonction pour ouvrir l'email de contact
  const handleContactUs = async () => {
    const email = 'contact@khair.app';
    const subject = 'Khair App - Contact';
    const body = 'Hello Khair team,\n\nI would like to get in touch regarding:\n\n';
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      const supported = await Linking.canOpenURL(mailtoUrl);
      if (supported) {
        await Linking.openURL(mailtoUrl);
      } else {
        console.log('Email client not available');
        // Fallback: copier l'email dans le presse-papier ou afficher une alerte
      }
    } catch (error) {
      console.error('Error opening email:', error);
    }
  };

  // Fonction pour noter l'app
  const handleRateApp = async () => {
    const appStoreUrl = 'https://apps.apple.com/app/khair-daily-adhkar/id6744126455?action=write-review';
    
    try {
      const supported = await Linking.canOpenURL(appStoreUrl);
      if (supported) {
        await Linking.openURL(appStoreUrl);
      } else {
        console.log('App Store not available');
      }
    } catch (error) {
      console.error('Error opening App Store:', error);
    }
  };

  const bottomPadding = isTablet()
    ? TAB_BAR_HEIGHT + insets.bottom + 120
    : 180 + insets.bottom;

  return (
    <PageTransitionWrapper animationType="none" >
      <ScreenBackground>
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: bottomPadding }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.greetingContainer}>
            <Text style={[styles.greeting, { color: theme.colors.text.secondary }]}>Salaam!</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.statCard }]}>
              <Text style={[styles.statValue, { color: theme.colors.statCardText }]}>
                {todayProgress >= 1000 ? `${(todayProgress / 1000).toFixed(1)}k` : todayProgress.toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.statCardTextSecondary }]}>
                daily khairis
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.colors.statCard }]}>
              <Text style={[styles.statValue, { color: theme.colors.statCardText }]}>
                {totalCount >= 1000 ? `${(totalCount / 1000).toFixed(1)}k` : totalCount.toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.statCardTextSecondary }]}>
                total khairis
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.statCard }]}>
              <Text style={[styles.statValue, { color: theme.colors.statCardText }]}>
                {currentStreak}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.statCardTextSecondary }]}>
                day streak
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: 'white' }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${goalProgress}%`,
                    backgroundColor: theme.colors.progressBar,
                  },
                ]}
              />
            </View>

            <Text style={[styles.progressText, { color: theme.colors.profile.goalAway }]}>
              {remainingToGoal > 0
                ? `You are ${Math.ceil(100 - goalProgress)}% away from your daily goal!`
                : 'You have completed your daily goal!'}
            </Text>

          </View>

          <LinearGradient
            colors={['rgb(246,245,227)', 'rgb(255,215,223)']}
            locations={[0, 1]}
            start={[0, 1]}
            end={[1, 0]}
            style={styles.gradientStyle}
          >
            <View style={[styles.quoteCard]}>
              <Text style={[styles.quoteText, { color: theme.colors.quoteCardText }]}>
                "The most beloved deed to Allah is the most regular and constant even if it were little."
              </Text>
              <Text style={[styles.quoteAuthor, { color: theme.colors.quoteCardText }]}>Sahih Al-Bukhari</Text>
            </View>
          </LinearGradient>

          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
              onPress={() => handleNavigation('/profile/goal')}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.profile.icons }]}>
                <Flag size={20} color={theme.colors.profile.iconsInside} />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.profile.menuEntries }]}>Goal</Text>
              <ChevronRight size={20} color={theme.colors.profile.arrows} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
              onPress={() => handleNavigation('/profile/favorites')}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.profile.icons }]}>
                <Bookmark size={20} color={theme.colors.profile.iconsInside} />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.profile.menuEntries }]}>Favourites</Text>
              <ChevronRight size={20} color={theme.colors.profile.arrows} />
            </TouchableOpacity>

            {/* NOUVELLE ENTRÉE NOTIFICATIONS */}
            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
              onPress={() => handleNavigation('/profile/notifications')}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.profile.icons }]}>
                <Bell size={20} color={theme.colors.profile.iconsInside} />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.profile.menuEntries }]}>Reminders</Text>
              <ChevronRight size={20} color={theme.colors.profile.arrows} />
            </TouchableOpacity>

            {/* Nouveau toggle pour le background */}
            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
              onPress={toggleBackgroundTheme}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.profile.icons }]}>
                <Moon size={20} color={theme.colors.profile.iconsInside} />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.profile.menuEntries }]}>Dark mode</Text>
              <Switch
                value={isDarkBackground}
                onValueChange={toggleBackgroundTheme}
                trackColor={{ false: theme.colors.background, true: '#3C041A' }}
                thumbColor={isDarkBackground ? '#ffffff' : '#ffffff'}
                ios_backgroundColor={theme.colors.profile.toggleSwitch}
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              />
            </TouchableOpacity>
          </View>

          {/* NOUVELLE SECTION - Actions de l'app */}
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
              onPress={handleShareApp}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.profile.iconsPartTwo }]}>
                <Share2 size={20} color={theme.colors.profile.iconsInside} />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.profile.menuEntries }]}>Share this app</Text>
              <ChevronRight size={20} color={theme.colors.profile.arrows} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
              onPress={handleContactUs}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.profile.iconsPartTwo }]}>
                <Mail size={20} color={theme.colors.profile.iconsInside} />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.profile.menuEntries }]}>Contact us</Text>
              <ChevronRight size={20} color={theme.colors.profile.arrows} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
              onPress={handleRateApp}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.profile.iconsPartTwo }]}>
                <Star size={20} color={theme.colors.profile.iconsInside} />
              </View>
              <Text style={[styles.menuText, { color: theme.colors.profile.menuEntries }]}>Rate this app</Text>
              <ChevronRight size={20} color={theme.colors.profile.arrows} />
            </TouchableOpacity>
          </View>

          <View style={[styles.footerMenu, { backgroundColor: theme.colors.card }]}>
            <TouchableOpacity
              style={[styles.footerMenuItem, { borderBottomColor: theme.colors.border, borderBottomWidth: 1 }]}
              onPress={() => handleNavigation('/profile/terms')}
            >
              <Text style={[styles.footerMenuText, { color: theme.colors.profile.menuEntries }]}>Terms of service</Text>
              <ChevronRight size={20} color={theme.colors.profile.arrows} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.footerMenuItem} onPress={() => handleNavigation('/profile/privacy')}>
              <Text style={[styles.footerMenuText, { color: theme.colors.profile.menuEntries }]}>Privacy policy</Text>
              <ChevronRight size={20} color={theme.colors.profile.arrows} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenBackground>
    </PageTransitionWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  greetingContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  greeting: {
    fontFamily: 'Classico',
    fontSize: 30,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Classico',
    fontSize: 20,
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 14,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 15,
    textAlign: 'center',
  },
  gradientStyle: {
    borderRadius: 16,
    marginBottom: 12,
  },
  quoteCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fff',
  },
  quoteText: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 8,
  },
  quoteAuthor: {
    fontFamily: 'Sofia-Pro',
    fontSize: 14,
    textAlign: 'center',
  },
  menuContainer: {
    gap: 1,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 16,
    color: '#8C8F7B',
  },
  footerMenu: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  footerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  footerMenuText: {
    fontFamily: 'Sofia-Pro-Light',
    fontSize: 16,
    color: '#8C8F7B',
  },
});