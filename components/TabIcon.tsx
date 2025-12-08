import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';

interface TabIconProps {
  icon: any;
  focused: boolean;
  color: string;
  size?: number;
}

/**
 * TabIcon Component with Opacity-Based Active State
 *
 * Uses Hugeicons and adjusts opacity based on focused state:
 * - Inactive: 50% opacity
 * - Active: 100% opacity
 *
 * @param icon - The Hugeicons icon from @hugeicons/core-free-icons
 * @param focused - Whether the tab is currently active
 * @param color - The color to apply to the icon (from theme)
 * @param size - The size of the icon in pixels (default: 24)
 *
 * @example
 * import { Home01Icon } from '@hugeicons/core-free-icons';
 *
 * <TabIcon
 *   icon={Home01Icon}
 *   focused={focused}
 *   color={Colors[colorScheme].icon}
 * />
 */
export default function TabIcon({ icon, focused, color, size = 24 }: TabIconProps) {
  return (
    <View style={[styles.container, { opacity: focused ? 1 : 0.5 }]}>
      <HugeiconsIcon
        icon={icon}
        size={size}
        color={color}
        strokeWidth={1.5}
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
