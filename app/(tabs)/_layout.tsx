import React from 'react';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import TabIcon from '@/components/TabIcon';

// Import custom SVG icons
import HomeFilled from '@/assets/icons/tab-icons/Home/filled.svg';
import HomeLine from '@/assets/icons/tab-icons/Home/line.svg';
import HighlightsFilled from '@/assets/icons/tab-icons/Highlights/filled.svg';
import HighlightsLine from '@/assets/icons/tab-icons/Highlights/line.svg';
import ChatFilled from '@/assets/icons/tab-icons/Chat/filled.svg';
import ChatLine from '@/assets/icons/tab-icons/Chat/line.svg';
import SearchFilled from '@/assets/icons/tab-icons/Search/filled.svg';
import SearchLine from '@/assets/icons/tab-icons/Search/line.svg';
import ProfileFilled from '@/assets/icons/tab-icons/Profile/filled.svg';
import ProfileLine from '@/assets/icons/tab-icons/Profile/line.svg';

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              FilledIcon={HomeFilled}
              LineIcon={HomeLine}
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
              FilledIcon={HighlightsFilled}
              LineIcon={HighlightsLine}
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
              FilledIcon={ChatFilled}
              LineIcon={ChatLine}
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
              FilledIcon={SearchFilled}
              LineIcon={SearchLine}
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
              FilledIcon={ProfileFilled}
              LineIcon={ProfileLine}
              focused={focused}
              color="#000000"
            />
          ),
        }}
      />
    </Tabs>
  );
}
