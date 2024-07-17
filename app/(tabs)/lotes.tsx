import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleRight, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getUserLotes, createLote, deleteLote, buscarAnimalLote } from '../../api/api'; // Importar la función buscarAnimalLote
import { UserContext } from '../../api/UserContext';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const ListItem = ({ item, onPress, isSelected, isDeleting, onDelete }) => (
  <TouchableOpacity
    style={[styles.itemContainer, isSelected && styles.selectedItem]}
    onPress={() => (isDeleting ? onDelete(item) : onPress(item))}
  >
    <View style={{flexDirection: 'column',
    alignItems: 'center',paddingHorizontal: 10}}>
      <ThemedText type="caption">Lote N°{item.numero}</ThemedText>
      <ThemedText type='subtitle'>{item.nombre_lote}</ThemedText>
    </View>
    <View>
      <ThemedText style={styles.itemCount}>{item.animalCount || 0}/{item.capacidad_max} animales</ThemedText>
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
  const navigation = useNavigation();

  const fetchLotes = useCallback(async () => {
    try {
      const userLotes = await getUserLotes(userId);

      const lotesConAnimales = await Promise.all(
        userLotes.map(async lote => {
          const animales = await buscarAnimalLote(userId, lote.numero);
          return { ...lote, animalCount: animales.length };
        })
      );

      setLotes(lotesConAnimales);
    } catch (error) {
      console.error('Error al obtener los lotes del usuario:', error.message);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchLotes();
      setSelectedLote(null);
    }, [fetchLotes])
  );

  const handleCreateLote = async () => {
    try {
      const highestNumero = lotes.reduce((max, lote) => (lote.numero > max ? lote.numero : max), 0);
      const newLote = {
        nombre_lote: "Lote nuevo " + (highestNumero + 1),
        numero: highestNumero + 1,
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
      await deleteLote(item.id);
      setLotes(prevLotes => prevLotes.filter(lote => lote.id !== item.id));
      setSelectedLote(null);
      setIsDeleting(false);
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
    <View style={styles.containerColor}>
      <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type='title' style={styles.title}>Mis lotes</ThemedText>
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
    </View>
  );
}

const styles = StyleSheet.create({
  containerColor:{
    flex: 1,
    backgroundColor: '#407157',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
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
    padding: 20,

  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
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
  numName: {
    fontSize: 12,
    fontFamily: 'JostRegular',
    alignItems: 'center',
    marginLeft: 15,
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'JostRegular',
  },
});
