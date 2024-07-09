import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleRight, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getUserLotes, createLote, deleteLote } from '../../api/api';
import { UserContext } from '../../api/UserContext';

const ListItem = ({ item, onPress, isSelected }) => (
  <TouchableOpacity
    style={[styles.itemContainer, isSelected && styles.selectedItem]}
    onPress={() => onPress(item)}
  >
    <Text style={styles.itemName}>{item.name}</Text>
    <View>
      <Text style={styles.itemCount}>{item.count}</Text>
      <Text style={styles.itemCount}>Animales</Text>
    </View>
    <FontAwesomeIcon icon={faAngleRight} size={20} color="#000000" style={styles.icon} />
  </TouchableOpacity>
);

export default function TabTwoScreen() {
  const { userId } = useContext(UserContext);
  const [lotes, setLotes] = useState([]); // Inicializa lotes como una lista vacía
  const [selectedLote, setSelectedLote] = useState(null);

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const userLotes = await getUserLotes(userId);
        setLotes(userLotes);
      } catch (error) {
        console.error('Error al obtener los lotes del usuario:', error.message);
      }
    };

    fetchLotes();
  }, [userId]);

  const handleCreateLote = async () => {
    if (lotes && lotes.length >= 4) { // Asegúrate de que lotes está definido antes de acceder a length
      Alert.alert('Límite de lotes', 'Cada usuario solo puede tener un máximo de 4 lotes.');
      return;
    }

    try {
      const newLote = {
        numero: lotes ? lotes.length + 1 : 1, // Si lotes es undefined, inicializa numero con 1
        capacidad: 0,
        capacidad_max: 100,
        tipo_animal: 'vaca',
        animales: []
      };
      const createdLote = await createLote(newLote, userId);
      setLotes(prevLotes => [...(prevLotes || []), createdLote]); // Asegura que prevLotes no sea undefined
    } catch (error) {
      Alert.alert('Error', 'Error al crear el lote. Inténtalo de nuevo más tarde.');
    }
  };

  const handleDeleteLote = async () => {
    if (!selectedLote) {
      Alert.alert('Selección necesaria', 'Por favor selecciona un lote para eliminar.');
      return;
    }

    try {
      await deleteLote(selectedLote.id);
      setLotes(prevLotes => prevLotes.filter(lote => lote.id !== selectedLote.id));
      setSelectedLote(null);
    } catch (error) {
      Alert.alert('Error', 'Error al eliminar el lote. Inténtalo de nuevo más tarde.');
    }
  };

  const handleSelectLote = (item) => {
    setSelectedLote(item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis lotes</Text>
        <View style={styles.icons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleCreateLote}>
            <FontAwesomeIcon icon={faPlus} size={24} color="#000000" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleDeleteLote}>
            <FontAwesomeIcon icon={faTrash} size={24} color="#000000" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={lotes || []} // Asegura que data siempre es una lista
        renderItem={({ item }) => (
          <ListItem 
            item={item} 
            onPress={handleSelectLote} 
            isSelected={selectedLote && selectedLote.id === item.id} 
          />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  title: {
    marginLeft: 20,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'JostRegular',
  },
  icons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  list: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 40,
    marginTop: 40,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  selectedItem: {
    backgroundColor: '#e0e0e0',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'JostBold',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'JostRegular',
  },
});
