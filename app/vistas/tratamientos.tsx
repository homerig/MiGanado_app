import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Asegúrate de que la ruta es correcta
import { ThemedView } from '@/components/ThemedView'; // Asegúrate de que la ruta es correcta
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TratamientosScreen() {
  const [numeroCaravana, setNumeroCaravana] = useState<string>('');
  const [tratamiento, setTratamiento] = useState<string>('');
  const [medicacion, setMedicacion] = useState<string>('');
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [duracion, setDuracion] = useState<string>('');
  const [cada, setCada] = useState<string>('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setIsDatePickerVisible(false);
    if (selectedDate) {
      setFechaInicio(selectedDate);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Seleccione fecha de inicio';
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses son indexados desde 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Tratamientos</ThemedText>

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

      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsDatePickerVisible(true)}
      >
        <Text>{formatDate(fechaInicio)}</Text>
      </TouchableOpacity>

      {isDatePickerVisible && (
        <DateTimePicker
          value={fechaInicio || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

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

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // Lógica para agregar al calendario
          console.log({
            numeroCaravana,
            tratamiento,
            medicacion,
            fechaInicio: fechaInicio ? formatDate(fechaInicio) : '',
            duracion,
            cada,
          });
        }}
      >
        <ThemedText style={styles.buttonText}>Agregar al calendario</ThemedText>
      </TouchableOpacity>
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
});
