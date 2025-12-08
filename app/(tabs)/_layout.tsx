import React from 'react';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import TabIcon from '@/components/TabIcon';

// Import Hugeicons free icons
import { Home01Icon, Fire01Icon, Message01Icon, Search01Icon, UserIcon } from '@hugeicons/core-free-icons';

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
              icon={Home01Icon}
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
              icon={Fire01Icon}
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
              icon={Message01Icon}
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
