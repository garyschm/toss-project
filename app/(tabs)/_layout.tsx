import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebaseConfig';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  if (getApps().length < 1) {
    initializeApp(firebaseConfig);
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel: false, // This line removes the labels from all tabs
      }}>
      <Tabs.Screen
        name="FeedScreen"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'list' : 'list-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ScoreSubmissionScreen"
        options={{
          title: 'Submit Score',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'add-circle' : 'add-circle-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="RankingsScreen"
        options={{
          title: 'Rankings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'trophy' : 'trophy-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profilepage"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={24}
              color={color}
              style={{ marginBottom: -3 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
