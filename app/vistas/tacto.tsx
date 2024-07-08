import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Asegúrate de que la ruta es correcta
import { ThemedView } from '@/components/ThemedView'; // Asegúrate de que la ruta es correcta
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../api/UserContext';
import { createTacto } from '../../api/api';

export default function TactoScreen() {
  const [numero_lote, setNumeroLote] = useState('');
  const [numero_animal, setNumeroCaravana] = useState('');
  const [prenada, setPrenada] = useState(false);
  const { userId } = useContext(UserContext);
  const navigation = useNavigation();
  
  const handleFinalizar = async () => {
    try {
      await handlesig(); // Llama a handlesig para registrar el tacto
      navigation.navigate('(tabs)'); // Navega a la pantalla principal después de finalizar
    } catch (error) {
      console.error('Error al finalizar:', error.message);
      Alert.alert('Error', 'No se pudo completar la acción.');
    }
  };

  const handlesig = async () => {
    try {
      const tacto = await createTacto({ numero_lote, numero_animal, prenada, userId });
      console.log("Tacto registrado:", tacto);
      // Limpiar los campos después de guardar exitosamente
      setNumeroLote('');
      setNumeroCaravana('');
      setPrenada(false);
      Alert.alert('Éxito', 'Tacto registrado correctamente.');
    } catch (error) {
      console.error('Error al registrar el tacto:', error.message);
      Alert.alert('Error', 'No se pudo guardar el tacto.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Tacto</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Seleccione Lote"
        value={numero_lote}
        onChangeText={setNumeroLote}
      />
      <TextInput
        style={styles.input}
        placeholder="Número de caravana"
        value={numero_animal}
        onChangeText={setNumeroCaravana}
      />
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setPrenada(!prenada)}
        >
          <View style={styles.box}>
            {prenada && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
        <ThemedText style={styles.label}>Preñada</ThemedText>
      </View>
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
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 8,
  },
  box: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#407157',
    fontSize: 18,
  },
  label: {
    margin: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#407157',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
