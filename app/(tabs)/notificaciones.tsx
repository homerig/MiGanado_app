import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Notificaciones</ThemedText>
        <FontAwesomeIcon icon={faGear} size={24} color="#605856" />
      </ThemedView>
      <ThemedView style={styles.notificationContainer}>
        <Image
          source={require('@/assets/images/sinNotificaciones.png')}
          resizeMode="contain"
        />
        <ThemedText type="subtitle">Sin notificaciones</ThemedText>
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
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 20
  },
  notificationContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: '40%',
    gap: 30
  },
});
