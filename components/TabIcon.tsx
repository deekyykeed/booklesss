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
 * Uses Hugeicons and adjusts opacity and stroke width based on focused state:
 * - Inactive: 35% opacity, 1.5 stroke width
 * - Active: 100% opacity, 2 stroke width
 *
 * @param icon - The Hugeicons icon object
 * @param focused - Whether the tab is currently active
 * @param color - The color to apply to the icon (default: #000000)
 * @param size - The size of the icon in pixels (default: 24)
 * @param strokeWidth - The stroke width of the icon (overrides default behavior)
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
export default function TabIcon({ icon, focused, color = '#000000', size = 24, strokeWidth }: TabIconProps) {
  const defaultStrokeWidth = focused ? 2 : 1.5;

  return (
    <View
      style={[
        styles.container,
        {
          opacity: focused ? 1 : 0.35,
          ...(focused && {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 1,
            elevation: 3,
          }),
        },
      ]}
    >
      <HugeiconsIcon
        icon={icon}
        size={size}
        color={color}
        strokeWidth={strokeWidth ?? defaultStrokeWidth}
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
