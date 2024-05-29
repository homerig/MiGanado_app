import React from 'react';
import { Tabs } from 'expo-router';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#605856',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#EEEEEE',
          borderTopWidth: 0,
          elevation: 0,
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="estadisticas"
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'chart' : 'chart'} color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="notificaciones"
        options={{
          title: 'Notificaciones',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'bell' : 'bell'} color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home'} color={color} focused={focused} />
          ),
        }}
      />
      
      
      <Tabs.Screen
        name="lotes"
        options={{
          title: 'Lotes',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'user' : 'user'} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
