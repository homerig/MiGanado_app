import React, { useContext, useState } from 'react';
import { View, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, Text, Platform,Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Asegúrate de que la ruta es correcta
import { ThemedView } from '@/components/ThemedView'; // Asegúrate de que la ruta es correcta
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../api/UserContext';

import { createVacunacion } from '@/api/api';

const VacunacionScreen = () => {
  const [numero_lote, setNumeroLote] = useState('');
  const [nombre_vacuna, setNombreVacuna] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [durante, setDurante] = useState('');
  const [cada, setCada] = useState('');
  const { userId } = useContext(UserContext);
  
  const navigation = useNavigation();

  const handleGuardar = async () => {
    try {
      const Nuevotratamiento = await createVacunacion({ numero_lote, nombre_vacuna , fechaInicio,  durante,cada, userId });
      console.log("Tratamiento registrado:", Nuevotratamiento);
      setNumeroLote('');
      setNombreVacuna('');
      setFechaInicio('');
      setDurante('');
      setCada('');
      Alert.alert('Éxito', 'Vacunacion registrada correctamente.');
    } catch (error) {
      console.error('Error al registrar la vacunacion:', error.message);
      Alert.alert('Error', 'No se pudo guardar la vacunacion.');
    }
  }

 



  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Vacunación</ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Seleccione Lote"
        value={numero_lote}
        onChangeText={setNumeroLote}
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre de la Vacuna"
        value={nombre_vacuna}
        onChangeText={setNombreVacuna}
      />

<TextInput
        style={styles.input}
        placeholder="Fecha (YYYY-MM-DD)"
        value={fechaInicio}
        onChangeText={setFechaInicio}
      />

      <TextInput
        style={styles.input}
        placeholder="Durante/Duración (dias)"
        value={durante}
        onChangeText={setDurante}
      />

      <TextInput
        style={styles.input}
        placeholder="Cada..(dias)"
        value={cada}
        onChangeText={setCada}
      />
      <View style={styles.button}>
        <TouchableOpacity style={styles.button} onPress={handleGuardar}>
          <ThemedText style={styles.buttonText}>Agregar al calendario</ThemedText>
        </TouchableOpacity>
      </View>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
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
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#407157',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalItem: {
    padding: 10,
    color:  '#407157',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  closeText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default VacunacionScreen;
