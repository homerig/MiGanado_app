import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { Pressable, StyleSheet, Platform, Alert, Image, TouchableOpacity, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { faChartColumn, faClipboardCheck, faCow, faFileMedical, faFlask, faMapLocationDot, faSyringe, faUser, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { Calendar } from 'react-native-calendars';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Notificaciones</ThemedText>

        <TouchableOpacity onPress={() => navigation.navigate('vistas/ConfiguracionNotificaciones')}>
          <FontAwesomeIcon icon={faGear} size={24} color="#605856" />
        </TouchableOpacity>
        
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
    padding: 20,
  },
  notificationContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: '40%',
    gap: 30,
  },
});
