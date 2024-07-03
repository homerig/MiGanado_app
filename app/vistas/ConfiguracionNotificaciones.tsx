import React, { useState } from 'react';
import { StyleSheet, View, Switch } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Vista para la configuración de notificaciones
export default function NotificationSettings() {
  const [treatmentNotifications, setTreatmentNotifications] = useState(true);
  const [contactNotifications, setContactNotifications] = useState(true);
  const [vaccinationNotifications, setVaccinationNotifications] = useState(false);
  const [bleedingNotifications, setBleedingNotifications] = useState(false);
  const [statisticsNotifications, setStatisticsNotifications] = useState(false);

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
      <View style={styles.notificationRow}>
        <ThemedText type="default">Aviso de sangrado</ThemedText>
        <Switch
          value={bleedingNotifications}
          onValueChange={setBleedingNotifications}
        />
      </View>
      <View style={styles.notificationRow}>
        <ThemedText type="default">Aviso de estadísticas</ThemedText>
        <Switch
          value={statisticsNotifications}
          onValueChange={setStatisticsNotifications}
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
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
});
