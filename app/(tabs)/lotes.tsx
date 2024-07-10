import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleRight, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getUserLotes, createLote, deleteLote } from '../../api/api';
import { UserContext } from '../../api/UserContext';
import { useNavigation } from '@react-navigation/native'; // Importar hook de navegación

const ListItem = ({ item, onPress, isSelected, isDeleting, onDelete }) => (
  <TouchableOpacity
    style={[styles.itemContainer, isSelected && styles.selectedItem]}
    onPress={() => (isDeleting ? onDelete(item) : onPress(item))}
  >
    <Text style={styles.itemName}>Nuevo Lote</Text>
    <View>
      <Text style={styles.itemCount}>{item.capacidad}/{item.capacidad_max} animales</Text>
    </View>
    <FontAwesomeIcon 
      icon={isDeleting ? faTrash : faAngleRight} 
      size={20} 
      color={isDeleting ? 'red' : '#000000'} 
      style={styles.icon} 
    />
  </TouchableOpacity>
);

export default function TabTwoScreen() {
  const { userId } = useContext(UserContext);
  const [lotes, setLotes] = useState([]); 
  const [selectedLote, setSelectedLote] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigation = useNavigation(); // Hook de navegación

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
    if (lotes && lotes.length >= 4) {
      Alert.alert('Límite de lotes', 'Cada usuario solo puede tener un máximo de 4 lotes.');
      return;
    }

    try {
      const newLote = {
        numero: lotes ? lotes.length + 1 : 1,
        capacidad: 0,
        capacidad_max: 100,
        tipo_animal: 'vaca',
        animales: []
      };
      const createdLote = await createLote(newLote, userId);
      setLotes(prevLotes => [...(prevLotes || []), createdLote]);
    } catch (error) {
      Alert.alert('Error', 'Error al crear el lote. Inténtalo de nuevo más tarde.');
    }
  };

  const handleDeleteLote = async (item) => {
    try {
      console.log(item.id);
      await deleteLote(item.id);
      setLotes(prevLotes => prevLotes.filter(lote => lote.id !== item.id));
      setSelectedLote(null);
    } catch (error) {
      Alert.alert('Error', 'Error al eliminar el lote. Inténtalo de nuevo más tarde.');
    }
  };

  const toggleDeleteMode = () => {
    setIsDeleting(prev => !prev);
  };

  const handleSelectLote = (item) => {
    if (!isDeleting) {
      setSelectedLote(item);
      navigation.navigate('vistas/buscar_animal_lote', { lote: item }); 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis lotes</Text>
        <View style={styles.icons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleCreateLote}>
            <FontAwesomeIcon icon={faPlus} size={24} color="#000000" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={toggleDeleteMode}>
            <FontAwesomeIcon icon={faTrash} size={24} color={isDeleting ? 'red' : '#000000'} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={lotes || []}
        renderItem={({ item }) => (
          <ListItem 
            item={item} 
            onPress={handleSelectLote} 
            isSelected={selectedLote && selectedLote.id === item.id} 
            isDeleting={isDeleting}
            onDelete={handleDeleteLote}
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
