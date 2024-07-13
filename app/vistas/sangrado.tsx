import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserContext } from '../../api/UserContext';
import { createSangrado } from '../../api/api';

const SangradoScreen = () => {
  const [numero_lote, setNumeroLote] = useState('');
  const [numeroCaravana, setNumeroCaravana] = useState('');
  const [numero_tubo, setNumeroTuboEnsayo] = useState('');
  const [fecha, setFecha] = useState('');
  const { userId } = useContext(UserContext);
  const navigation = useNavigation();

  const handleFinalizar = async () => {
    try {
      await handlesig(); // Llama a handlesig para registrar el sangrado
      navigation.navigate('(tabs)'); // Navega a la pantalla principal después de finalizar
    } catch (error) {
      console.error('Error al finalizar:', error.message);
      Alert.alert('Error', 'No se pudo completar la acción.');
    }
  };

  const handlesig = async () => {
    try {
      const sangrado = await createSangrado({ numero_lote, numeroCaravana, numero_tubo, fecha, userId });
      console.log("Sangrado registrado:", sangrado);
      // Limpiar los campos después de guardar exitosamente
      setNumeroLote('');
      setNumeroCaravana('');
      setNumeroTuboEnsayo('');
      setFecha('');
      Alert.alert('Éxito', 'Sangrado registrado correctamente.');
    } catch (error) {
      console.error('Error al registrar el sangrado:', error.message);
      Alert.alert('Error', 'No se pudo guardar el sangrado.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Sangrado</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Seleccione Lote"
        value={numero_lote}
        onChangeText={setNumeroLote}
      />
      <TextInput
        style={styles.input}
        placeholder="Número de caravana"
        value={numeroCaravana}
        onChangeText={setNumeroCaravana}
      />
      <TextInput
        style={styles.input}
        placeholder="Número del tubo de ensayo"
        value={numero_tubo}
        onChangeText={setNumeroTuboEnsayo}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha (YYYY-MM-DD)"
        value={fecha}
        onChangeText={setFecha}
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlesig}>
          <ThemedText style={styles.buttonText}>Siguiente</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleFinalizar}>
          <ThemedText style={styles.buttonText}>Finalizar</ThemedText>
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
  title: {
    fontSize: 24,
    padding: 5,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    marginHorizontal: -2,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SangradoScreen;
