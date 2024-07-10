import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Asegúrate de que la ruta es correcta
import { ThemedView } from '@/components/ThemedView'; // Asegúrate de que la ruta es correcta

export default function IngresarAnimalScreen() {
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [selectedLote, setSelectedLote] = useState<string>('');
  const [numeroCaravana, setNumeroCaravana] = useState<string>('');
  const [sexo, setSexo] = useState<string>('');
  const [peso, setPeso] = useState<string>('');
  const [edad, setEdad] = useState<string>('');
  const [isPregnant, setIsPregnant] = useState<boolean>(false);
  const [isNewborn, setIsNewborn] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isTipoModalVisible, setIsTipoModalVisible] = useState<boolean>(false);
  const [tipos] = useState<string[]>(['Vaca', 'Toro']); // Agrega más tipos según sea necesario
  const [lotes] = useState<string[]>(['Lote 1', 'Lote 2']); // Agrega más lotes según sea necesario

  const selectTipo = (tipo: string) => {
    setSelectedTipo(tipo);
    setIsTipoModalVisible(false);
  };

  const selectLote = (lote: string) => {
    setSelectedLote(lote);
    setIsModalVisible(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Ingresar Animal</ThemedText>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsTipoModalVisible(true)}
      >
        <Text>{selectedTipo || 'Seleccione tipo'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsModalVisible(true)}
      >
        <Text>{selectedLote || 'Seleccione Lote'}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Número de caravana"
        value={numeroCaravana}
        onChangeText={setNumeroCaravana}
      />

      <ThemedText style={styles.subLabel}>Historial Médico</ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Sexo"
        value={sexo}
        onChangeText={setSexo}
      />

      <TextInput
        style={styles.input}
        placeholder="Peso"
        value={peso}
        onChangeText={setPeso}
      />

      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
      />

      <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxLabel}>Recién nacido</Text>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setIsNewborn(!isNewborn)}
        >
          {isNewborn && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxLabel}>Preñada</Text>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setIsPregnant(!isPregnant)}
        >
          {isPregnant && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.grayButton}
        onPress={() => {
          // Lógica para agregar tratamiento
          console.log('Agregar Tratamiento');
        }}
      >
        <ThemedText style={styles.grayButtonText}>Agregar Tratamiento</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.greenButton}
        onPress={() => {
          // Lógica para guardar el animal
          console.log({
            selectedTipo,
            selectedLote,
            numeroCaravana,
            sexo,
            peso,
            edad,
            isNewborn,
            isPregnant,
          });
        }}
      >
        <ThemedText style={styles.greenButtonText}>Guardar</ThemedText>
      </TouchableOpacity>

      <Modal
        visible={isTipoModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={tipos}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => selectTipo(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setIsTipoModalVisible(false)}>
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isModalVisible}
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
  subLabel: {
    fontSize: 18,
    padding: 2,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
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
  grayButton: {
    backgroundColor: '#A9A9A9',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  grayButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  greenButton: {
    backgroundColor: '#407157',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  greenButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#407157',
    fontSize: 18,
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
