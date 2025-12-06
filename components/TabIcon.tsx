import React from 'react';
import { View, StyleSheet } from 'react-native';

interface TabIconProps {
  IconComponent: React.FC<{ width?: number; height?: number; fill?: string; stroke?: string }>;
  focused: boolean;
  color?: string;
  size?: number;
}

/**
 * TabIcon Component with Opacity-Based Active State
 *
 * Uses a single icon SVG and adjusts opacity based on focused state:
 * - Inactive: 50% opacity
 * - Active: 100% opacity
 *
 * @param IconComponent - The SVG icon component
 * @param focused - Whether the tab is currently active
 * @param color - The color to apply to the icon (default: #000000)
 * @param size - The size of the icon in pixels (default: 24)
 *
 * @example
 * import HomeIcon from '@/assets/icons/tabs/home.svg';
 *
 * <TabIcon
 *   IconComponent={HomeIcon}
 *   focused={focused}
 *   color="#000000"
 * />
 */
export default function TabIcon({ IconComponent, focused, color = '#000000', size = 24 }: TabIconProps) {
  return (
    <View style={[styles.container, { opacity: focused ? 1 : 0.5 }]}>
      <IconComponent
        width={size}
        height={size}
        fill={color}
        stroke={color}
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
