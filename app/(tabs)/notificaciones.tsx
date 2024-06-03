import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Notificaciones</ThemedText>
      </ThemedView>
      <ThemedView style={styles.container}>
        <Image
          source={require('@/assets/images/sinNotificaciones.png')}
          resizeMode="contain"
        />
        <ThemedView style={styles.notificationContainer}>
          <ThemedText type="default">Sin notificaciones</ThemedText>
        </ThemedView>
      </ThemedView>
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  notificationContainer: {
    marginBottom: 16,
  },
});