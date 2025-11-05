import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Sparkles, Image as ImageIcon, Shirt, Users, Lock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const aiTools = [
  {
    id: 1,
    title: 'Background Change',
    description: 'Replace backgrounds with AI-generated scenes',
    icon: ImageIcon,
    isPremium: true,
  },
  {
    id: 2,
    title: 'Outfit Try-On',
    description: 'Virtually try on different outfits and styles',
    icon: Shirt,
    isPremium: true,
  },
  {
    id: 3,
    title: 'Pose Transfer',
    description: 'Transfer poses from reference images to your photos',
    icon: Users,
    isPremium: true,
  },
  {
    id: 4,
    title: 'Style Enhancement',
    description: 'Enhance and stylize your photos with AI',
    icon: Sparkles,
    isPremium: true,
  },
];

export default function AIToolsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>AI-Powered</Text>
            <Text style={styles.title}>Creative Tools</Text>
          </View>
          <View style={styles.sparkleIcon}>
            <Sparkles size={28} color="#fff" strokeWidth={2.5} />
          </View>
        </View>

        <View style={styles.premiumBanner}>
          <View style={styles.premiumContent}>
            <View style={styles.premiumIconWrapper}>
              <Sparkles size={24} color="#0a0a0a" fill="#0a0a0a" strokeWidth={2} />
            </View>
            <View style={styles.premiumText}>
              <Text style={styles.premiumTitle}>Unlock AI Features</Text>
              <Text style={styles.premiumDescription}>
                Get access to all premium AI tools
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Tools</Text>
          <View style={styles.toolsList}>
            {aiTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <TouchableOpacity
                  key={tool.id}
                  style={styles.toolCard}
                  activeOpacity={0.8}>
                  <View style={styles.toolIcon}>
                    <Icon size={28} color="#fff" strokeWidth={2.5} />
                  </View>
                  <View style={styles.toolContent}>
                    <View style={styles.toolHeader}>
                      <Text style={styles.toolTitle}>{tool.title}</Text>
                      {tool.isPremium && (
                        <View style={styles.premiumBadge}>
                          <Lock size={12} color="#0a0a0a" strokeWidth={3} />
                        </View>
                      )}
                    </View>
                    <Text style={styles.toolDescription}>
                      {tool.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.featureSection}>
          <Text style={styles.sectionTitle}>What You Get</Text>
          <View style={styles.featuresList}>
            <View style={styles.feature}>
              <View style={styles.featureBullet} />
              <Text style={styles.featureText}>
                Unlimited AI-powered transformations
              </Text>
            </View>
            <View style={styles.feature}>
              <View style={styles.featureBullet} />
              <Text style={styles.featureText}>
                High-resolution exports up to 4K
              </Text>
            </View>
            <View style={styles.feature}>
              <View style={styles.featureBullet} />
              <Text style={styles.featureText}>
                Priority processing and support
              </Text>
            </View>
            <View style={styles.feature}>
              <View style={styles.featureBullet} />
              <Text style={styles.featureText}>
                Early access to new AI features
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
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
  sparkleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  premiumBanner: {
    marginHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  premiumIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0a0a0a',
    marginBottom: 4,
  },
  premiumDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  upgradeButton: {
    backgroundColor: '#0a0a0a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  toolsList: {
    gap: 12,
  },
  toolCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  toolIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  toolContent: {
    flex: 1,
  },
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  toolTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  premiumBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#888',
    lineHeight: 20,
  },
  featureSection: {
    paddingHorizontal: 24,
  },
  featuresList: {
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: '#aaa',
    lineHeight: 22,
  },
});
