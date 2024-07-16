import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Text } from 'react-native';
import Modal from 'react-native-modal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { buscarAnimal, actualizarNombreLote, buscarAnimalLote, buscarTratam, buscarSan } from '../../api/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserContext } from '../../api/UserContext';

const AnimalSearchScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = useContext(UserContext);
  const { lote } = route.params;

  const [caravanaNumber, setCaravanaNumber] = useState('');
  const [numero_lote, setNumeroLote] = useState(lote.numero);
  const [selectedAnimals, setSelectedAnimals] = useState([]);
  const [animals, setAnimals] = useState(lote.animales || []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newLoteName, setNewLoteName] = useState('');
  const [caravanas, setCaravanas] = useState([]);

  const [animalEncontrado, setAnimalEncontrado] = useState(null);
  const [tratamientoEncontrado, setTratamientoEncontrado] = useState(null);
  const [sangradoEncontrado, setSangradoEncontrado] = useState(null);

  useEffect(() => {
    const buscar = async () => {
      try {
        const animales = await buscarAnimalLote(userId, numero_lote);
        if (Array.isArray(animales) && animales.length > 0) {
          Alert.alert('Éxito', 'Animales encontrados correctamente.');
          const numerosCaravana = animales.map(animal => animal.numeroCaravana);
          setCaravanas(numerosCaravana);

          // Buscar tratamiento y sangrado para el primer animal encontrado
          if (animales.length > 0) {
            const primerAnimal = animales[0];
            const [tratamiento, sangrado] = await Promise.all([
              buscarTratam(userId, primerAnimal.numeroCaravana),
              buscarSan(userId, primerAnimal.numeroCaravana)
            ]);
            setTratamientoEncontrado(tratamiento);
            setSangradoEncontrado(sangrado);
          }
        } else {
          Alert.alert('Animales no encontrados', 'No se encontraron animales con ese número de lote. Inténtelo de nuevo.', [
            { text: 'OK', onPress: () => setNumeroLote('') }
          ]);
        }
      } catch (error) {
        console.error('Error al buscar animales:', error);
        Alert.alert('Error', 'Hubo un error al buscar los animales. Por favor, inténtelo de nuevo.');
      }
    };
    buscar();
  }, [userId, numero_lote]);

  const selectAllAnimals = () => {
    if (selectedAnimals.length === animals.length) {
      setSelectedAnimals([]);
    } else {
      setSelectedAnimals(animals.map(animal => animal.id));
    }
  };

  const handleSearchAnimal = async () => {
    try {
      const animal = await buscarAnimal(userId, caravanaNumber);
      if (animal && animal.numeroCaravana === caravanaNumber) {
        setAnimalEncontrado(animal);
        setIsModalVisible(true); // Mostrar el modal al encontrar el animal

        // Buscar tratamiento y sangrado al encontrar el animal
        const [tratamiento, sangrado] = await Promise.all([
          buscarTratam(userId, caravanaNumber),
          buscarSan(userId, caravanaNumber)
        ]);
        setTratamientoEncontrado(tratamiento);
        setSangradoEncontrado(sangrado);
      } else {
        Alert.alert('Animal no encontrado', 'No se encontró un animal con ese número de caravana. Inténtelo de nuevo.', [
          { text: 'OK', onPress: () => setCaravanaNumber('') }
        ]);
      }
    } catch (error) {
      console.error('Error searching animal:', error);
      Alert.alert('Error', 'Error al buscar el animal. Inténtalo de nuevo más tarde.');
    }
  };

  const handleUpdateLoteName = async () => {
    try {
      await actualizarNombreLote(lote.id, newLoteName);
      Alert.alert('Éxito', 'El nombre del lote ha sido actualizado.');
      lote.nombre_lote = newLoteName;
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error updating lote name:', error);
      Alert.alert('Error', 'No se pudo actualizar el nombre del lote. Inténtalo de nuevo más tarde.');
    }
  };

  const handleCaravanaPress = async (numeroCaravana) => {
    try {
      const animal = await buscarAnimal(userId, numeroCaravana);
      if (animal && animal.numeroCaravana === numeroCaravana) {
        setAnimalEncontrado(animal);
        setIsModalVisible(true); // Mostrar el modal al seleccionar una caravana

        // Buscar tratamiento y sangrado al seleccionar una caravana
        const [tratamiento, sangrado] = await Promise.all([
          buscarTratam(userId, numeroCaravana),
          buscarSan(userId, numeroCaravana)
        ]);
        setTratamientoEncontrado(tratamiento);
        setSangradoEncontrado(sangrado);
      } else {
        Alert.alert('Animal no encontrado', 'No se encontró un animal con ese número de caravana.');
      }
    } catch (error) {
      console.error('Error al buscar animal:', error);
      Alert.alert('Error', 'Hubo un error al buscar el animal. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <ThemedText style={styles.title}>{lote.nombre_lote}</ThemedText>
          <TouchableOpacity style={styles.iconButton} onPress={() => setIsModalVisible(true)}>
            <FontAwesomeIcon icon={faPen} size={20} color="#407157" />
          </TouchableOpacity>
        </View>
        <View style={styles.rightHeader}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('vistas/IngresoAnimal')}>
            <FontAwesomeIcon icon={faPlus} size={20} color="#407157" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesomeIcon icon={faTrash} size={20} color="#407157" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Text style={styles.label}>Buscar Animal</Text>
        <TextInput
          style={styles.input}
          placeholder="Número de caravana"
          value={caravanaNumber}
          onChangeText={setCaravanaNumber}
          placeholderTextColor="#666666"
        />
        <TouchableOpacity style={styles.button} onPress={handleSearchAnimal}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.caravanasList}>
        {caravanas.map((numero_caravana, index) => (
          <TouchableOpacity key={index} style={styles.caravanaItem} onPress={() => handleCaravanaPress(numero_caravana)}>
            <Text style={styles.caravanaText}>N°: {numero_caravana}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Modal isVisible={isModalVisible} animationIn="fadeIn" animationOut="fadeOut">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Detalle del Animal</Text>
          {animalEncontrado && (
            <View style={styles.animalDetail}>
              <ThemedText style={styles.detail}>N° {animalEncontrado.numeroCaravana}</ThemedText>
              <ThemedText style={styles.detail}>Edad: {animalEncontrado.edad} años</ThemedText>
              <ThemedText style={styles.detail}>Lote: {animalEncontrado.numero_lote}</ThemedText>
              <ThemedText style={styles.detail}>Peso: {animalEncontrado.peso} kg</ThemedText>
              <ThemedText style={styles.detail}>Preñada: {animalEncontrado.preniada ? 'Sí' : 'No'}</ThemedText>
            </View>
          )}
          {tratamientoEncontrado && tratamientoEncontrado.tratamiento ? (
            <View style={styles.tratamientoDetail}>
              <ThemedText style={styles.detail}>Tratamiento: {tratamientoEncontrado.tratamiento}</ThemedText>
              <ThemedText style={styles.detail}>Medicación: {tratamientoEncontrado.medicacion}</ThemedText>
              <ThemedText style={styles.detail}>Fecha Inicio: {tratamientoEncontrado.fechaInicio}</ThemedText>
              <ThemedText style={styles.detail}>Cada: {tratamientoEncontrado.cada} días</ThemedText>
              <ThemedText style={styles.detail}>Durante: {tratamientoEncontrado.durante} días</ThemedText>
            </View>
          ) : (
            <Text style={styles.detail}>No hay tratamiento registrado</Text>
          )}
          {sangradoEncontrado && sangradoEncontrado.numero_tubo ? (
            <View style={styles.sangradoDetail}>
              <ThemedText style={styles.detail}>Número tubo: {sangradoEncontrado.numero_tubo}</ThemedText>
              <ThemedText style={styles.detail}>Fecha: {sangradoEncontrado.fecha}</ThemedText>
            </View>
          ) : (
            <Text style={styles.detail}>No hay sangrado registrado</Text>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightHeader: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
  searchContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
    color: '#333333',
  },
  button: {
    backgroundColor: '#407157',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  caravanasList: {
    marginBottom: 20,
  },
  caravanaItem: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  caravanaText: {
    fontSize: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  animalDetail: {
    marginBottom: 10,
  },
  tratamientoDetail: {
    marginBottom: 10,
  },
  sangradoDetail: {
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: '#407157',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default AnimalSearchScreen;
