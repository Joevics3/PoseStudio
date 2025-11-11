import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout() {
  useFrameworkReady();

  // Initialize AdMob (only if not in Expo Go)
  useEffect(() => {
    const isExpoGo = Constants.executionEnvironment === 'storeClient';
    
    if (!isExpoGo) {
      try {
        const mobileAds = require('react-native-google-mobile-ads');
        mobileAds.initialize().then((adapterStatuses: any) => {
          if (__DEV__) {
            console.log('AdMob initialized:', adapterStatuses);
          }
        });
      } catch (error) {
        // AdMob not available (likely not installed or Expo Go)
        if (__DEV__) {
          console.log('AdMob initialization skipped (likely Expo Go)');
        }
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      <FavoritesProvider>
        <Stack
          screenOptions={{ headerShown: false }}
          initialRouteName="splash">
          <Stack.Screen name="splash" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="category" />
          <Stack.Screen name="pose-detail" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </FavoritesProvider>
    </ErrorBoundary>
  );
}
