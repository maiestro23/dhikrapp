import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { router } from 'expo-router';
import { Flag, Bookmark, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../hooks/useProgress';
import { ScreenBackground } from '../../components/ScreenBackground';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_HEIGHT = 80;

const isTablet = () => {
  const { height, width } = Dimensions.get('window');
  const aspectRatio = height / width;
  return Platform.OS === 'ios' && aspectRatio < 1.6; // simple heuristic for tablets
};

export default function ProfileScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    totalCount,
    totalMinutes,
    currentStreak,
    goalProgress,
    remainingToGoal,
  } = useProgress();

  const handleNavigation = (route: string) => {
    router.replace(route);
  };

  const bottomPadding = isTablet()
    ? TAB_BAR_HEIGHT + insets.bottom + 120
    : 180 + insets.bottom;

  return (
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
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.statValue, { color: theme.colors.text.secondary }]}>
              {totalCount.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.primary }]}>
              total dhikr
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.statValue, { color: theme.colors.text.secondary }]}>
              {totalMinutes.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.primary }]}>
              total minutes
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.statValue, { color: theme.colors.text.secondary }]}>
              {currentStreak}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.primary }]}>
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
          <Text style={[styles.progressText, { color: theme.colors.text.primary }]}>
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
            <Text style={[styles.quoteText, { color: theme.colors.accent }]}>
              "The most beloved deed to Allah is the most regular and constant even if it were little."
            </Text>
            <Text style={[styles.quoteAuthor, { color: theme.colors.accent }]}>Sahih Al-Bukhari</Text>
          </View>
        </LinearGradient>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
            onPress={() => handleNavigation('/profile/goal')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.background }]}>
              <Flag size={20} color={theme.colors.accent} />
            </View>
            <Text style={[styles.menuText, { color: theme.colors.text.primary }]}>Goal</Text>
            <ChevronRight size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
            onPress={() => handleNavigation('/profile/favorites')}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.background }]}>
              <Bookmark size={20} color={theme.colors.accent} />
            </View>
            <Text style={[styles.menuText, { color: theme.colors.text.primary }]}>Favourites</Text>
            <ChevronRight size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.footerMenu, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity
            style={[styles.footerMenuItem, { borderBottomColor: theme.colors.border, borderBottomWidth: 1 }]}
            onPress={() => handleNavigation('/terms')}
          >
            <Text style={[styles.footerMenuText, { color: theme.colors.text.primary }]}>Terms of service</Text>
            <ChevronRight size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          {/* You can repeat other footer menu items as needed */}
          <TouchableOpacity style={styles.footerMenuItem} onPress={() => handleNavigation('/privacy')}>
            <Text style={[styles.footerMenuText, { color: theme.colors.text.primary }]}>Privacy policy</Text>
            <ChevronRight size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>

        </View>
      </ScrollView>
    </ScreenBackground>
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
    fontSize: 24,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
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
    fontSize: 12,
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
    fontSize: 14,
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
