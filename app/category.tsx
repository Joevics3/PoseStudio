import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { usePoses } from '@/hooks/usePoses';
import { ArrowLeft, Grid3x3 } from 'lucide-react-native';
import { AdBanner } from '@/components/AdBanner';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';

const { width } = Dimensions.get('window');
// Calculate card width: (screen width - left padding - right padding - gap between items) / 2
const cardWidth = (width - 48 - 16) / 2;

export default function CategoryScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const { poses: categoryPoses, loading, error, refresh } = usePoses(id || '');
  const { showAd } = useInterstitialAd();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/(tabs)');
            }
          }}>
          <ArrowLeft size={24} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <View style={styles.iconButton}>
          <Grid3x3 size={20} color="#fff" strokeWidth={2.5} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading poses...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error loading poses</Text>
            <Text style={styles.errorDescription}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={refresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : categoryPoses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No poses found</Text>
            <Text style={styles.emptyDescription}>
              This category doesn't have any poses yet. Check back later!
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.info}>
              <Text style={styles.count}>{categoryPoses.length} Poses</Text>
              <Text style={styles.description}>
                Explore our curated collection of {name?.toLowerCase()} poses
              </Text>
            </View>

            <View style={styles.grid}>
              {categoryPoses.map((pose) => (
                <TouchableOpacity
                  key={pose.id}
                  style={styles.card}
                  onPress={async () => {
                    // Show interstitial ad before navigating
                    await showAd();
                    router.push({
                      pathname: '/pose-detail',
                      params: {
                        id: pose.id,
                        category: id,
                        title: pose.title,
                        description: pose.description,
                        imageUrl: pose.imageUrl,
                      },
                    });
                  }}
                  activeOpacity={0.8}>
                  <Image
                    source={{ uri: pose.imageUrl }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.cardOverlay} />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {pose.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        <AdBanner />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  info: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  count: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#888',
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  card: {
    width: cardWidth,
    height: cardWidth * 1.4,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1a1a1a',
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#888',
  },
  errorContainer: {
    paddingTop: 120,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#0a0a0a',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingTop: 120,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});
