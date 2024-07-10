import React, { useContext, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Platform, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Asegúrate de que la ruta es correcta
import { ThemedView } from '@/components/ThemedView'; // Asegúrate de que la ruta es correcta
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../api/UserContext';
import { createTratamiento } from '../../api/api';

const TratamientosScreen = () => {
  const [numeroCaravana, setNumeroCaravana] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [medicacion, setMedicacion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [durante, setDuracion] = useState('');
  const [cada, setCada] = useState('');
  const { userId } = useContext(UserContext);
  const navigation = useNavigation();

  const handleGuardar = async () => {
    try {
      const Nuevotratamiento = await createTratamiento({ numeroCaravana, tratamiento , medicacion, fechaInicio, cada, durante, userId });
      console.log("Tratamiento registrado:", Nuevotratamiento);
      setNumeroCaravana('');
      setTratamiento('');
      setMedicacion('');
      setFechaInicio('');
      setCada('');
      setDuracion('');
      Alert.alert('Éxito', 'Tratamiento registrado correctamente.');
    } catch (error) {
      console.error('Error al registrar el tratamiento:', error.message);
      Alert.alert('Error', 'No se pudo guardar el tratamiento.');
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Tratamientos</ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Número de caravana"
        value={numeroCaravana}
        onChangeText={setNumeroCaravana}
      />

      <TextInput
        style={styles.input}
        placeholder="Tratamiento"
        value={tratamiento}
        onChangeText={setTratamiento}
      />

      <TextInput
        style={styles.input}
        placeholder="Medicación"
        value={medicacion}
        onChangeText={setMedicacion}
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
        onChangeText={setDuracion}
      />

      <TextInput
        style={styles.input}
        placeholder="Cada..(dias)"
        value={cada}
        onChangeText={setCada}
      />
      <View style={styles.buttonContainer}>
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
    backgroundColor: '#F1F1F1',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default TratamientosScreen;
