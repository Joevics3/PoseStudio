import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout() {
  useFrameworkReady();

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
