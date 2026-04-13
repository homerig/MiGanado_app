import React from 'react';
import { Stack } from 'expo-router';
import { View, Image, Text} from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const CustomHeader = () => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', height: 95, padding: 12, gap: 10 }}>
      <ThemedText type='subtitle'>MiGanado</ThemedText>
      <Image
        source={require('@/assets/images/MiGanado_logo.png')}
        style={{ width: 30, height: 30, marginRight: 10 }}
        resizeMode="contain"
      />
    </View>
  );
};

export default function LoginLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="singup" />
      <Stack.Screen name="ingresarvia" />
    </Stack>
  );
}
