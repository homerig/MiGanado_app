import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { faCow, faPen, faTrash, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { buscarAnimal } from '../../api/api';
import { UserContext } from '../../api/UserContext';

const BuscarAnimalScreen = () => {
  const [idLote, setIdLote] = useState('');
  const [numeroCaravana, setNumeroCaravana] = useState('');
  const [animalEncontrado, setAnimalEncontrado] = useState(null); // Estado para almacenar los datos del animal encontrado
  const { userId } = useContext(UserContext);

  const buscar = async () => {
    try {
      const animal = await buscarAnimal(userId, idLote, numeroCaravana);
      setAnimalEncontrado(animal); // Guardar el animal encontrado en el estado
    } catch (error) {
      console.error('Error al buscar animal:', error);
      // Manejo de errores aquí si es necesario
    }
  };

  const resetForm = () => {
    setIdLote('');
    setNumeroCaravana('');
    setAnimalEncontrado(null); // Limpiar el estado para mostrar el formulario vacío
  };

  return (
    <ThemedView style={styles.container}>
      {!animalEncontrado ? (
        <>
          <ThemedText style={styles.title}>Buscar Animal</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Seleccione Lote"
            placeholderTextColor="#666666"
            value={idLote}
            onChangeText={setIdLote}
            autoCapitalize="none"
          />
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
            <ThemedText><FontAwesomeIcon icon={faChevronLeft} size={20} style={styles.iconVolver}/>
            Volver a buscar</ThemedText>
          </TouchableOpacity>
          <View style={styles.animalDetailContainer}>
            <ThemedText style={styles.detail}>N° {animalEncontrado.numeroCaravana}</ThemedText>
            <ThemedText style={styles.detail}>Edad: {animalEncontrado.edad} años</ThemedText>
            <ThemedText style={styles.detail}>Lote: {animalEncontrado.numero_lote}</ThemedText>
            <ThemedText style={styles.detail}>Peso: {animalEncontrado.peso} kg</ThemedText>
            <ThemedText style={styles.detail}>Preñada: {animalEncontrado.preniada ? 'Sí' : 'No'}</ThemedText>
          </View>
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
    padding: 20, // Añadir un padding adicional para los detalles del animal
    backgroundColor: '#f0f0f0', // Color de fondo para distinguir los detalles del formulario
    borderRadius: 10, // Borde redondeado
  },
  detail: {
    fontSize: 18,
    marginBottom: 5,
  },
  iconVolver:{
    marginRight: 8,
  }
});

export default BuscarAnimalScreen;
