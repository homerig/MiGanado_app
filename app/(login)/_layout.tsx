import React from 'react';
import { Tabs } from 'expo-router';
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

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#605856',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          display: 'none',
        },
      }}
    >
      <Tabs.Screen
        name="index"        
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'chart' : 'chart'} color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="singup"        
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'chart' : 'chart'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="ingresarvia"        
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'chart' : 'chart'} color={color} focused={focused} />
          ),
        }}
      />

    </Tabs>
  );
}
