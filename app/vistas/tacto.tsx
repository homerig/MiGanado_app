import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Asegúrate de que la ruta es correcta
import { ThemedView } from '@/components/ThemedView'; // Asegúrate de que la ruta es correcta

export default function TactoScreen() {
  const [isChecked, setChecked] = useState(false);
  const [selectedLote, setSelectedLote] = useState<string>('');
  const [numeroCaravana, setNumeroCaravana] = useState<string>('');
  const [isLoteModalVisible, setIsLoteModalVisible] = useState<boolean>(false);
  const [lotes] = useState<string[]>(['Lote 1', 'Lote 2']); // Agrega más lotes según sea necesario

  const selectLote = (lote: string) => {
    setSelectedLote(lote);
    setIsLoteModalVisible(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Tacto</ThemedText>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsLoteModalVisible(true)}
      >
        <Text>{selectedLote || 'Seleccione Lote'}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Número de caravana"
        value={numeroCaravana}
        onChangeText={setNumeroCaravana}
      />

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setChecked(!isChecked)}
        >
          <View style={styles.box}>
            {isChecked && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
        <ThemedText style={styles.label}>Preñada</ThemedText>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Siguiente</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Finalizar</ThemedText>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isLoteModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={lotes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => selectLote(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setIsLoteModalVisible(false)}>
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
    color: '#407157',
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
