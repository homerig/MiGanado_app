import React from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';

const AnimalListItem = ({ id, onPress }) => (
  <TouchableOpacity onPress={() => onPress(id)}>
    <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
      <Text>N°: {id}</Text>
      // Añade aquí más detalles como el icono de la cabeza de la vaca
    </View>
  </TouchableOpacity>
);

const AnimalListView = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [animals, setAnimals] = React.useState(['200H', 'A533', '205H', 'A513', '134G', 'A514', '235G', 'A510']);
  // Añade aquí la lógica para buscar y seleccionar animales

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
    // Implementa la búsqueda basada en searchTerm
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Text>Lote de animales</Text>
        <TextInput
          placeholder="Número de caravana"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Button title="Buscar" onPress={handleSearch} />
      </View>
      <FlatList
        data={animals}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <AnimalListItem id={item} onPress={() => {}} />}
      />
      // Añade aquí otros componentes como los botones de selección
    </View>
  );
};

export default AnimalListView;
