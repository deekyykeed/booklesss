import React, { useRef } from 'react';
import { Animated, Platform, ScrollView, ScrollViewProps } from 'react-native';
import { useNavigation } from 'expo-router';

interface ScreenWrapperProps extends ScrollViewProps {
  children: React.ReactNode;
}

/**
 * ScreenWrapper Component
 *
 * A wrapper component that provides scroll-to-hide header functionality.
 * On scroll down, the header hides. On scroll up, the header appears.
 *
 * Usage:
 * <ScreenWrapper>
 *   <View>Your content here</View>
 * </ScreenWrapper>
 */
export default function ScreenWrapper({ children, ...scrollViewProps }: ScreenWrapperProps) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down'>('down');

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';

        if (direction !== scrollDirection.current) {
          scrollDirection.current = direction;

          // Hide header when scrolling down, show when scrolling up
          if (Platform.OS === 'ios') {
            navigation.setOptions({
              headerShown: direction === 'up' || currentScrollY < 50,
            });
          }
        }

        lastScrollY.current = currentScrollY;
      },
    }
  );

  return (
    <Animated.ScrollView
      {...scrollViewProps}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      contentContainerStyle={[
        {
          paddingTop: Platform.OS === 'ios' ? 100 : 80, // Account for header
          paddingBottom: 100, // Account for tab bar
        },
        scrollViewProps.contentContainerStyle,
      ]}
    >
      {children}
    </Animated.ScrollView>
  );
}
