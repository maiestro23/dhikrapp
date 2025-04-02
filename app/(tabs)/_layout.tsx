import { Tabs } from 'expo-router';
import { StyleSheet, Platform, View, Dimensions } from 'react-native';
import { Quote as QuoteIcon, Search, User } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Route } from 'expo-router/build/Route';

const { width: screenWidth } = Dimensions.get('window');

export default function TabLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 71,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
            <QuoteIcon color={'#5A5D4D'} size={24} fill={focused ? '#5A5D4D' : '#fff'}/>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size, focused }) => (
            <Search color={'#5A5D4D'} size={24} fill={focused ? '#5A5D4D' : '#fff'}/>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <User color={'#5A5D4D'} size={24} fill={focused ? '#5A5D4D' : '#fff'}/>
          ),
        }}
      />

    <Tabs.Screen
        name="profile/favorites"

        options={{
        tabBarItemStyle:  {display: 'none'},
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={24} />
          ),
        }}
      />
      

      <Tabs.Screen
        name="profile/goal"
        options={{
        tabBarItemStyle:  {display: 'none'},
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={24} />
          ),
        }}
      />


      <Tabs.Screen
        name="premium"
        options={{
        tabBarItemStyle:  {display: 'none'},
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={24} />
          ),
        }}
      />
    </Tabs>
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
  },
  tabBarLabel: {
    fontFamily: 'Sofia-Pro',
    color: '#5A5D4D',
    fontSize: 12,
    marginTop: 4,
  },
});