import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View, Switch } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserContext } from '@/api/UserContext';
import { actualizarConfigNotificaciones, getConfigNotificaciones } from '@/api/api';

const initialState = {
  recibir_notificaciones_lote: true,
  recibir_notificaciones_tratamiento: true,
  recibir_notificaciones_tacto: true,
  recibir_notificaciones_sangrado: true,
  recibir_notificaciones_estadisticas: true,
};

export default function NotificationSettings() {
  const { userId } = useContext(UserContext);
  const [config, setConfig] = useState(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await getConfigNotificaciones(userId);
        setConfig({
          ...initialState,
          ...response,
        });
      } catch (error) {
        console.error('Error loading notification settings:', error);
        Alert.alert('Error', 'No se pudo cargar la configuración de notificaciones.');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [userId]);

  const handleToggle = async (key: keyof typeof initialState, value: boolean) => {
    const nextConfig = { ...config, [key]: value };
    setConfig(nextConfig);

    try {
      await actualizarConfigNotificaciones(userId, { [key]: value });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      setConfig(config);
      Alert.alert('Error', 'No se pudo actualizar la configuración.');
    }
  };

  const rows: Array<{ key: keyof typeof initialState; label: string }> = [
    { key: 'recibir_notificaciones_tratamiento', label: 'Avisos de tratamientos' },
    { key: 'recibir_notificaciones_tacto', label: 'Avisos de tacto' },
    { key: 'recibir_notificaciones_lote', label: 'Avisos de lotes' },
    { key: 'recibir_notificaciones_sangrado', label: 'Avisos de sangrado' },
    { key: 'recibir_notificaciones_estadisticas', label: 'Avisos de estadísticas' },
  ];

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#407157" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.card}>
        <ThemedText type="title" style={styles.title}>Configuración de Notificaciones</ThemedText>
        <ThemedText style={styles.subtitle}>Los cambios se guardan al instante y afectan la creación de nuevos avisos.</ThemedText>

        {rows.map((row) => (
          <View key={row.key} style={styles.notificationRow}>
            <ThemedText type="default" style={styles.rowLabel}>{row.label}</ThemedText>
            <Switch
              value={config[row.key]}
              onValueChange={(value) => handleToggle(row.key, value)}
              trackColor={{ false: '#CDD7D0', true: '#7EB092' }}
              thumbColor={config[row.key] ? '#407157' : '#F8FAF9'}
            />
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EDF3EE',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDF3EE',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D9E5DC',
    shadowColor: '#274233',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  title: {
    color: '#274233',
    marginBottom: 8,
  },
  subtitle: {
    color: '#617066',
    marginBottom: 20,
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E6ECE8',
  },
  rowLabel: {
    flex: 1,
    color: '#22372B',
    paddingRight: 12,
  },
});
