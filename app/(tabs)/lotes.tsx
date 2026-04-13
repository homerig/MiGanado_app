import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleRight, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getUserLotes, createLote, deleteLote, buscarAnimalLote } from '../../api/api'; // Importar la función buscarAnimalLote
import { UserContext } from '../../api/UserContext';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type LoteItem = {
  id: number;
  numero: number;
  nombre_lote: string;
  capacidad_max: number;
  animalCount?: number;
};

const ListItem = ({ item, onPress, isSelected, isDeleting, onDelete }: {
  item: LoteItem;
  onPress: (item: LoteItem) => void;
  isSelected: boolean | null;
  isDeleting: boolean;
  onDelete: (item: LoteItem) => void;
}) => (
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
  const [lotes, setLotes] = useState<LoteItem[]>([]);
  const [selectedLote, setSelectedLote] = useState<LoteItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loteToDelete, setLoteToDelete] = useState<LoteItem | null>(null);
  const [loteDestino, setLoteDestino] = useState('');
  const router = useRouter();

  const fetchLotes = useCallback(async () => {
    try {
      const userLotes = await getUserLotes(userId);

      const lotesConAnimales = await Promise.all(
        userLotes.map(async (lote: LoteItem) => {
          const animales = await buscarAnimalLote(userId, lote.numero);
          return { ...lote, animalCount: animales.length };
        })
      );

      setLotes(lotesConAnimales);
    } catch (error: any) {
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

  const handleDeleteLote = async (item: LoteItem) => {
    const lotesDestino = lotes.filter((lote) => lote.id !== item.id);

    if ((item.animalCount || 0) > 0 && lotesDestino.length === 0) {
      Alert.alert('No se puede eliminar', 'Este lote tiene animales y no existe otro lote disponible para trasladarlos.');
      return;
    }

    if ((item.animalCount || 0) > 0) {
      setLoteToDelete(item);
      setLoteDestino('');
      return;
    }

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

  const confirmDeleteLote = async () => {
    if (!loteToDelete) {
      return;
    }

    if ((loteToDelete.animalCount || 0) > 0 && !loteDestino) {
      Alert.alert('Seleccioná un lote', 'Elegí a qué lote trasladar los animales antes de borrar.');
      return;
    }

    try {
      await deleteLote(loteToDelete.id, (loteDestino || null) as any);
      await fetchLotes();
      setSelectedLote(null);
      setIsDeleting(false);
      setLoteToDelete(null);
      setLoteDestino('');
    } catch (error) {
      Alert.alert('Error', 'Error al eliminar el lote. Inténtalo de nuevo más tarde.');
    }
  };

  const handleSelectLote = (item: LoteItem) => {
    if (!isDeleting) {
      setSelectedLote(item);
      router.push({
        pathname: '/vistas/buscar_animal_lote',
        params: { lote: JSON.stringify(item) },
      });
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
      <Modal
        visible={!!loteToDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setLoteToDelete(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type='subtitle' style={styles.modalTitle}>Eliminar lote</ThemedText>
            <ThemedText style={styles.modalText}>
              {loteToDelete?.animalCount
                ? 'Este lote tiene animales. Elegí a qué lote querés trasladarlos antes de borrarlo.'
                : 'Confirmá la eliminación del lote.'}
            </ThemedText>

            {(loteToDelete?.animalCount || 0) > 0 && (
              <SelectDropdown
                data={lotes.filter((lote) => lote.id !== loteToDelete?.id).map((lote) => ({ title: String(lote.numero) }))}
                onSelect={(selectedItem) => setLoteDestino(selectedItem.title)}
                renderButton={(selectedItem, isOpened) => (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {selectedItem ? `Lote ${selectedItem.title}` : loteDestino ? `Lote ${loteDestino}` : 'Seleccionar lote destino'}
                    </Text>
                    <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                  </View>
                )}
                renderItem={(item, index, isSelected) => (
                  <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                    <Text style={styles.dropdownItemTxtStyle}>Lote {item.title}</Text>
                  </View>
                )}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />
            )}

            <TouchableOpacity style={styles.modalButton} onPress={confirmDeleteLote}>
              <ThemedText style={styles.modalButtonText}>Confirmar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.modalButtonSecondary]} onPress={() => setLoteToDelete(null)}>
              <ThemedText style={styles.modalButtonText}>Cancelar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  modalTitle: {
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#407157',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonSecondary: {
    backgroundColor: '#6F7C75',
  },
  modalButtonText: {
    color: '#FFFFFF',
  },
  dropdownButtonStyle: {
    width: '100%',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    height: 50,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    color: '#565859',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#565859',
  },
});
