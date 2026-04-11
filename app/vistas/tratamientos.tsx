import React, { useContext, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Asegúrate de que la ruta es correcta
import { ThemedView } from '@/components/ThemedView'; // Asegúrate de que la ruta es correcta
import { UserContext } from '../../api/UserContext';
import { createTratamiento } from '../../api/api';
import { DateCarouselPicker } from '@/components/DateCarouselPicker';
import { getNumeroCaravanaError, NUMERO_CARAVANA_MAX_LENGTH, sanitizeNumeroCaravana } from '@/utils/caravana';
import { DismissKeyboardView } from '@/components/DismissKeyboardView';

const TratamientosScreen = () => {
  const [numeroCaravana, setNumeroCaravana] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [medicacion, setMedicacion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [durante, setDuracion] = useState('');
  const [cada, setCada] = useState('');
  const { userId } = useContext(UserContext);

  const handleGuardar = async () => {
    const numeroCaravanaError = getNumeroCaravanaError(numeroCaravana);

    if (numeroCaravanaError) {
      Alert.alert('Error', numeroCaravanaError);
      return;
    }

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
    } catch (error: any) {
      console.error('Error al registrar el tratamiento:', error.message);
      Alert.alert('Error', 'No se pudo guardar el tratamiento.');
    }
  }

  return (
    <DismissKeyboardView>
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Tratamientos</ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Número de caravana"
        placeholderTextColor='#565859'
        value={numeroCaravana}
        onChangeText={(text) => setNumeroCaravana(sanitizeNumeroCaravana(text))}
        keyboardType="number-pad"
        maxLength={NUMERO_CARAVANA_MAX_LENGTH}
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre del Tratamiento"
        placeholderTextColor='#565859'
        value={tratamiento}
        onChangeText={setTratamiento}
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre de la Medicación"
        placeholderTextColor='#565859'
        value={medicacion}
        onChangeText={setMedicacion}
      />

      <DateCarouselPicker value={fechaInicio} onChange={setFechaInicio} />

      <TextInput
        style={styles.input}
        placeholder="Durante/Duración (días)"
        placeholderTextColor='#565859'
        value={durante}
        onChangeText={setDuracion}
      />

      <TextInput
        style={styles.input}
        placeholder="Cada..(días)"
        placeholderTextColor='#565859'
        value={cada}
        onChangeText={setCada}
      />

      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
          <ThemedText style={styles.buttonText}>Agregar al calendario</ThemedText>
        </TouchableOpacity>
    </ThemedView>
    </DismissKeyboardView>
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
    paddingHorizontal: 20,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default TratamientosScreen;
