import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { UserContext } from '../../api/UserContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPen, faEnvelope, faKey, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const { userId, userName, userEmail, userCampo, fetchUserData } = useContext(UserContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  console.log('Datos en el perfil:', { userName, userEmail, userCampo });

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <View style={styles.imageContainer}>
          <Image source={require('@/assets/images/sinFotoPerfil.png')} style={styles.image} />
          <View style={styles.icon}>
            <FontAwesomeIcon icon={faPen} size={22} color="#605856" />
          </View>
        </View>
        <View>
          <ThemedText type="title">{userName}</ThemedText>
          <ThemedText type="subtitle">{userCampo}</ThemedText> 
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Datos Personales</ThemedText>
        <ThemedText type="default"><FontAwesomeIcon icon={faEnvelope} color="#605856" /> {userEmail}</ThemedText>
        <TouchableOpacity onPress={() => navigation.navigate('vistas/cambiarContra')}>
          <ThemedText type="default"><FontAwesomeIcon icon={faKey} color="#605856" /> Cambiar Contraseña</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.item}>
      <TouchableOpacity onPress={() => navigation.navigate('(login)')}>
        <ThemedText type="default"><FontAwesomeIcon icon={faArrowRightFromBracket} color="#605856" /> Cerrar Sesión</ThemedText>
      </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  section: {
    justifyContent: 'space-between',
    margin: 16,
    padding: 20,
    gap: 16,
    borderRadius: 10,
    shadowColor: '#0000001A',
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  icon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 12,
    shadowColor: '#00000026',
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 4,
  },
  item: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
});
