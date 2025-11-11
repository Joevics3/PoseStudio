import { useState, useEffect, useRef } from 'react';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Google Test Interstitial Ad IDs
const TEST_INTERSTITIAL_AD_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/4411468910', // iOS test interstitial
  android: 'ca-app-pub-3940256099942544/1033173712', // Android test interstitial
  default: 'ca-app-pub-3940256099942544/1033173712',
});

interface UseInterstitialAdReturn {
  showAd: () => Promise<boolean>;
  isAdLoaded: boolean;
  isAdAvailable: boolean;
}

export function useInterstitialAd(): UseInterstitialAdReturn {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isAdAvailable, setIsAdAvailable] = useState(false);
  const interstitialRef = useRef<any>(null);
  const InterstitialAdClass = useRef<any>(null);

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
      const googleMobileAds = require('react-native-google-mobile-ads');
      const { InterstitialAd, AdEventType } = googleMobileAds;
      
      InterstitialAdClass.current = InterstitialAd;
      setIsAdAvailable(true);

      // Create and load the interstitial ad
      const interstitial = InterstitialAd.createForAdRequest(TEST_INTERSTITIAL_AD_ID, {
        requestNonPersonalizedAdsOnly: false,
      });

      interstitialRef.current = interstitial;

      // Listen for ad loaded event
      const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
        setIsAdLoaded(true);
        if (__DEV__) {
          console.log('Interstitial ad loaded');
        }
      });

      // Listen for ad failed to load
      const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error: any) => {
        setIsAdLoaded(false);
        if (__DEV__) {
          console.log('Interstitial ad failed to load:', error);
        }
      });

      // Listen for ad closed
      const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        setIsAdLoaded(false);
        // Reload the ad for next time
        interstitial.load();
      });

      // Load the ad
      interstitial.load();

      return () => {
        unsubscribeLoaded();
        unsubscribeError();
        unsubscribeClosed();
      };
    } catch (error) {
      // Module not available (likely Expo Go or not installed)
      setIsAdAvailable(false);
      if (__DEV__) {
        console.log('AdMob not available (likely Expo Go):', error);
      }
    }
  }, []);

  const showAd = async (): Promise<boolean> => {
    // If ads aren't available (Expo Go), return true to continue
    if (!isAdAvailable || !interstitialRef.current) {
      return true;
    }

    // If ad is not loaded, return true to continue without showing ad
    if (!isAdLoaded) {
      if (__DEV__) {
        console.log('Interstitial ad not loaded, continuing without ad');
      }
      return true;
    }

    try {
      // Show the ad
      await interstitialRef.current.show();
      return true;
    } catch (error) {
      if (__DEV__) {
        console.log('Error showing interstitial ad:', error);
      }
      // Continue even if ad fails to show
      return true;
    }
  };

  return {
    showAd,
    isAdLoaded,
    isAdAvailable,
  };
}

