import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '../context/ThemeContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { 
  useFonts,
  NotoNaskhArabic_400Regular,
} from '@expo-google-fonts/noto-naskh-arabic';

import {
  Taviraj_200ExtraLight,
} from '@expo-google-fonts/taviraj';

import Classico from '../assets/fonts/Classico.otf';
import Sofia_Pro_ExtraLight  from '../assets/fonts/SofiaProExtraLight.otf';
import Sofia_Pro_Light  from '../assets/fonts/SofiaProLight.otf';
import Sofia_Pro_Regular  from '../assets/fonts/SofiaProRegular.otf';


// Only prevent auto hide on native platforms
if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => {
    /* ignore errors */
  });
}

export default function RootLayout() {
  useFrameworkReady();
  const [fontsLoaded, fontError] = useFonts({
    'NotoNaskhArabic': NotoNaskhArabic_400Regular,
    'Sofia-Pro-ExtraLight': Sofia_Pro_ExtraLight,
    'Sofia-Pro-Light': Sofia_Pro_Light,
    'Sofia-Pro-Regular': Sofia_Pro_Regular,
    'Classico': Classico,
    'Taviraj-ExtraLight': Taviraj_200ExtraLight,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Only hide splash screen on native platforms
      if (Platform.OS !== 'web') {
        SplashScreen.hideAsync().catch(() => {
          /* ignore errors */
        });
      }
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <View style={{ flex: 1 }}>
          <Slot />
          <StatusBar style="auto" />
        </View>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}