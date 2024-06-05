import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SangradoScreen() {
  const [selectedLot, setSelectedLot] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [lots] = useState<string[]>(['Lote 1', 'Lote 2']); // Agrega más lotes según sea necesario

  const selectLot = (lot: string) => {
    setSelectedLot(lot);
    setIsModalVisible(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Sangrado</ThemedText>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsModalVisible(true)}
      >
        <Text>{selectedLot || 'Seleccione Lote'}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Número de caravana"
      />
      <TextInput
        style={styles.input}
        placeholder="Número del tubo de ensayo"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Siguiente</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Finalizar</ThemedText>
        </TouchableOpacity>
      </View>

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
  title: {
    fontSize: 24,
    padding: 5,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left', // Alinear el texto a la izquierda
    marginHorizontal: -2, // Añadir margen horizontal para asegurar que no se corte
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
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
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
    color: '#407157',
    fontSize: 16,
  },
});
