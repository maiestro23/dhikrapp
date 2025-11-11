import { Tabs, usePathname } from 'expo-router';
import { StyleSheet, Platform, View, Dimensions } from 'react-native';
import { Quote as QuoteIcon, Search, User } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';

const { width: screenWidth } = Dimensions.get('window');

// Configuration d'animation ultra-douce
const ICON_SPRING = {
  damping: 30,
  stiffness: 250,
  mass: 0.5,
};

// Composant d'icône avec animation ultra-douce
const SmoothTabIcon = ({
  children,
  focused,
}: {
  children: React.ReactNode;
  focused: boolean;
}) => {
  const scale = useSharedValue(focused ? 1 : 1);
  const opacity = useSharedValue(focused ? 1 : 0.6);

  useEffect(() => {
    // Animation très subtile et douce
    scale.value = withSpring(focused ? 1.08 : 1, ICON_SPRING);
    opacity.value = withTiming(focused ? 1 : 0.6, { 
      duration: 250,
    });
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

export default function TabLayout() {
  const { theme, isDarkBackground } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: 'rgb(251,244,238)' }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          
          // PAS d'animation de page - instantané
          animation: 'none',
          
          // Précharger toutes les pages
          lazy: false,
          
          // Fond de secours partout
          sceneStyle: {
            backgroundColor: 'rgb(251,244,238)',
          },
          
          contentStyle: {
            backgroundColor: 'rgb(251,244,238)',
          },
          
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
        }}>

        <Tabs.Screen
          name="index"
          options={{
            title: 'Dhikr',
            tabBarIcon: ({ color, size, focused }) => (
              <SmoothTabIcon focused={focused}>
                <CustomQuotesIcon
                  color={focused ? '#560A27' : '#560A27'}
                  size={24}
                  fill={focused ? '#560A27' : 'rgba(255, 255, 255, 0.1)'}
                />
              </SmoothTabIcon>
            ),
          }}
        />

        <Tabs.Screen
          name="discover"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color, size, focused }) => (
              <SmoothTabIcon focused={focused}>
                <CustomDiscoverIcon
                  color={focused ? '#560A27' : '#560A27'}
                  size={24}
                  fill={focused ? '#560A27' : 'rgba(255, 255, 255, 0.1)'}
                />
              </SmoothTabIcon>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size, focused }) => (
              <SmoothTabIcon focused={focused}>
                {focused ? <CustomProfileFilledIcon /> : <CustomProfileIcon />}
              </SmoothTabIcon>
            ),
          }}
        />

        {/* Tabs cachés */}
        <Tabs.Screen
          name="search"
          options={{
            tabBarItemStyle: { display: 'none' },
            title: 'Search',
          }}
        />

        <Tabs.Screen
          name="profile/favorites"
          options={{
            tabBarItemStyle: { display: 'none' },
            title: 'Favorites',
          }}
        />

        <Tabs.Screen
          name="profile/goal"
          options={{
            tabBarItemStyle: { display: 'none' },
            title: 'Goal',
          }}
        />

        <Tabs.Screen
          name="profile/privacy"
          options={{
            tabBarItemStyle: { display: 'none' },
            title: 'Privacy',
          }}
        />

        <Tabs.Screen
          name="profile/terms"
          options={{
            tabBarItemStyle: { display: 'none' },
            title: 'Terms',
          }}
        />

        <Tabs.Screen
          name="profile/notifications"
          options={{
            tabBarItemStyle: { display: 'none' },
            title: 'Notifications',
          }}
        />

      </Tabs>
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
    backdropFilter: 'blur(10px)',
  },
  tabBarLabel: {
    fontFamily: 'Sofia-Pro-Light',
    color: '#560A27',
    fontSize: 12,
    marginTop: 4,
  },
});