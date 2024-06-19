import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleRight, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const data = [
  { id: '1', name: 'LOTE 1', count: '100/100' },
  { id: '2', name: 'LOTE 2', count: '32/100' },
  { id: '3', name: 'LOTE 3', count: '52/100' },
  { id: '4', name: 'LOTE 4', count: '43/100' },
];

const ListItem = ({ item }) => (
  <TouchableOpacity style={styles.itemContainer}>
    <Text style={styles.itemName}>{item.name}</Text>
    <View>
      <Text style={styles.itemCount}>{item.count}</Text>
      <Text style={styles.itemCount}>Animales</Text>
    </View>
    <FontAwesomeIcon icon={faAngleRight} size={20} color="#000000" style={styles.icon} />
  </TouchableOpacity>
);

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis lotes</Text>
        <View style={styles.icons}>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesomeIcon icon={faPlus} size={24} color="#000000" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <FontAwesomeIcon icon={faTrash} size={24} color="#000000" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />  
    </View>
  );
};

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
    marginRight:10, // Espacio a la derecha del icono
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
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily:'JostBold',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    fontFamily:'JostRegular',
  },
});