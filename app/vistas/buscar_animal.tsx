import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Modal, Alert, Switch } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { faChevronLeft, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { buscarAnimal, buscarTratam, buscarSan, actualizarAnimal } from '../../api/api';
import { UserContext } from '../../api/UserContext';

const BuscarAnimalScreen = () => {
  const [numeroCaravana, setNumeroCaravana] = useState('');
  const [animalEncontrado, setAnimalEncontrado] = useState(null);
  const [tratamientoEncontrado, setTratamientoEncontrado] = useState(null);
  const [tratamientoBuscado, setTratamientoBuscado] = useState(false);
  const [sangradoEncontrado, setSangradoEncontrado] = useState(null);
  const [sangradobuscado, setsangradobuscado] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedAnimal, setEditedAnimal] = useState({});
  const { userId } = useContext(UserContext);

  const buscar = async () => {
    try {
      const animal = await buscarAnimal(userId, numeroCaravana);
      if (animal && animal.numeroCaravana === numeroCaravana) {
        setAnimalEncontrado(animal);
      } else {
        setAnimalEncontrado(null);
        Alert.alert('Animal no encontrado', 'No se encontró un animal con ese número de caravana. Inténtelo de nuevo.', [
          { text: 'OK', onPress: () => setNumeroCaravana('') }
        ]);
      }
    } catch (error) {
      console.error('Error al buscar animal:', error);
    }
  };

  const resetForm = () => {
    setNumeroCaravana('');
    setAnimalEncontrado(null);
    setTratamientoEncontrado(null);
    setTratamientoBuscado(false);
    setSangradoEncontrado(null);
    setsangradobuscado(false);
  };

  const buscarTratamiento = async () => {
    try {
      const tratamiento = await buscarTratam(userId, numeroCaravana);
      if (tratamiento && tratamiento.numeroCaravana === numeroCaravana) {
        setTratamientoEncontrado(tratamiento);
      } else {
        setTratamientoEncontrado(null);
      }
      setTratamientoBuscado(true);
    } catch (error) {
      console.error('Error al buscar tratamiento:', error);
      setTratamientoBuscado(true);
    }
  };
  
  const buscarSangrado = async () => {
    try {
      const sangrado = await buscarSan(userId, numeroCaravana);
      if (sangrado && sangrado.numeroCaravana === numeroCaravana) {
        setSangradoEncontrado(sangrado);
      } else {
        setSangradoEncontrado(null);
      }
      setsangradobuscado(true);
    } catch (error) {
      console.error('Error al buscar sangrado:', error);
      setsangradobuscado(true);
    }
  };

  const handleEdit = () => {
    setEditedAnimal(animalEncontrado);
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    try {
      await actualizarAnimal(userId, editedAnimal.numeroCaravana, editedAnimal.numero_lote, editedAnimal.peso, editedAnimal.edad, editedAnimal.reciennacida);
      setAnimalEncontrado(editedAnimal);
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error al actualizar animal:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el animal. Inténtelo de nuevo.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      {!animalEncontrado ? (
        <>
          <ThemedText style={styles.title}>Buscar Animal</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Número de caravana"
            placeholderTextColor="#666666"
            value={numeroCaravana}
            onChangeText={setNumeroCaravana}
            autoCapitalize="none"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={buscar}>
              <ThemedText style={styles.buttonText}>Buscar</ThemedText>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.buttonVolver} onPress={resetForm}>
            <ThemedText>
              <FontAwesomeIcon icon={faChevronLeft} size={20} style={styles.iconVolver} />
              Volver a buscar
            </ThemedText>
          </TouchableOpacity>
          <View style={styles.animalDetailContainer}>
            <View style={styles.headerContainer}>
              <ThemedText style={styles.detail}>N° {animalEncontrado.numeroCaravana}</ThemedText>
              <TouchableOpacity onPress={handleEdit}>
                <FontAwesomeIcon icon={faPen} size={20} style={styles.iconEdit} />
              </TouchableOpacity>
            </View>
            <ThemedText style={styles.detail}>Edad: {animalEncontrado.edad} años</ThemedText>
            <ThemedText style={styles.detail}>Lote: {animalEncontrado.numero_lote}</ThemedText>
            <ThemedText style={styles.detail}>Peso: {animalEncontrado.peso} kg</ThemedText>
            <ThemedText style={styles.detail}>Preñada: {animalEncontrado.preniada ? 'Sí' : 'No'}</ThemedText>
            <ThemedText style={styles.detail}>Recien Nacido: {animalEncontrado.reciennacida ? 'Sí' : 'No'}</ThemedText>
            
            <View style={styles.tratamientosContainer}>
              {!tratamientoBuscado ? (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={buscarTratamiento}>
                    <ThemedText style={styles.buttonText}>Ver tratamiento</ThemedText>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <ThemedText style={styles.detail}>Tratamientos:</ThemedText>
                  {tratamientoEncontrado ? (
                    <>
                      <ThemedText style={styles.tratamiento}>Tratamiento: {tratamientoEncontrado.tratamiento}</ThemedText>
                      <ThemedText style={styles.tratamiento}>Medicación: {tratamientoEncontrado.medicacion}</ThemedText>
                      <ThemedText style={styles.tratamiento}>Fecha Inicio: {tratamientoEncontrado.fechaInicio}</ThemedText>
                      <ThemedText style={styles.tratamiento}>Cada: {tratamientoEncontrado.cada} días</ThemedText>
                      <ThemedText style={styles.tratamiento}>Durante: {tratamientoEncontrado.durante} días</ThemedText>
                    </>
                  ) : (
                    <ThemedText style={styles.detail}>No hay tratamientos registrados.</ThemedText>
                  )}
                </>
              )}
            </View> 
            
            <View style={styles.tratamientosContainer}>
              {!sangradobuscado ? (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={buscarSangrado}>
                    <ThemedText style={styles.buttonText}>Ver sangrado</ThemedText>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <ThemedText style={styles.detail}>Sangrado:</ThemedText>
                  {sangradoEncontrado ? (
                    <>
                      <ThemedText style={styles.sangrado}>Numero tubo: {sangradoEncontrado.numero_tubo}</ThemedText>
                      </>
                  ) : (
                    <ThemedText style={styles.detail}>No hay sangrados registrados.</ThemedText>
                  )}
                </>
              )}
            </View>
          </View>

          <Modal
            visible={editModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setEditModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ThemedText style={styles.title}>Editar Animal</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Número de lote"
                  placeholderTextColor="#666666"
                  value={editedAnimal.numero_lote}
                  onChangeText={(text) => setEditedAnimal({ ...editedAnimal, numero_lote: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Peso"
                  placeholderTextColor="#666666"
                  value={editedAnimal.peso}
                  onChangeText={(text) => setEditedAnimal({ ...editedAnimal, peso: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Edad"
                  placeholderTextColor="#666666"
                  value={editedAnimal.edad}
                  onChangeText={(text) => setEditedAnimal({ ...editedAnimal, edad: text })}
                />
                <View style={styles.switchContainer}>
                  <ThemedText style={styles.switchLabel}>Recien Nacida</ThemedText>
                  <Switch
                    value={editedAnimal.reciennacida}
                    onValueChange={(value) => setEditedAnimal({ ...editedAnimal, reciennacida: value })}
                  />
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <ThemedText style={styles.buttonText}>Actualizar</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={() => setEditModalVisible(false)}>
                    <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    padding: 2,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#407157',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  buttonCancel: {
    backgroundColor: '#777777',
  },
  buttonVolver: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  animalDetailContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  detail: {
    fontSize: 18,
    marginBottom: 5,
  },
  iconVolver: {
    marginRight: 8,
  },
  iconEdit: {
    marginLeft: 'auto',
  },
  tratamientosContainer: {
    marginLeft: 20,
  },
  tratamiento: {
    fontSize: 16,
    marginBottom: 5,
  },
  sangrado: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
  },
});

export default BuscarAnimalScreen;
