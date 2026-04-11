import React, { useDeferredValue, useState, useContext, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Modal, Text, Alert, Switch } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { faChevronLeft, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { buscarAnimal, buscarTratam, buscarSan, actualizarAnimal, actualizarEstadoAnimal, actualizarPrenies, buscarAnimalLote, getUserLotes } from '../../api/api';
import { UserContext } from '../../api/UserContext';

import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getNumeroCaravanaError, NUMERO_CARAVANA_MAX_LENGTH, sanitizeNumeroCaravana } from '@/utils/caravana';
import { DismissKeyboardView } from '@/components/DismissKeyboardView';

const sanitizePeso = (text: string) => text.replace(/[^0-9.,]/g, '').replace(',', '.');

type Animal = {
  numeroCaravana: string;
  numero_lote: string | number;
  peso?: string | number;
  edad?: string | number;
  reciennacida?: boolean;
  preniada?: boolean;
  tipos?: string;
  estado?: string;
};

type LoteOption = {
  id: number;
  numero: number;
};

type Tratamiento = {
  numeroCaravana?: string;
  tratamiento?: string;
  medicacion?: string;
  fechaInicio?: string;
  cada?: number;
  durante?: number;
};

type Sangrado = {
  numeroCaravana?: string;
  numero_tubo?: number | string;
};

