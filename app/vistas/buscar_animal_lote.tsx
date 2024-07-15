import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const AnimalSearchScreen = () => {
  const [selectedType, setSelectedType] = useState('');
  const [caravanaNumber, setCaravanaNumber] = useState('');
  const [selectedAnimals, setSelectedAnimals] = useState([]);

  const animals = [
    { id: 1, tag: '200H' },
    { id: 2, tag: '205H' },
    { id: 3, tag: '134G' },
    { id: 4, tag: '235G' },
    { id: 5, tag: 'A533' },
    { id: 6, tag: 'A513' },
    { id: 7, tag: 'A514' },
    { id: 8, tag: 'A510' }
  ];

  const toggleAnimalSelection = (id) => {
    setSelectedAnimals(prevSelectedAnimals => {
      if (prevSelectedAnimals.includes(id)) {
        return prevSelectedAnimals.filter(animalId => animalId !== id);
      } else {
        return [...prevSelectedAnimals, id];
      }
    });
  };

  const selectAllAnimals = () => {
    if (selectedAnimals.length === animals.length) {
      setSelectedAnimals([]);
    } else {
      setSelectedAnimals(animals.map(animal => animal.id));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Lote 1</ThemedText>

      <View style={styles.searchContainer}>
        <ThemedText style={styles.label}>Buscar Animal</ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Seleccione Tipo"
          value={selectedType}
          onChangeText={setSelectedType}
          placeholderTextColor="#666666"
        />

        <TextInput
          style={styles.input}
          placeholder="Número de caravana"
          value={caravanaNumber}
          onChangeText={setCaravanaNumber}
          placeholderTextColor="#666666"
        />

        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Buscar</ThemedText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.selectAllButton} onPress={selectAllAnimals}>
        <ThemedText style={styles.selectAllText}>
          {selectedAnimals.length === animals.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
        </ThemedText>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.animalList}>
        {animals.map(animal => (
          <TouchableOpacity
            key={animal.id}
            style={[styles.animalItem, selectedAnimals.includes(animal.id) && styles.animalItemSelected]}
            onPress={() => toggleAnimalSelection(animal.id)}
          >
            <ThemedText style={styles.animalTag}>N°: {animal.tag}</ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#407157',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  selectAllButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#407157',
    borderRadius: 20,
  },
  selectAllText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  animalList: {
    paddingVertical: 16,
  },
  animalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  animalItemSelected: {
    backgroundColor: '#D3D3D3',
  },
  animalTag: {
    fontSize: 16,
  },
});

export default AnimalSearchScreen;
