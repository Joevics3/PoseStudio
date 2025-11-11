import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { fetchPoseById } from '@/lib/posesService';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Pose } from '@/types/types';
import { ArrowLeft, Heart, Share2, Download, X, Sparkles } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function PoseDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    category: string;
    title?: string;
    description?: string;
    imageUrl?: string;
  }>();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [pose, setPose] = useState<Pose | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const { showAd } = useInterstitialAd();
  
  // All hooks must be called before any conditional returns
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    loadPose();
  }, [params.id, params.category]);

  const loadPose = async () => {
    if (!params.id || !params.category) return;
    
    // If we have the pose data from navigation params, use it directly
    if (params.title && params.description && params.imageUrl) {
      setPose({
        id: params.id,
        title: params.title,
        description: params.description,
        imageUrl: params.imageUrl,
        category: params.category,
        isFavorite: false,
      });
      setLoading(false);
      return;
    }
    
    // Otherwise, fetch from database
    try {
      setLoading(true);
      setError(null);
      const poseData = await fetchPoseById(params.id, params.category);
      setPose(poseData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load pose';
      setError(errorMessage);
      console.error('Error loading pose:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!pose) return;
    try {
      await toggleFavorite(pose);
      scale.value = withSpring(1.2, {}, () => {
        scale.value = withSpring(1);
      });
    } catch (error) {
      // Error is handled in context, but we can show user feedback here if needed
      if (__DEV__) {
        console.error('Failed to toggle favorite:', error);
      }
    }
  };

  const handleShare = async () => {
    if (!pose) return;
    
    try {
      setSharing(true);
      
      // Show interstitial ad before sharing
      await showAd();
      
      // First, download the image
      const fileExtension = pose.imageUrl.split('.').pop()?.split('?')[0] || 'jpg';
      const fileName = `${pose.title.replace(/\s+/g, '_')}.${fileExtension}`;
      const fileUri = FileSystem.cacheDirectory + fileName;
      
      const downloadResult = await FileSystem.downloadAsync(pose.imageUrl, fileUri);
      
      if (downloadResult.status === 200) {
        // Check if sharing is available
        const isAvailable = await Sharing.isAvailableAsync();
        
        if (isAvailable) {
          // Share the downloaded file
          await Sharing.shareAsync(downloadResult.uri);
        } else {
          Alert.alert('Error', 'Sharing is not available on this device.');
        }
      } else {
        throw new Error('Failed to download image for sharing');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share image. Please try again.');
      if (__DEV__) {
        console.error('Error sharing:', error);
      }
    } finally {
      setSharing(false);
    }
  };

  const handleDownload = async () => {
    if (!pose) return;
    
    try {
      setDownloading(true);
      
      // Show interstitial ad before downloading
      await showAd();
      
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant permission to save images to your photo library.'
        );
        return;
      }
      
      // Get the file extension from the URL
      const fileExtension = pose.imageUrl.split('.').pop()?.split('?')[0] || 'jpg';
      const fileName = `${pose.title.replace(/\s+/g, '_')}.${fileExtension}`;
      
      // Download the file to cache directory first
      const fileUri = FileSystem.cacheDirectory + fileName;
      const downloadResult = await FileSystem.downloadAsync(pose.imageUrl, fileUri);
      
      if (downloadResult.status === 200) {
        // Save to photo library
        const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
        
        // Try to get or create the album
        let album = await MediaLibrary.getAlbumAsync('Pose Studio');
        if (!album) {
          album = await MediaLibrary.createAlbumAsync('Pose Studio', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
        
        Alert.alert('Success', 'Image saved to your photo library!');
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download image. Please try again.');
      if (__DEV__) {
        console.error('Error downloading:', error);
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleTryWithAI = () => {
    setShowComingSoon(true);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading pose...</Text>
        </View>
      </View>
    );
  }

  if (error || !pose) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {error || 'Pose not found'}
        </Text>
      </View>
    );
  }

  const favorited = isFavorite(pose.id);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: pose.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />

          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.back()}>
              <ArrowLeft size={24} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleShare}
              disabled={sharing}>
              {sharing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Share2 size={22} color="#fff" strokeWidth={2.5} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.actionBar}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleFavorite}>
              <Animated.View style={animatedStyle}>
                <Heart
                  size={24}
                  color="#fff"
                  strokeWidth={2.5}
                  fill={favorited ? '#fff' : 'transparent'}
                />
              </Animated.View>
              <Text style={styles.actionText}>
                {favorited ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleDownload}
              disabled={downloading}>
              {downloading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Download size={24} color="#fff" strokeWidth={2.5} />
              )}
              <Text style={styles.actionText}>
                {downloading ? 'Downloading...' : 'Download'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pose.category}</Text>
          </View>

          <Text style={styles.title}>{pose.title}</Text>
          <Text style={styles.description}>{pose.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tips for this Pose</Text>
            <View style={styles.tipsList}>
              <View style={styles.tip}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>
                  Maintain natural body posture and relaxed shoulders
                </Text>
              </View>
              <View style={styles.tip}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>
                  Keep your weight balanced and grounded
                </Text>
              </View>
              <View style={styles.tip}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>
                  Look for natural lighting that complements the pose
                </Text>
              </View>
              <View style={styles.tip}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>
                  Practice the pose a few times before shooting
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.tryButton}
            onPress={handleTryWithAI}>
            <Text style={styles.tryButtonText}>Try with AI</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Coming Soon Modal */}
      <Modal
        visible={showComingSoon}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowComingSoon(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowComingSoon(false)}>
              <X size={24} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
            
            <View style={styles.modalIconContainer}>
              <Sparkles size={64} color="#fff" strokeWidth={2} />
            </View>
            
            <Text style={styles.modalTitle}>Coming Soon</Text>
            <Text style={styles.modalDescription}>
              AI-powered pose generation is on its way! Stay tuned for this exciting feature.
            </Text>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowComingSoon(false)}>
              <Text style={styles.modalButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageContainer: {
    width: width,
    height: height * 0.6,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  topBar: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionBar: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#888',
    lineHeight: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: '#aaa',
    lineHeight: 22,
  },
  tryButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  tryButtonText: {
    color: '#0a0a0a',
    fontSize: 17,
    fontWeight: '600',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  modalButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#0a0a0a',
    fontSize: 16,
    fontWeight: '600',
  },
});
