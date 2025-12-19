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
 * - Inactive: 35% opacity
 * - Active: 100% opacity with enhanced stroke and shadow
 *
 * @param icon - The Hugeicons icon object
 * @param focused - Whether the tab is currently active
 * @param color - The color to apply to the icon (default: #000000)
 * @param size - The size of the icon in pixels (default: 20)
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
export default function TabIcon({ icon, focused, color = '#000000', size = 20, strokeWidth = 1.5 }: TabIconProps) {
  const activeStrokeWidth = strokeWidth + 1; // Slightly bigger stroke for active icons

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
        strokeWidth={focused ? activeStrokeWidth : strokeWidth}
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
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3, // For Android
  },
});
