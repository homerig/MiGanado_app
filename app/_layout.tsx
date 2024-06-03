import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

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
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
      <Stack.Screen name="vistas/LoginScreen" options={{ headerShown: false }} />
      <Stack.Screen name="vistas/singup" options={{ headerShown: false }} />
      <Stack.Screen name="vistas/ingresarvia" options={{ headerShown: false }} />

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="vistas/buscar_animal" options={{ headerShown: false }} />
        <Stack.Screen name="vistas/IngresoAnimal" options={{ headerShown: false }} />
        <Stack.Screen name="vistas/sangrado" options={{ headerShown: false }} />
        <Stack.Screen name="vistas/tacto" options={{ headerShown: false }} />
        <Stack.Screen name="vistas/vacunacion" options={{ headerShown: false }} />
        <Stack.Screen name="vistas/ver_animal" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
