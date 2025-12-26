import { HugeiconsIcon } from '@hugeicons/react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface TabIconProps {
  icon: any; // Hugeicons icon object
  focused: boolean;
  color?: string;
  size?: number;
}

/**
 * TabIcon Component with Opacity-Based Active State
 *
 * Uses Hugeicons and adjusts opacity based on focused state:
 * - Inactive: 35% opacity
 * - Active: 100% opacity with shadow
 *
 * @param icon - The Hugeicons icon object
 * @param focused - Whether the tab is currently active
 * @param color - The color to apply to the icon (default: #000000)
 * @param size - The size of the icon in pixels (default: 24)
 *
 * @example
 * import { Home01Icon } from '@hugeicons/core-free-icons';
 *
 * <TabIcon
 *   icon={Home01Icon}
 *   focused={focused}
 *   color="#000000"
 * />
 */
export default function TabIcon({ icon, focused, color = '#000000', size = 24 }: TabIconProps) {
  return (
    <View style={[
      styles.container,
      { opacity: focused ? 1 : 0.35 },
      focused && styles.activeShadow
    ]}>
      <HugeiconsIcon
        icon={icon}
        size={size}
        color={color}
        strokeWidth={1.8}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2, // For Android
  },
});
