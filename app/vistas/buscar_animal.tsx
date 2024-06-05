import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Asegúrate de que la ruta es correcta
import { ThemedView } from '@/components/ThemedView'; // Asegúrate de que la ruta es correcta
import { Link } from 'expo-router';

export default function BuscarAnimalScreen() {
  const [selectedLote, setSelectedLote] = useState<string>('');
  const [selectedTipo, setSelectedTipo] = useState<string>('');
  const [numeroCaravana, setNumeroCaravana] = useState<string>('');
  const [isLoteModalVisible, setIsLoteModalVisible] = useState<boolean>(false);
  const [isTipoModalVisible, setIsTipoModalVisible] = useState<boolean>(false);
  const [lotes] = useState<string[]>(['Lote 1', 'Lote 2']); // Agrega más lotes según sea necesario
  const [tipos] = useState<string[]>(['Toro', 'Vaca']); // Agrega más tipos según sea necesario

  const selectLote = (lote: string) => {
    setSelectedLote(lote);
    setIsLoteModalVisible(false);
  };

  const selectTipo = (tipo: string) => {
    setSelectedTipo(tipo);
    setIsTipoModalVisible(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Buscar Animal</ThemedText>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsLoteModalVisible(true)}
      >
        <Text>{selectedLote || 'Seleccione Lote'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setIsTipoModalVisible(true)}
      >
        <Text>{selectedTipo || 'Seleccione Tipo'}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Número de caravana"
        value={numeroCaravana}
        onChangeText={setNumeroCaravana}
      />
 <Link href={"vistas/ver_animal"} style={styles.button}>
      <View style={styles.buttonContainer}>
          
            <ThemedText style={styles.buttonText}>Buscar</ThemedText>
     
      </View>
      </Link>

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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  buttonContent:{
    flexDirection:'row',
    alignItems:'center',
    width:'100%'
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
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 20,
  },
  button: {
    backgroundColor: '#407157',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 20,
    alignItems: 'center',
    width: '40%',
    textAlign: 'center', // Ensure the link text is centered
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 50,
    justifyContent: 'center',
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
    borderRadius: 20,
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
