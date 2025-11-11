import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Heart, Trash2 } from 'lucide-react-native';
import { AdBanner } from '@/components/AdBanner';

const { width } = Dimensions.get('window');
// Calculate card width: (screen width - left padding - right padding - gap between items) / 2
const cardWidth = (width - 48 - 16) / 2;

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, loading, error, toggleFavorite } = useFavorites();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Your Collection</Text>
          <Text style={styles.title}>Saved Poses</Text>
        </View>
        <View style={styles.badge}>
          <Heart size={18} color="#fff" fill="#fff" strokeWidth={2.5} />
          <Text style={styles.badgeText}>{favorites.length}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Loading favorites...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Heart size={48} color="#333" strokeWidth={2} />
            </View>
            <Text style={styles.emptyTitle}>Error loading favorites</Text>
            <Text style={styles.emptyDescription}>{error}</Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)')}>
              <Text style={styles.exploreButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Heart size={48} color="#333" strokeWidth={2} />
            </View>
            <Text style={styles.emptyTitle}>No saved poses yet</Text>
            <Text style={styles.emptyDescription}>
              Start exploring and save your favorite poses to see them here
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(tabs)')}>
              <Text style={styles.exploreButtonText}>Explore Poses</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {favorites.map((pose) => (
              <View key={pose.id} style={styles.card}>
                <TouchableOpacity
                  style={styles.cardTouchable}
                  onPress={() =>
                    router.push({
                      pathname: '/pose-detail',
                      params: {
                        id: pose.id,
                        category: pose.category,
                      },
                    })
                  }
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

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={async () => {
                    try {
                      await toggleFavorite(pose);
                    } catch (error) {
                      console.error('Failed to remove favorite:', error);
                    }
                  }}>
                  <Trash2 size={16} color="#fff" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    color: '#888',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
    paddingTop: 120,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  exploreButtonText: {
    color: '#0a0a0a',
    fontSize: 16,
    fontWeight: '600',
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
    position: 'relative',
    marginBottom: 16,
  },
  cardTouchable: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
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
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});
