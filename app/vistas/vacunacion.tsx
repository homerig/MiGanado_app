import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, Text, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Asegúrate de que la ruta es correcta
import { ThemedView } from '@/components/ThemedView'; // Asegúrate de que la ruta es correcta
import DateTimePicker from '@react-native-community/datetimepicker';

export default function VaccinationScreen() {
  const [selectedLot, setSelectedLot] = useState<string>('');
  const [vaccineName, setVaccineName] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState<string>('');
  const [interval, setInterval] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);
  const [lots] = useState<string[]>(['Lote 1', 'Lote 2']); // Agrega más lotes según sea necesario

  const selectLot = (lot: string) => {
    setSelectedLot(lot);
    setIsModalVisible(false);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setIsDatePickerVisible(false);
    if (selectedDate) {
      setStartDate(selectedDate);
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
      <ThemedText style={styles.label}>Vacunación</ThemedText>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsModalVisible(true)}
      >
        <Text>{selectedLot || 'Seleccione Lote'}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la Vacuna"
        value={vaccineName}
        onChangeText={setVaccineName}
      />

      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsDatePickerVisible(true)}
      >
        <Text>{formatDate(startDate)}</Text>
      </TouchableOpacity>

      {isDatePickerVisible && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Durante / Duración"
        value={duration}
        onChangeText={setDuration}
      />

      <TextInput
        style={styles.input}
        placeholder="Cada"
        value={interval}
        onChangeText={setInterval}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // Lógica para agregar al calendario
          console.log({
            selectedLot,
            vaccineName,
            startDate: startDate ? formatDate(startDate) : '',
            duration,
            interval
          });
        }}
      >
        <ThemedText style={styles.buttonText}>Agregar al calendario</ThemedText>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={lots}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => selectLot(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
