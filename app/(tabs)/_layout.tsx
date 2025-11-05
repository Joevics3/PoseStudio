import { Tabs } from 'expo-router';
import { Home, Heart, Sparkles, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a0a0a',
          borderTopColor: '#1a1a1a',
          borderTopWidth: 1,
          height: 88,
          paddingTop: 8,
          paddingBottom: 32,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ size, color }) => (
            <Heart size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      {__DEV__ && (
        <Tabs.Screen
          name="ai-tools"
          options={{
            title: 'AI Tools',
            tabBarIcon: ({ size, color }) => (
              <Sparkles size={size} color={color} strokeWidth={2.5} />
            ),
          }}
        />
      )}
      {__DEV__ && (
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ size, color }) => (
              <User size={size} color={color} strokeWidth={2.5} />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
