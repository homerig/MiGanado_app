import React, { useState, useEffect, useContext } from 'react';
import { ActivityIndicator, StyleSheet, Image, TouchableOpacity, View, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

import { UserContext } from '../../api/UserContext'; 
import { getUserNotificaciones } from '../../api/api'; 

const NotificationItem = ({ item }) => (
  <View style={styles.notificationItem}>
    <ThemedText type="default">{item.mensaje}</ThemedText>
    <ThemedText type="default">{new Date(item.fecha).toLocaleString()}</ThemedText>
  </View>
);

export default function NotificacionScreen() {
  const navigation = useNavigation();
  const { userId } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificaciones = await getUserNotificaciones(userId);
        setNotifications(notificaciones);
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Notificaciones</ThemedText>
        <TouchableOpacity onPress={() => navigation.navigate('vistas/ConfiguracionNotificaciones')}>
          <FontAwesomeIcon icon={faGear} size={24} color="#605856" />
        </TouchableOpacity>
      </ThemedView>
      
      {notifications.length === 0 ? (
        <ThemedView style={styles.notificationContainer}>
          <Image
            source={require('@/assets/images/sinNotificaciones.png')}
            resizeMode="contain"
          />
          <ThemedText type="subtitle">Sin notificaciones</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={notifications}
          renderItem={({ item }) => <NotificationItem item={item} />}
          keyExtractor={(item, index) => index.toString()} // Usar el índice como key
          contentContainerStyle={styles.list}
        />
      )}
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
    padding: 20,
  },
  notificationContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: '40%',
    gap: 30,
  },
  list: {
    paddingHorizontal: 20,
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
