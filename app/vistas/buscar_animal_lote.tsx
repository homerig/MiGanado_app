import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleRight, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../api/UserContext';
import { useNavigation, useRoute } from '@react-navigation/native';

// Función para generar datos de animales aleatoriamente
const generateRandomAnimals = (num) => {
  const animals = [];
  const prefixes = ['A', 'B', 'C', 'D', 'E'];
  for (let i = 0; i < num; i++) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 1000);
    animals.push({ numeroCaravana: `${prefix}${number}` });
  }
  return animals;
};

const AnimalItem = ({ item, isSelected, onSelect }) => (
  <TouchableOpacity style={styles.animalItem} onPress={() => onSelect(item)}>
    <Text style={styles.animalText}>N°: {item.numeroCaravana}</Text>
  </TouchableOpacity>
);

export default function AnimalListScreen() {
  const route = useRoute();
  const { lote } = route.params; // Asegúrate de que route.params no es undefined
  const [animalLimit, setAnimalLimit] = useState(100);
  const [selectedAnimals, setSelectedAnimals] = useState([]);
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    // Generar datos de animales aleatoriamente para prueba
    const randomAnimals = generateRandomAnimals(10);
    setAnimals(randomAnimals);
  }, []);

  const handleAnimalSelection = (animal) => {
    setSelectedAnimals((prevSelected) =>
      prevSelected.includes(animal.numeroCaravana)
        ? prevSelected.filter((a) => a !== animal.numeroCaravana)
        : [...prevSelected, animal.numeroCaravana]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.limitContainer}>
          <Text style={styles.label}>Límite de animales</Text>
          <TextInput
            style={styles.input}
            value={String(animalLimit)}
            keyboardType="numeric"
            onChangeText={(text) => setAnimalLimit(Number(text))}
          />
        </View>
      </View>
      <ScrollView>
        {animals.map((animal, index) => (
          <AnimalItem
            key={index}
            item={animal}
            isSelected={selectedAnimals.includes(animal.numeroCaravana)}
            onSelect={handleAnimalSelection}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  limitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    width: 60,
    textAlign: 'center',
  },
  animalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  animalText: {
    fontSize: 16,
  },
});
