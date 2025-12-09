import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';

interface TabIconProps {
  icon: any; // Hugeicons icon object
  focused: boolean;
  color?: string;
  size?: number;
  strokeWidth?: number;
}

/**
 * TabIcon Component with Opacity-Based Active State
 *
 * Uses Hugeicons and adjusts opacity based on focused state:
 * - Inactive: 50% opacity
 * - Active: 100% opacity
 *
 * @param icon - The Hugeicons icon object
 * @param focused - Whether the tab is currently active
 * @param color - The color to apply to the icon (default: #000000)
 * @param size - The size of the icon in pixels (default: 24)
 * @param strokeWidth - The stroke width of the icon (default: 1.5)
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
export default function TabIcon({ icon, focused, color = '#000000', size = 24, strokeWidth = 1.5 }: TabIconProps) {
  return (
    <View style={[styles.container, { opacity: focused ? 1 : 0.5 }]}>
      <HugeiconsIcon
        icon={icon}
        size={size}
        color={color}
        strokeWidth={strokeWidth}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
