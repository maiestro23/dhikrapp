import { Tabs, usePathname } from 'expo-router';
import { StyleSheet, Platform, View, Dimensions } from 'react-native';
import { Quote as QuoteIcon, Search, User } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Route } from 'expo-router/build/Route';
import CustomQuotesIcon from '@/assets/icons/customQuotesIcon';
import CustomDiscoverIcon from '@/assets/icons/customDiscoverIcon';
import CustomProfileIcon from '@/assets/icons/customProfileIcon';
import CustomProfileFilledIcon from '@/assets/icons/customProfileFilledIcon';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';

const { width: screenWidth } = Dimensions.get('window');

// Configuration des animations
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

const TIMING_CONFIG = {
  duration: 300,
};

// Composant pour l'indicateur animé
const AnimatedTabIndicator = ({ activeIndex }: { activeIndex: number }) => {
  const indicatorPosition = useSharedValue(0);
  const indicatorOpacity = useSharedValue(1);

  useEffect(() => {
    // Animation de glissement avec spring
    indicatorPosition.value = withSpring(activeIndex, SPRING_CONFIG);

    // Animation d'opacité pour un effet de fade
    indicatorOpacity.value = withTiming(0, { duration: 150 }, () => {
      indicatorOpacity.value = withTiming(1, { duration: 150 });
    });
  }, [activeIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    const tabWidth = screenWidth * 0.86 / 3; // 3 tabs visibles
    const translateX = interpolate(
      indicatorPosition.value,
      [0, 1, 2],
      [tabWidth * 0.15, tabWidth * 1.15, tabWidth * 2.15]
    );

    return {
      transform: [{ translateX }],
      opacity: indicatorOpacity.value,
    };
  });

  return (
    <Animated.View style={[styles.tabIndicator, animatedStyle]} />
  );
};

// Composant pour l'icône animée
const AnimatedTabIcon = ({
  children,
  focused,
  index,
  currentIndex
}: {
  children: React.ReactNode;
  focused: boolean;
  index: number;
  currentIndex: number;
}) => {
  const scale = useSharedValue(focused ? 1 : 0.9);
  const opacity = useSharedValue(focused ? 1 : 0.7);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1, SPRING_CONFIG);
    opacity.value = withTiming(focused ? 1 : 0.8, TIMING_CONFIG);
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

// Hook pour gérer l'index actuel
const useCurrentTabIndex = () => {
  const pathname = usePathname();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (pathname === '/' || pathname === '/index') {
      setCurrentIndex(0);
    } else if (pathname === '/discover') {
      setCurrentIndex(1);
    } else if (pathname === '/profile') {
      setCurrentIndex(2);
    }
  }, [pathname]);

  return currentIndex;
};

export default function TabLayout() {
  const { theme, isDarkBackground } = useTheme();
  const insets = useSafeAreaInsets();
  const currentTabIndex = useCurrentTabIndex();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: [
            styles.tabBar,
            {
              height: 71,
              paddingBottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            }
          ],
          tabBarActiveTintColor: theme.colors.accent,
          tabBarInactiveTintColor: theme.colors.text.secondary,
          tabBarLabelStyle: styles.tabBarLabel,
          // Animation personnalisée pour les transitions
          animation: 'shift',
          animationDuration: 300,
        }}>

        <Tabs.Screen
          name="index"
          options={{
            title: 'Dhikr',
            tabBarIcon: ({ color, size, focused }) => (
              <AnimatedTabIcon focused={focused} index={0} currentIndex={currentTabIndex}>
                <CustomQuotesIcon
                  color={focused ? '#560A27' : '#560A27'}
                  size={24}
                  fill={focused ? '#560A27' : 'rgba(255, 255, 255, 0.1)'}
                />
              </AnimatedTabIcon>
            ),
          }}
        />

        <Tabs.Screen
          name="discover"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color, size, focused }) => (
              <AnimatedTabIcon focused={focused} index={1} currentIndex={currentTabIndex}>
                <CustomDiscoverIcon
                  color={focused ? '#560A27' : '#560A27'}
                  size={24}
                  fill={focused ? '#560A27' : 'rgba(255, 255, 255, 0.1)'}
                />
              </AnimatedTabIcon>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size, focused }) => (
              <AnimatedTabIcon focused={focused} index={2} currentIndex={currentTabIndex}>
                {focused ? <CustomProfileFilledIcon /> : <CustomProfileIcon />}
              </AnimatedTabIcon>
            ),
          }}
        />

        {/* Tabs cachés */}
        <Tabs.Screen
          name="search"
          options={{
            tabBarItemStyle: { display: 'none' },
            title: 'Search',
            tabBarIcon: ({ color, size, focused }) => (
              <CustomDiscoverIcon
                color={focused ? '#560A27' : '#560A27'}
                size={24}
                fill={focused ? '#560A27' : 'rgba(255, 255, 255, 0.1)'}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile/favorites"
          options={{
            tabBarItemStyle: { display: 'none' },
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <User color={color} size={24} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile/goal"
          options={{
            tabBarItemStyle: { display: 'none' },
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <User color={color} size={24} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile/privacy"
          options={{
            tabBarItemStyle: { display: 'none' },
            title: 'Privacy',
            tabBarIcon: ({ color, size }) => (
              <User color={color} size={24} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile/terms"
          options={{
            tabBarItemStyle: { display: 'none' },
            title: 'Terms',
            tabBarIcon: ({ color, size }) => (
              <User color={color} size={24} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile/notifications"
          options={{
            tabBarItemStyle: { display: 'none' },
            title: 'Notifications',
            tabBarIcon: ({ color, size }) => (
              <User color={color} size={24} />
            ),
          }}
        />

      </Tabs>

      {/* Indicateur animé 
      <AnimatedTabIndicator activeIndex={currentTabIndex} />
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '7%',
    marginVertical: 'auto',
    bottom: 31,
    width: '86%',
    borderRadius: 38.5,
    shadowColor: '#5A2237',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderTopWidth: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingTop: 6,
    // Amélioration visuelle pour les transitions
    backdropFilter: 'blur(10px)',
  },
  tabBarLabel: {
    fontFamily: 'Sofia-Pro-Light',
    color: '#560A27',
    fontSize: 12,
    marginTop: 4,
  },
});

// Composant additionnel pour les transitions de contenu de page
export const PageTransition = ({ children, isActive }: { children: React.ReactNode; isActive: boolean }) => {
  const opacity = useSharedValue(isActive ? 1 : 0);
  const translateX = useSharedValue(isActive ? 0 : 50);

  useEffect(() => {
    opacity.value = withTiming(isActive ? 1 : 0, TIMING_CONFIG);
    translateX.value = withSpring(isActive ? 0 : 50, SPRING_CONFIG);
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      {children}
    </Animated.View>
  );
};