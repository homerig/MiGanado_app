import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { UserProvider } from '../api/UserContext'; 
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    JostRegular : require('../assets/fonts/Jost-Regular.ttf'),
    JostBold : require('../assets/fonts/Jost-Bold.ttf'),
    JostSemiBold : require('../assets/fonts/Jost-SemiBold.ttf')
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <UserProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(login)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="vistas" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </UserProvider>
  );
}
