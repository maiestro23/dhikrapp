import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Flag, Bookmark, Moon, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../hooks/useProgress';
import { ScreenBackground } from '../../components/ScreenBackground';

export default function ProfileScreen() {
  const { theme, toggleDarkMode } = useTheme();
  const { 
    totalCount, 
    totalMinutes, 
    currentStreak,
    goalProgress,
    remainingToGoal,
  } = useProgress();

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <ScreenBackground>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.greetingContainer}>
          <Text style={[styles.greeting, { color: theme.colors.text.secondary }]}>Salaam!</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.statValue, { color: theme.colors.text.secondary }]}>
              {totalCount.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.primary}]}>
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
          <View style={[styles.progressBar, { backgroundColor: theme.colors.progressBackground }]}>
            <View style={[styles.progressFill, { 
              width: `${goalProgress}%`,
              backgroundColor: theme.colors.progressBar
            }]} />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.text.primary }]}>
            {remainingToGoal > 0 
              ? `You are ${Math.ceil(100 - goalProgress)}% away from your daily goal!`
              : 'You have completed your daily goal!'}
          </Text>
        </View>

        <View style={[styles.quoteCard, { backgroundColor: `${theme.colors.accent}15` }]}>
          <Text style={[styles.quoteText, { color: theme.colors.accent }]}>
            "The most beloved deed to Allah is the most regular and constant even if it were little."
          </Text>
          <Text style={[styles.quoteAuthor, { color: theme.colors.accent }]}>
            Sahih Al-Bukhari
          </Text>
        </View>

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

          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
            onPress={toggleDarkMode}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.background }]}>
              <Moon size={20} color={theme.colors.accent} />
            </View>
            <Text style={[styles.menuText, { color: theme.colors.text.primary }]}>Dark Mode</Text>
            <View style={[styles.toggle, { backgroundColor: theme.isDark ? theme.colors.accent : theme.colors.border }]}>
              <View style={[styles.toggleKnob, { 
                backgroundColor: theme.colors.card,
                transform: [{ translateX: theme.isDark ? 20 : 0 }]
              }]} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.footerMenu, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity 
            style={[styles.footerMenuItem, { borderBottomColor: theme.colors.border, borderBottomWidth: 1 }]}
            onPress={() => handleNavigation('/terms')}
          >
            <Text style={[styles.footerMenuText, { color: theme.colors.text.primary }]}>
              Terms of service
            </Text>
            <ChevronRight size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.footerMenuItem}
            onPress={() => handleNavigation('/privacy')}
          >
            <Text style={[styles.footerMenuText, { color: theme.colors.text.primary }]}>
              Privacy policy
            </Text>
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
    marginTop: 40,
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
  quoteCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
  },
  quoteText: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  quoteAuthor: {
    fontFamily: 'Sofia-Pro-ExtraLight',
    fontSize: 14,
    textAlign: 'center',
  },
  menuContainer: {
    gap: 1 ,
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
    color: '#8C8F7B'
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  footerMenu: {
    borderRadius: 16,
    overflow: 'hidden',
    //marginBottom: 24,
    
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
    color: '#8C8F7B'
  },
});