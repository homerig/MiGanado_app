import React, { useState, useEffect, useContext } from 'react';
import { ActivityIndicator, StyleSheet, Image, TouchableOpacity, View, Text, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGear, faSyringe, faUserDoctor, faMapLocationDot, faFileMedical, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

import { UserContext } from '../../api/UserContext';
import { getUserNotificaciones, deleteNotificacion } from '../../api/api';

const NotificationItem = ({ item, onDelete }) => {
  let icon;
  switch (item.tipo) {
    case "Vacunación":
      icon = faSyringe;
      break;
    case "Tratamiento":
      icon = faFileMedical;
      break;
    case "Lote":
      icon = faMapLocationDot;
      break;
    default:
      icon = faUserDoctor;
  }

  const timeAgo = formatDistanceToNow(new Date(item.fecha), { addSuffix: true, locale: es });

  return (
    <View style={styles.notificationItem}>
      <FontAwesomeIcon icon={icon} size={20} style={styles.notificationIcon} />
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <ThemedText type="caption">{timeAgo.charAt(0).toUpperCase() + timeAgo.slice(1)}</ThemedText>
          <TouchableOpacity onPress={() => onDelete(item.id)}>
            <Text><FontAwesomeIcon icon={faXmark} size={16} style={{ color: '#878787', padding: 10}} /></Text>
          </TouchableOpacity>
        </View>
        <ThemedText type="subtitle" style={styles.notificationText}>Aviso de {item.tipo}</ThemedText>
        <ThemedText type="default">{item.mensaje}</ThemedText>
      </View>
    </View>
  );
};

const NotificacionScreen = () => {
  const navigation = useNavigation();
  const { userId } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id) => {
    try {
      await deleteNotificacion(id);
      fetchNotifications(); // Recargar las notificaciones después de eliminar una
    } catch (error) {
      console.error('Error al eliminar la notificación:', error.message);
    }
  };

  useEffect(() => {
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
          renderItem={({ item }) => <NotificationItem item={item} onDelete={handleDelete} />}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  titleContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    paddingVertical: 10,
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 20,
    paddingHorizontal: 30,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 25,
  },
  notificationContent: {
    width: '85%',
  },
  notificationHeader:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '94%',
  },
  notificationText: {
    color: '#365c48',
  },
  notificationIcon: {
    padding: 20,
    color: '#365c48',
  },
});

export default NotificacionScreen;
