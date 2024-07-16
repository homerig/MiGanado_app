import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPen, faEnvelope, faKey, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { UserContext, UserProvider } from '../../api/UserContext';

export default function HomeScreen() {
  const [isEditProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const { userName, userEmail } = useContext(UserContext);

  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);

  const navigation = useNavigation();

  useEffect(() => {
    setName(userName);
    setEmail(userEmail);
  }, [userName, userEmail]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedView style={styles.container}>
          <Image source={require('@/assets/images/sinFotoPerfil.png')} style={styles.imagen} />

          <TouchableOpacity style={styles.icon} onPress={() => setEditProfileModalVisible(true)}>
            <FontAwesomeIcon icon={faPen} size={22} color="#605856" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedText type="title" style={styles.container}>{name}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Datos Personales</ThemedText>
        <ThemedText type="default"><FontAwesomeIcon icon={faEnvelope} color="#605856" /> {email}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.item}>
        <TouchableOpacity onPress={() => setChangePasswordModalVisible(true)}>
          <ThemedText type="default"><FontAwesomeIcon icon={faKey} color="#605856" /> Cambiar Contraseña</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('(login)')}>
          <ThemedText type="default"><FontAwesomeIcon icon={faArrowRightFromBracket} color="#605856" /> Cerrar Sesión</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Modal for Editing Profile */}
      <Modal isVisible={isEditProfileModalVisible}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>Editar Perfil</ThemedText>
          <TextInput
            style={styles.modalInput}
            placeholder="Nombre y Apellido"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#666666"
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#666666"
          />
          <TouchableOpacity style={styles.modalButton} onPress={() => setEditProfileModalVisible(false)}>
            <ThemedText style={styles.modalButtonText}>Guardar</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => setEditProfileModalVisible(false)}>
            <ThemedText style={styles.modalButtonText}>Cancelar</ThemedText>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal for Changing Password */}
      <Modal isVisible={isChangePasswordModalVisible}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>Cambiar Contraseña</ThemedText>
          <TextInput
            style={styles.modalInput}
            placeholder="Contraseña Actual"
            secureTextEntry
            placeholderTextColor="#666666"
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Contraseña Nueva"
            secureTextEntry
            placeholderTextColor="#666666"
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Repetir Contraseña"
            secureTextEntry
            placeholderTextColor="#666666"
          />
          <TouchableOpacity style={styles.modalButton} onPress={() => setChangePasswordModalVisible(false)}>
            <ThemedText style={styles.modalButtonText}>Guardar</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => setChangePasswordModalVisible(false)}>
            <ThemedText style={styles.modalButtonText}>Cancelar</ThemedText>
          </TouchableOpacity>
        </View>
      </Modal>
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
    elevation: 4
  },
  imagen: {
    width: '100%',
    height: 150
  },
  icon: {
    backgroundColor: 'white',
    borderRadius: 99,
    padding: 12,
    margin: 14,
    shadowColor: '#00000026',
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 4,
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  item: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalButton: {
    backgroundColor: '#407157',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
