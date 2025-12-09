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
    <View style={styles.wrapper}>
      {focused && (
        <View style={styles.activeIndicator}>
          <View style={styles.activeBar} />
        </View>
      )}
      <View style={[styles.container, { opacity: focused ? 1 : 0.5 }]}>
        <HugeiconsIcon
          icon={icon}
          size={size}
          color={color}
          strokeWidth={strokeWidth}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: -12,
    width: 32,
    height: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 8,
  },
});
