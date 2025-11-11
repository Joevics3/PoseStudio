import { View, StyleSheet, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';

// Google Test Ad IDs
const TEST_BANNER_AD_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/2934735716', // iOS test banner
  android: 'ca-app-pub-3940256099942544/6300978111', // Android test banner
  default: 'ca-app-pub-3940256099942544/6300978111',
});

interface AdBannerProps {
  style?: object;
}

export function AdBanner({ style }: AdBannerProps) {
  const [isAdAvailable, setIsAdAvailable] = useState(false);
  const [BannerAd, setBannerAd] = useState<any>(null);

  useEffect(() => {
    // Check if we're in Expo Go (ads won't work)
    const isExpoGo = Constants.executionEnvironment === 'storeClient';
    
    if (isExpoGo) {
      // Gracefully fail in Expo Go
      setIsAdAvailable(false);
      return;
    }

    // Try to load the ad module
    try {
      // Dynamic import to avoid errors in Expo Go
      const googleMobileAds = require('react-native-google-mobile-ads');
      const { BannerAd: AdComponent, BannerAdSize } = googleMobileAds;
      
      setBannerAd(() => AdComponent);
      setIsAdAvailable(true);
    } catch (error) {
      // Module not available (likely Expo Go or not installed)
      setIsAdAvailable(false);
      if (__DEV__) {
        console.log('AdMob not available (likely Expo Go):', error);
      }
    }
  }, []);

  // Don't render anything in Expo Go or if ads aren't available
  if (!isAdAvailable || !BannerAd) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={TEST_BANNER_AD_ID}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          if (__DEV__) {
            console.log('Banner ad loaded');
          }
        }}
        onAdFailedToLoad={(error: any) => {
          if (__DEV__) {
            console.log('Banner ad failed to load:', error);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 8,
    minHeight: 50,
  },
});

