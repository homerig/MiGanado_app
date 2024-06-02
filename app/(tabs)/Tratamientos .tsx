import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const TratamientosForm = () => {
  const [numeroCaravana, setNumeroCaravana] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [medicacion, setMedicacion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [duracion, setDuracion] = useState('');
  const [cada, setCada] = useState('');

  const handleSave = () => {
    // Logica para guardar los datos
    console.log({
      numeroCaravana, tratamiento, medicacion, fechaInicio, duracion, cada
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tratamientos</Text>

      <TextInput
        style={styles.input}
        placeholder="Números de caravana"
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
        placeholder="Fecha de inicio"
        value={fechaInicio}
        onChangeText={setFechaInicio}
      />

      <TextInput
        style={styles.input}
        placeholder="Durante/Duración"
        value={duracion}
        onChangeText={setDuracion}
      />

      <TextInput
        style={styles.input}
        placeholder="Cada.."
        value={cada}
        onChangeText={setCada}
      />

      <TouchableOpacity style={styles.greenButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Agregar al calendario</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    paddingLeft: 8,
  },
  greenButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    borderRadius: 40,
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TratamientosForm;