const BuscarAnimalScreen = () => {
  const [numeroCaravana, setNumeroCaravana] = useState('');
  const [animalEncontrado, setAnimalEncontrado] = useState<Animal | null>(null);
  const [tratamientoEncontrado, setTratamientoEncontrado] = useState<Tratamiento | null>(null);
  const [tratamientoBuscado, setTratamientoBuscado] = useState(false);
  const [sangradoEncontrado, setSangradoEncontrado] = useState<Sangrado | null>(null);
  const [sangradobuscado, setsangradobuscado] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedAnimal, setEditedAnimal] = useState<Animal>({ numeroCaravana: '', numero_lote: '' });
  const { userId } = useContext(UserContext);
  const [lotes, setLotes] = useState<LoteOption[]>([]);
  const [allCaravanas, setAllCaravanas] = useState<string[]>([]);
  const [shouldLoadCaravanas, setShouldLoadCaravanas] = useState(false);
  const deferredNumeroCaravana = useDeferredValue(numeroCaravana);

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await getUserLotes(userId);
        if (Array.isArray(response)) {
          setLotes(response);
        } else {
          console.error('Unexpected response structure:', response);
        }
      } catch (error) {
        console.error('Error fetching lotes:', error);
      }
    };
    fetchLotes();
  }, [userId]); // Re-run effect if userId changes

  useEffect(() => {
    if (deferredNumeroCaravana.length < 2 || allCaravanas.length > 0 || !lotes.length || !shouldLoadCaravanas) {
      return;
    }

    const fetchCaravanas = async () => {
      const animalesPorLote = await Promise.all(
        lotes.map((lote) => buscarAnimalLote(userId, lote.numero).catch(() => []))
      );

      const caravanas = animalesPorLote
        .flat()
        .map((animal) => animal.numeroCaravana)
        .filter(Boolean);

      setAllCaravanas(Array.from(new Set(caravanas)));
    };

    fetchCaravanas();
  }, [allCaravanas.length, deferredNumeroCaravana.length, lotes, shouldLoadCaravanas, userId]);

  const opcionesLotes = Array.isArray(lotes) ? lotes.map((lote) => ({ title: String(lote.numero) })) : [];
  const isToro = (animal?: Animal | null) => animal?.tipos?.toLowerCase?.() === 'toro';
  const filteredCaravanas = deferredNumeroCaravana.length < 2
    ? []
    : allCaravanas.filter((caravana) => caravana.includes(deferredNumeroCaravana)).slice(0, 6);


  const buscar = async () => {
    const numeroCaravanaError = getNumeroCaravanaError(numeroCaravana);

    if (numeroCaravanaError) {
      Alert.alert('Error', numeroCaravanaError);
      return;
    }

    try {
      const animal = await buscarAnimal(userId, numeroCaravana);
      if (animal && animal.numeroCaravana === numeroCaravana) {
        setAnimalEncontrado(animal);
      } else {
        setAnimalEncontrado(null);
        Alert.alert('Animal no encontrado', 'No se encontró un animal con ese número de caravana. Inténtelo de nuevo.', [
          { text: 'OK', onPress: () => setNumeroCaravana('') }
        ]);
      }
    } catch (error) {
      console.error('Error al buscar animal:', error);
    }
  };

  const resetForm = () => {
    setNumeroCaravana('');
    setAnimalEncontrado(null);
    setTratamientoEncontrado(null);
    setTratamientoBuscado(false);
    setSangradoEncontrado(null);
    setsangradobuscado(false);
  };

  const buscarTratamiento = async () => {
    try {
      const tratamiento = await buscarTratam(userId, numeroCaravana);
      if (tratamiento && tratamiento.numeroCaravana === numeroCaravana) {
        setTratamientoEncontrado(tratamiento);
      } else {
        setTratamientoEncontrado(null);
      }
      setTratamientoBuscado(true);
    } catch (error) {
      console.error('Error al buscar tratamiento:', error);
      setTratamientoBuscado(true);
    }
  };
  
  const buscarSangrado = async () => {
    try {
      const sangrado = await buscarSan(userId, numeroCaravana);
      if (sangrado && sangrado.numeroCaravana === numeroCaravana) {
        setSangradoEncontrado(sangrado);
      } else {
        setSangradoEncontrado(null);
      }
      setsangradobuscado(true);
    } catch (error) {
      console.error('Error al buscar sangrado:', error);
      setsangradobuscado(true);
    }
  };

  const handleEdit = () => {
    if (!animalEncontrado) {
      return;
    }

    setEditedAnimal({ ...animalEncontrado });
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!animalEncontrado) {
      return;
    }

    try {
      const animalActualizado = await actualizarAnimal(
        userId,
        animalEncontrado.numeroCaravana,
        editedAnimal.numeroCaravana,
        editedAnimal.numero_lote,
        editedAnimal.peso,
        editedAnimal.edad,
        editedAnimal.reciennacida
      );

      if (!isToro(editedAnimal)) {
        await actualizarPrenies(userId, editedAnimal.numeroCaravana, editedAnimal.preniada);
      }

      setAnimalEncontrado({
        ...animalActualizado,
        preniada: isToro(editedAnimal) ? false : !!editedAnimal.preniada,
      });
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error al actualizar animal:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el animal. Inténtelo de nuevo.');
    }
  };

  const handleUpdateEstado = async (estado: string) => {
    if (!animalEncontrado) {
      return;
    }

    try {
      const updatedAnimal = await actualizarEstadoAnimal(userId, animalEncontrado.numeroCaravana, estado);
      setAnimalEncontrado(updatedAnimal);
      Alert.alert('Éxito', 'El estado del animal fue actualizado.');
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado del animal.');
    }
  };

  return (
    <DismissKeyboardView>
    <ThemedView style={styles.container}>
      {!animalEncontrado ? (
        <>
          <ThemedText style={styles.title}>Buscar Animal</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Número de caravana"
            placeholderTextColor="#666666"
            value={numeroCaravana}
            onChangeText={(text) => setNumeroCaravana(sanitizeNumeroCaravana(text))}
            onFocus={() => setShouldLoadCaravanas(true)}
            autoCapitalize="none"
            keyboardType="number-pad"
            maxLength={NUMERO_CARAVANA_MAX_LENGTH}
          />
          {deferredNumeroCaravana.length >= 2 && filteredCaravanas.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {filteredCaravanas.map((caravana) => (
                <TouchableOpacity key={caravana} style={styles.suggestionChip} onPress={() => setNumeroCaravana(caravana)}>
                  <ThemedText style={styles.suggestionText}>{caravana}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={buscar}>
              <ThemedText style={styles.buttonText}>Buscar</ThemedText>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.buttonVolver} onPress={resetForm}>
            <ThemedText>
              <FontAwesomeIcon icon={faChevronLeft} size={20} style={styles.iconVolver} />
              Volver a buscar
            </ThemedText>
          </TouchableOpacity>
          <View style={styles.animalDetailContainer}>
            <View style={styles.headerContainer}>
              <ThemedText style={styles.detail}>N° {animalEncontrado.numeroCaravana}</ThemedText>
              <TouchableOpacity onPress={handleEdit}>
                <FontAwesomeIcon icon={faPen} size={20} style={styles.iconEdit} />
              </TouchableOpacity>
            </View>
            <ThemedText style={styles.detail}>Edad: {animalEncontrado.edad} años</ThemedText>
            <ThemedText style={styles.detail}>Tipo: {animalEncontrado.tipos}</ThemedText>
            <ThemedText style={styles.detail}>Lote: {animalEncontrado.numero_lote}</ThemedText>
            <ThemedText style={styles.detail}>Peso: {animalEncontrado.peso} kg</ThemedText>
            <ThemedText style={styles.detail}>Estado: {animalEncontrado.estado === 'murio' ? 'Murió' : animalEncontrado.estado === 'vendido' ? 'Vendido' : 'Vivo'}</ThemedText>
            {!isToro(animalEncontrado) && (
              <ThemedText style={styles.detail}>Preñada: {animalEncontrado.preniada ? 'Sí' : 'No'}</ThemedText>
            )}
            <ThemedText style={styles.detail}>Recien Nacido: {animalEncontrado.reciennacida ? 'Sí' : 'No'}</ThemedText>
            <View style={styles.statusActions}>
              <TouchableOpacity style={styles.statusButton} onPress={() => handleUpdateEstado('vivo')}>
                <ThemedText style={styles.statusButtonText}>Está vivo</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statusButton} onPress={() => handleUpdateEstado('murio')}>
                <ThemedText style={styles.statusButtonText}>Murió</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statusButton} onPress={() => handleUpdateEstado('vendido')}>
                <ThemedText style={styles.statusButtonText}>Fue vendido</ThemedText>
              </TouchableOpacity>
            </View>
            
            <View style={styles.tratamientosContainer}>
              {!tratamientoBuscado ? (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={buscarTratamiento}>
                    <ThemedText style={styles.buttonText}>Ver tratamiento</ThemedText>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <ThemedText style={styles.detail}>Tratamientos:</ThemedText>
                  {tratamientoEncontrado ? (
                    <>
                      <ThemedText style={styles.tratamiento}>Tratamiento: {tratamientoEncontrado.tratamiento}</ThemedText>
                      <ThemedText style={styles.tratamiento}>Medicación: {tratamientoEncontrado.medicacion}</ThemedText>
                      <ThemedText style={styles.tratamiento}>Fecha Inicio: {tratamientoEncontrado.fechaInicio}</ThemedText>
                      <ThemedText style={styles.tratamiento}>Cada: {tratamientoEncontrado.cada} días</ThemedText>
                      <ThemedText style={styles.tratamiento}>Durante: {tratamientoEncontrado.durante} días</ThemedText>
                    </>
                  ) : (
                    <ThemedText style={styles.detail}>No hay tratamientos registrados.</ThemedText>
                  )}
                </>
              )}
            </View> 
            
            <View style={styles.tratamientosContainer}>
              {!sangradobuscado ? (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={buscarSangrado}>
                    <ThemedText style={styles.buttonText}>Ver sangrado</ThemedText>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <ThemedText style={styles.detail}>Sangrado:</ThemedText>
                  {sangradoEncontrado ? (
                    <>
                      <ThemedText style={styles.sangrado}>Numero tubo: {sangradoEncontrado.numero_tubo}</ThemedText>
                      </>
                  ) : (
                    <ThemedText style={styles.detail}>No hay sangrados registrados.</ThemedText>
                  )}
                </>
              )}
            </View>
          </View>

          <Modal
            visible={editModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setEditModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ThemedText style={styles.title}>Editar Animal</ThemedText>
                <View>
                    <SelectDropdown
                        data={opcionesLotes}
                        onSelect={(selectedItem, index) => {
                          setEditedAnimal({...editedAnimal, numero_lote: selectedItem.title });
                        }}
                        renderButton={(selectedItem, isOpened) => {
                          return (
                            <View style={styles.dropdownButtonStyle}>
                              {selectedItem && (
                                <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
                              )}
                                <Text style={styles.dropdownButtonTxtStyle}>
                                {selectedItem ? `Lote ${selectedItem.title}` : editedAnimal.numero_lote ? `Lote ${editedAnimal.numero_lote}` : 'Número de lote'}
                              </Text>
                              <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                            </View>
                          );
                        }}
                        renderItem={(item, index, isSelected) => {
                          return (
                            <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                              <Text style={styles.dropdownItemTxtStyle}>Lote {item.title}</Text>
                            </View>
                          );
                        }}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={styles.dropdownMenuStyle}
                      />
                  </View>
                
                <TextInput
                  style={styles.input}
                  placeholder="Número de caravana"
                  placeholderTextColor="#666666"
                  value={editedAnimal.numeroCaravana}
                  onChangeText={(text) => setEditedAnimal({ ...editedAnimal, numeroCaravana: sanitizeNumeroCaravana(text) })}
                  keyboardType="number-pad"
                  maxLength={NUMERO_CARAVANA_MAX_LENGTH}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Peso"
                  placeholderTextColor="#666666"
                  value={String(editedAnimal.peso ?? '')}
                  onChangeText={(text) => setEditedAnimal({ ...editedAnimal, peso: sanitizePeso(text) })}
                  keyboardType="decimal-pad"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Edad"
                  placeholderTextColor="#666666"
                  value={String(editedAnimal.edad ?? '')}
                  onChangeText={(text) => setEditedAnimal({ ...editedAnimal, edad: text })}
                  keyboardType="number-pad"
                />
                <View style={styles.switchContainer}>
                  <ThemedText style={styles.switchLabel}>Recien Nacida</ThemedText>
                  <Switch
                    value={editedAnimal.reciennacida}
                    onValueChange={(value) => setEditedAnimal({ ...editedAnimal, reciennacida: value })}
                  />
                </View>
                {!isToro(editedAnimal) && (
                  <View style={styles.switchContainer}>
                    <ThemedText style={styles.switchLabel}>Preñada</ThemedText>
                    <Switch
                      value={!!editedAnimal.preniada}
                      onValueChange={(value) => setEditedAnimal({ ...editedAnimal, preniada: value })}
                    />
                  </View>
                )}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <ThemedText style={styles.buttonText}>Actualizar</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={() => setEditModalVisible(false)}>
                    <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </ThemedView>
    </DismissKeyboardView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    padding: 20,
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
    paddingHorizontal: 20,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#E8F0EB',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  suggestionText: {
    color: '#407157',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#407157',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  buttonCancel: {
    backgroundColor: '#777777',
  },
  buttonVolver: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  animalDetailContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detail: {
    fontSize: 18,
    marginBottom: 5,
  },
  statusActions: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusButton: {
    backgroundColor: '#407157',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  statusButtonText: {
    color: '#FFFFFF',
  },
  iconVolver: {
    marginRight: 8,
  },
  iconEdit: {
    marginLeft: 'auto',
  },
  tratamientosContainer: {
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  tratamiento: {
    fontSize: 16,
    marginBottom: 5,
  },
  sangrado: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 30,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  switchLabel: {
    fontSize: 16,
  },

  dropdownButtonStyle: {
    width: '100%',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    height: 50,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    color: '#565859',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#565859',
  },
});

export default BuscarAnimalScreen;
