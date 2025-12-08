import React from 'react';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import TabIcon from '@/components/TabIcon';

// Import tab SVG icons
import HomeIcon from '@/assets/icons/tabs/home.svg';
import HighlightsIcon from '@/assets/icons/tabs/highlights.svg';
import ChatIcon from '@/assets/icons/tabs/chat.svg';
import SearchIcon from '@/assets/icons/tabs/search.svg';
import ProfileIcon from '@/assets/icons/tabs/profile.svg';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const handleTabPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#000000',
        tabBarShowLabel: false,
        headerShown: useClientOnlyValue(false, true),
        headerTransparent: Platform.OS === 'ios',
        headerBlurEffect: colorScheme === 'dark' ? 'dark' : 'light',
        headerShadowVisible: false,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={100}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarButton: (props) => (
          <Pressable
            {...props}
            onPress={(e) => {
              handleTabPress();
              props.onPress?.(e);
            }}
          />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              IconComponent={HomeIcon}
              focused={focused}
              color="#000000"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="highlights"
        options={{
          title: 'Highlights',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              IconComponent={HighlightsIcon}
              focused={focused}
              color="#000000"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              IconComponent={ChatIcon}
              focused={focused}
              color="#000000"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              IconComponent={SearchIcon}
              focused={focused}
              color="#000000"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              IconComponent={ProfileIcon}
              focused={focused}
              color="#000000"
            />
          ),
        }}
      />
    </Tabs>
  );
}
