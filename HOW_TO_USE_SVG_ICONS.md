# How to Use Custom SVG Icons in Tabs

This guide explains how to use your custom SVG icons with dynamic color support in the tab navigation.

## ✅ Setup Complete

The following has already been configured:
- ✅ `react-native-svg-transformer` installed
- ✅ Metro bundler configured to handle SVG files
- ✅ TypeScript definitions for SVG imports
- ✅ Folder structure created in `assets/icons/tab-icons/`
- ✅ Reusable `TabIcon` component created

## 📁 Add Your SVG Icons

Place your SVG files in the appropriate folders:

```
assets/icons/tab-icons/
├── Home/
│   ├── filled.svg    ← Add your active Home icon here
│   └── line.svg      ← Add your inactive Home icon here
├── Highlights/
│   ├── filled.svg
│   └── line.svg
├── Chat/
│   ├── filled.svg
│   └── line.svg
├── Search/
│   ├── filled.svg
│   └── line.svg
└── Profile/
    ├── filled.svg
    └── line.svg
```

## 🎨 Prepare Your SVG Files for Color Changes

**IMPORTANT**: To enable dynamic color changes, your SVG files must use `fill="currentColor"` instead of hardcoded colors.

### Before (hardcoded color - won't change):
```xml
<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="..." fill="#000000"/>
</svg>
```

### After (dynamic color - will change):
```xml
<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="..." fill="currentColor"/>
</svg>
```

You can also remove the `fill` attribute entirely from paths, and it will inherit the color.

## 🔧 Update the Tab Layout

Edit `app/(tabs)/_layout.tsx` to use your custom SVG icons:

```typescript
import React from 'react';
import { Tabs } from 'expo-router';
import TabIcon from '@/components/TabIcon';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// Import your SVG icons
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
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              FilledIcon={HomeFilled}
              LineIcon={HomeLine}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="highlights"
        options={{
          title: 'Highlights',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              FilledIcon={HighlightsFilled}
              LineIcon={HighlightsLine}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              FilledIcon={ChatFilled}
              LineIcon={ChatLine}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              FilledIcon={SearchFilled}
              LineIcon={SearchLine}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              FilledIcon={ProfileFilled}
              LineIcon={ProfileLine}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
```

## 🎨 How Color Changes Work

The icon colors automatically change based on:

1. **Active/Inactive State**:
   - Active tab: Uses `tabBarActiveTintColor` (defined in Colors.ts)
   - Inactive tab: Uses the default inactive color

2. **Light/Dark Theme**:
   - Colors automatically adjust based on the user's theme preference
   - Theme colors are defined in `constants/Colors.ts`

3. **SVG `fill="currentColor"`**:
   - The `color` prop is passed to the SVG component
   - SVG paths with `fill="currentColor"` will use this color
   - This makes your icons fully dynamic!

## 🔄 Restart Development Server

After adding your SVG files and updating the layout, restart the development server:

```bash
# Stop the current server (Ctrl+C)
# Clear cache and restart
npm start -- --clear
```

## ✨ That's It!

Your custom SVG icons will now:
- ✅ Change color when tabs are active/inactive
- ✅ Adapt to light/dark themes
- ✅ Use your custom designs
- ✅ Maintain sharp quality at any screen density
