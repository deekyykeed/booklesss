import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { ensureAuthenticated } from '@/lib/auth';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Default fonts
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    
    // GoogleSans fonts (for course titles)
    'GoogleSans-Regular': require('../assets/fonts/custom/GoogleSans/GoogleSans-Regular.ttf'),
    'GoogleSans-Medium': require('../assets/fonts/custom/GoogleSans/GoogleSans-Medium.ttf'),
    'GoogleSans-SemiBold': require('../assets/fonts/custom/GoogleSans/GoogleSans-SemiBold.ttf'),
    'GoogleSans-Bold': require('../assets/fonts/custom/GoogleSans/GoogleSans-Bold.ttf'),
    
    // FamiljenGrotesk fonts (for smaller text)
    'FamiljenGrotesk-Regular': require('../assets/fonts/custom/FamiljenGrotesk/FamiljenGrotesk-Regular.otf'),
    'FamiljenGrotesk-Medium': require('../assets/fonts/custom/FamiljenGrotesk/FamiljenGrotesk-Medium.otf'),
    'FamiljenGrotesk-SemiBold': require('../assets/fonts/custom/FamiljenGrotesk/FamiljenGrotesk-SemiBold.otf'),
    'FamiljenGrotesk-Bold': require('../assets/fonts/custom/FamiljenGrotesk/FamiljenGrotesk-Bold.otf'),
    
    // RobotoCondensed fonts (for section titles)
    'RobotoCondensed-Regular': require('../assets/fonts/custom/RobotoCondensed/RobotoCondensed-Regular.ttf'),
    'RobotoCondensed-Medium': require('../assets/fonts/custom/RobotoCondensed/RobotoCondensed-Medium.ttf'),
    'RobotoCondensed-SemiBold': require('../assets/fonts/custom/RobotoCondensed/RobotoCondensed-SemiBold.ttf'),
    'RobotoCondensed-Bold': require('../assets/fonts/custom/RobotoCondensed/RobotoCondensed-Bold.ttf'),
    
    // Icon fonts
    ...FontAwesome.font,
  });

  // Initialize authentication on app start
  useEffect(() => {
    ensureAuthenticated().catch((error) => {
      console.error('Failed to initialize authentication:', error);
    });
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              contentStyle: {
                flex: 1,
                padding: 0,
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
      </View>
    </SafeAreaProvider>
  );
}
