import React, { useState } from 'react';
import { StyleSheet, Image, View, Switch } from 'react-native';
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

// vista para la configuración de notificaciones
export function NotificationSettings() {
  const [treatmentNotifications, setTreatmentNotifications] = useState(true);
  const [contactNotifications, setContactNotifications] = useState(true);
  const [vaccinationNotifications, setVaccinationNotifications] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Configuración de Notificaciones</ThemedText>
      </ThemedView>
      <View style={styles.notificationRow}>
        <ThemedText type="default">Avisos de tratamientos</ThemedText>
        <Switch
          value={treatmentNotifications}
          onValueChange={setTreatmentNotifications}
        />
      </View>
      <View style={styles.notificationRow}>
        <ThemedText type="default">Avisos de tacto</ThemedText>
        <Switch
          value={contactNotifications}
          onValueChange={setContactNotifications}
        />
      </View>
      <View style={styles.notificationRow}>
        <ThemedText type="default">Avisos de vacunaciones</ThemedText>
        <Switch
          value={vaccinationNotifications}
          onValueChange={setVaccinationNotifications}
        />
      </View>
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
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
});
