import React from 'react';

// Example imports - you'll replace these with your actual SVG imports
// import HomeFilled from '@/assets/icons/tab-icons/Home/filled.svg';
// import HomeLine from '@/assets/icons/tab-icons/Home/line.svg';

interface TabIconProps {
  FilledIcon: React.FC<{ fill?: string; width?: number; height?: number }>;
  LineIcon: React.FC<{ fill?: string; width?: number; height?: number }>;
  focused: boolean;
  color: string;
  size?: number;
}

/**
 * TabIcon Component
 *
 * A reusable component for tab bar icons that supports both filled and line variants.
 * Automatically switches between filled (active) and line (inactive) states.
 *
 * @param FilledIcon - The filled SVG icon component (active state)
 * @param LineIcon - The line SVG icon component (inactive state)
 * @param focused - Whether the tab is currently active
 * @param color - The color to apply to the icon (automatically provided by React Navigation)
 * @param size - The size of the icon in pixels (default: 24)
 *
 * @example
 * import HomeFilled from '@/assets/icons/tab-icons/Home/filled.svg';
 * import HomeLine from '@/assets/icons/tab-icons/Home/line.svg';
 *
 * <TabIcon
 *   FilledIcon={HomeFilled}
 *   LineIcon={HomeLine}
 *   focused={focused}
 *   color={color}
 * />
 */
export default function TabIcon({ FilledIcon, LineIcon, focused, color, size = 24 }: TabIconProps) {
  const Icon = focused ? FilledIcon : LineIcon;

  return <Icon fill={color} width={size} height={size} />;
}
