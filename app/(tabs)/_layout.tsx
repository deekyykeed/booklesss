import React from 'react';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, Pressable, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import TabIcon from '@/components/TabIcon';

// Import Hugeicons
import {
  Home09Icon,
  FavouriteIcon,
  Chatting01Icon,
  Search01Icon,
  UserIcon
} from '@hugeicons/core-free-icons';

export default function TabLayout() {
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
        headerTransparent: true,
        headerBlurEffect: 'light',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: 'transparent',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        },
        headerBackground: () => (
          <BlurView
            intensity={100}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 1,
          borderTopColor: 'rgba(0, 0, 0, 0.1)',
          elevation: 0,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={100}
            tint="light"
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
              icon={Home09Icon}
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
              icon={FavouriteIcon}
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
              icon={Chatting01Icon}
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
              icon={Search01Icon}
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
              icon={UserIcon}
              focused={focused}
              color="#000000"
            />
          ),
        }}
      />
    </Tabs>
  );
}
