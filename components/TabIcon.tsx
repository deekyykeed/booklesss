import React from 'react';
import { View, StyleSheet } from 'react-native';

interface TabIconProps {
  IconComponent: React.ComponentType<any>;
  focused: boolean;
  color?: string;
  size?: number;
}

/**
 * TabIcon Component for Hugeicons
 *
 * Uses opacity to indicate active state:
 * - Inactive: 50% opacity
 * - Active: 100% opacity
 *
 * @param IconComponent - The Hugeicon component
 * @param focused - Whether the tab is currently active
 * @param color - The color to apply to the icon (default: #000000)
 * @param size - The size of the icon in pixels (default: 24)
 */
export default function TabIcon({ IconComponent, focused, color = '#000000', size = 24 }: TabIconProps) {
  return (
    <View style={[styles.container, { opacity: focused ? 1 : 0.5 }]}>
      <IconComponent
        size={size}
        color={color}
        variant="stroke"
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
