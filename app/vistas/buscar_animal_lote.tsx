import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Text, Image } from 'react-native';
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
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [newLoteName, setNewLoteName] = useState('');

  const [caravanas, setCaravanas] = useState([]);

  const [animalEncontrado, setAnimalEncontrado] = useState(null);
  const [tratamientoEncontrado, setTratamientoEncontrado] = useState(null);
  const [sangradoEncontrado, setSangradoEncontrado] = useState(null);

  useEffect(() => {
    const buscar = async () => {

        const animales = await buscarAnimalLote(userId, numero_lote);
        if (Array.isArray(animales) && animales.length > 0) {
          const numerosCaravana = animales.map(animal => animal.numeroCaravana);
          setCaravanas(numerosCaravana);

          // Buscar tratamiento y sangrado para el primer animal encontrado
          if (animales.length > 0) {
            const primerAnimal = animales[0];
            console.log(primerAnimal.numeroCaravana);
            const [tratamiento, sangrado] = await Promise.all([
              buscarTratam(userId, primerAnimal.numeroCaravana),
              buscarSan(userId, primerAnimal.numeroCaravana)
            ]);
            setTratamientoEncontrado(tratamiento);
            setSangradoEncontrado(sangrado);
          }
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
      const animal = await buscarAnimal(userId, caravanaNumber);
      if (animal && animal.numeroCaravana === caravanaNumber) {
        setAnimalEncontrado(animal);
        console.log(animal.tipos);
        setIsModalVisible(true); // Mostrar el modal al encontrar el animal

        // Buscar tratamiento y sangrado al encontrar el animal
        const [tratamiento, sangrado] = await Promise.all([
          buscarTratam(userId, caravanaNumber),
          buscarSan(userId, caravanaNumber)
        ]);
        setTratamientoEncontrado(tratamiento);
        setSangradoEncontrado(sangrado);
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
      const animal = await buscarAnimal(userId, numeroCaravana);
      if (animal && animal.numeroCaravana === numeroCaravana) {
        setAnimalEncontrado(animal);
        setIsUpdateModalVisible(true); // Mostrar el modal al seleccionar una caravana

        // Buscar tratamiento y sangrado al seleccionar una caravana
        const [tratamiento, sangrado] = await Promise.all([
          buscarTratam(userId, numeroCaravana),
          buscarSan(userId, numeroCaravana)
        ]);
        setTratamientoEncontrado(tratamiento);
        setSangradoEncontrado(sangrado);
      } 
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <ThemedText type='title' style={styles.title}>{lote.nombre_lote}</ThemedText>
          <TouchableOpacity style={styles.iconButton} onPress={() => setIsUpdateModalVisible(true)}>
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
        <ThemedText type="defaultSemiBold" style={styles.label}>Buscar Animal</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Número de caravana"
          value={caravanaNumber}
          onChangeText={setCaravanaNumber}
          placeholderTextColor="#666666"
        />
        <TouchableOpacity style={styles.button} onPress={handleSearchAnimal}>
          <ThemedText style={styles.buttonText}>Buscar</ThemedText>
        </TouchableOpacity>
      </View>
      <ThemedText type='subtitle' style={styles.subtitle}>Animales en el lote</ThemedText>
      <View style={styles.caravanasList}>
        {caravanas.map((numero_caravana, index) => (
          <TouchableOpacity key={index} style={styles.caravanaItem} onPress={() => handleCaravanaPress(numero_caravana)}>
          <View style={styles.caravanaContent}>
            <Image source={require('@/assets/images/MiGanado_logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.caravanaText}>N°: {numero_caravana}</Text>
          </View>
        </TouchableOpacity>
        ))}
      </View>
      <Modal isVisible={isModalVisible} animationIn="fadeIn" animationOut="fadeOut">
        <View style={styles.modalContent}>
          {animalEncontrado && (
            <View style={styles.animalDetail}>
              <ThemedText type='subtitle' style={styles.modalTitle}>Detalle del Animal N°{animalEncontrado.numeroCaravana}</ThemedText>
              <ThemedText style={styles.detail}>Edad: {animalEncontrado.edad} años</ThemedText>
              <ThemedText style={styles.detail}>Peso: {animalEncontrado.peso} kg</ThemedText>
              { !(animalEncontrado.tipos.includes("toro") || animalEncontrado.tipos.includes("Toro")) && (
                <ThemedText style={styles.detail}>Preñada: {animalEncontrado.preniada ? 'Sí' : 'No'}</ThemedText>
              )}
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
            <ThemedText type="caption" style={styles.detail}>No hay tratamientos registrados</ThemedText>
          )}
          {sangradoEncontrado && sangradoEncontrado.numero_tubo ? (
            <View style={styles.sangradoDetail}>
              <ThemedText style={styles.detail}>Número tubo: {sangradoEncontrado.numero_tubo}</ThemedText>
              <ThemedText style={styles.detail}>Fecha: {sangradoEncontrado.fecha}</ThemedText>
            </View>
          ) : (
            <ThemedText type="caption" style={styles.detail}>No hay sangrados registrados</ThemedText>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal isVisible={isUpdateModalVisible} animationIn="fadeIn" animationOut="fadeOut">
        <View style={styles.modalContent}>
          <ThemedText type='subtitle' style={styles.modalTitle}>Actualizar Nombre del Lote</ThemedText>
          <TextInput
            style={styles.modalInput}
            placeholder="Nuevo nombre del lote"
            value={newLoteName}
            onChangeText={setNewLoteName}
            placeholderTextColor="#666666"
          />

        <View style={{flexDirection: 'row',alignItems: 'center', gap: 20, justifyContent: 'center', marginTop: 10}}>

          <TouchableOpacity style={styles.modalButton} onPress={handleUpdateLoteName}>
            <ThemedText style={styles.modalButtonText}>Actualizar</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsUpdateModalVisible(false)}>
            <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
          </TouchableOpacity>   
        </View>
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
    paddingTop: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightHeader: {
    flexDirection: 'row',
  },
  title: {
    marginRight: 10,
  },
  iconButton: {
    marginLeft: 10,
  },
  searchContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
    color: '#333333',
  },
  button: {
    backgroundColor: '#407157',
    borderRadius: 99,
    paddingVertical: 12,
    marginHorizontal: '30%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
  },
  caravanasList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  caravanaItem: {
    width: '48%',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  caravanaText: {
    fontSize: 16,
    gap: 10,
  },
  caravanaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
  },
  modalTitle: {
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 25,
    marginRight: 10,
  },
  subtitle:{
    padding: 10,
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
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
  },
});

export default AnimalSearchScreen;
