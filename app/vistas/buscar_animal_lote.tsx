import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Text } from 'react-native';
import Modal from 'react-native-modal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { buscarAnimal, actualizarNombreLote, buscarAnimalLote } from '../../api/api';
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

  const toggleAnimalSelection = (id) => {
    setSelectedAnimals(prevSelectedAnimals => {
      if (prevSelectedAnimals.includes(id)) {
        return prevSelectedAnimals.filter(animalId => animalId !== id);
      } else {
        return [...prevSelectedAnimals, id];
      }
    });
  };

  useEffect(() => {
    const buscar = async () => {
      try {
        const animales = await buscarAnimalLote(userId, numero_lote);
        if (Array.isArray(animales) && animales.length > 0) {
          Alert.alert('Éxito', 'Animales encontrados correctamente.');
          const numerosCaravana = animales.map(animal => animal.numeroCaravana);
          setCaravanas(numerosCaravana);
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
          <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
            <Text style={styles.modalButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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
    color: '#407157',
  },
  iconButton: {
    marginLeft: 10,
  },
  searchContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#407157',
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#407157',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  caravanasList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  caravanaItem: {
    width: '48%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  caravanaText: {
    fontSize: 14,
    color: '#407157',
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
    color: '#407157',
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
  animalDetail: {
    alignItems: 'center',
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
    color: '#407157',
  },
});

export default AnimalSearchScreen;
