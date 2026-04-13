import React, { useContext, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Text, Image, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { actualizarEstadoAnimal, actualizarNombreLote, buscarAnimal, buscarAnimalLote, buscarTratam, buscarSan } from '../../api/api';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { UserContext } from '../../api/UserContext';
import { getNumeroCaravanaError, NUMERO_CARAVANA_MAX_LENGTH, sanitizeNumeroCaravana } from '@/utils/caravana';
import { DismissKeyboardView } from '@/components/DismissKeyboardView';

type LoteData = {
  id: number;
  numero: number;
  nombre_lote: string;
};

type Animal = {
  numeroCaravana: string;
  tipos?: string;
  edad?: string | number;
  numero_lote: number | string;
  peso?: string | number;
  estado?: string;
  preniada?: boolean;
  reciennacida?: boolean;
};

type Tratamiento = {
  tratamiento?: string;
  medicacion?: string;
  fechaInicio?: string;
};

type Sangrado = {
  numero_lote?: number | string;
  numero_tubo?: string | number;
};

const formatEstado = (estado?: string) => {
  if (estado === 'murio') return 'Murió';
  if (estado === 'vendido') return 'Vendido';
  return 'Vivo';
};

const AnimalSearchScreen = () => {
  const searchParams = useLocalSearchParams();
  const router = useRouter();
  const { userId } = useContext(UserContext);
  const initialLote = JSON.parse(decodeURIComponent(searchParams.lote as string)) as LoteData;

  const [loteActual, setLoteActual] = useState(initialLote);
  const [caravanaNumber, setCaravanaNumber] = useState('');
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [newLoteName, setNewLoteName] = useState(initialLote.nombre_lote ?? '');
  const [animalEncontrado, setAnimalEncontrado] = useState<Animal | null>(null);
  const [tratamientoEncontrado, setTratamientoEncontrado] = useState<Tratamiento | null>(null);
  const [sangradoEncontrado, setSangradoEncontrado] = useState<Sangrado | null>(null);
  const [soloPreniadas, setSoloPreniadas] = useState(false);
  const [soloRecienNacidos, setSoloRecienNacidos] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState<'todos' | 'vivo' | 'murio' | 'vendido'>('todos');
  const deferredCaravanaNumber = useDeferredValue(caravanaNumber);

  useEffect(() => {
    const cargarAnimales = async () => {
      const animales = await buscarAnimalLote(userId, loteActual.numero);
      setAnimals(Array.isArray(animales) ? animales : []);
    };

    cargarAnimales();
  }, [userId, loteActual.numero]);

  const filteredAnimals = useMemo(() => {
    let nextAnimals = animals;

    if (soloPreniadas) {
      nextAnimals = nextAnimals.filter((animal) => animal.preniada);
    }

    if (soloRecienNacidos) {
      nextAnimals = nextAnimals.filter((animal) => animal.reciennacida);
    }

    if (estadoFiltro !== 'todos') {
      nextAnimals = nextAnimals.filter((animal) => animal.estado === estadoFiltro);
    }

    if (!deferredCaravanaNumber) {
      return nextAnimals;
    }

    return nextAnimals.filter((animal) => animal.numeroCaravana.includes(deferredCaravanaNumber));
  }, [animals, deferredCaravanaNumber, estadoFiltro, soloPreniadas, soloRecienNacidos]);

  const abrirDetalleAnimal = async (numeroCaravana: string) => {
    const animal = await buscarAnimal(userId, numeroCaravana);

    if (!animal || animal.numero_lote !== loteActual.numero) {
      Alert.alert('Animal no encontrado', 'No se encontró un animal con ese número de caravana dentro del lote seleccionado.');
      return;
    }

    const [tratamiento, sangrado] = await Promise.all([
      buscarTratam(userId, numeroCaravana).catch(() => null),
      buscarSan(userId, numeroCaravana).catch(() => null),
    ]);

    setAnimalEncontrado(animal);
    setTratamientoEncontrado(tratamiento);
    setSangradoEncontrado(sangrado);
    setIsModalVisible(true);
  };

  const handleSearchAnimal = async () => {
    const caravanaError = getNumeroCaravanaError(caravanaNumber);

    if (caravanaError) {
      Alert.alert('Error', caravanaError);
      return;
    }

    await abrirDetalleAnimal(caravanaNumber);
  };

  const handleUpdateLoteName = async () => {
    if (!newLoteName.trim()) {
      Alert.alert('Error', 'Ingresá un nombre válido para el lote.');
      return;
    }

    try {
      const loteActualizado = await actualizarNombreLote(loteActual.id, newLoteName.trim());
      setLoteActual((prev: LoteData) => ({ ...prev, ...loteActualizado }));
      setNewLoteName(loteActualizado.nombre_lote);
      setIsUpdateModalVisible(false);
      Alert.alert('Éxito', 'El nombre del lote ha sido actualizado.');
    } catch (error) {
      console.error('Error updating lote name:', error);
      Alert.alert('Error', 'No se pudo actualizar el nombre del lote. Inténtalo de nuevo más tarde.');
    }
  };

  const handleEstadoAnimal = async (estado: string) => {
    if (!animalEncontrado) return;

    try {
      const animalActualizado = await actualizarEstadoAnimal(userId, animalEncontrado.numeroCaravana, estado);
      setAnimalEncontrado(animalActualizado);
      setAnimals((prevAnimals) =>
        prevAnimals.map((animal) => (
          animal.numeroCaravana === animalActualizado.numeroCaravana ? animalActualizado : animal
        ))
      );
      Alert.alert('Éxito', 'El estado del animal fue actualizado.');
    } catch (error) {
      console.error('Error updating animal state:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado del animal.');
    }
  };

  const isToro = animalEncontrado?.tipos?.toLowerCase?.() === 'toro';

  return (
    <DismissKeyboardView>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <ThemedText type='title' style={styles.title}>{loteActual.nombre_lote}</ThemedText>
            <TouchableOpacity style={styles.iconButton} onPress={() => setIsUpdateModalVisible(true)}>
              <FontAwesomeIcon icon={faPen} size={20} color="#407157" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/vistas/IngresoAnimal')}>
            <FontAwesomeIcon icon={faPlus} size={20} color="#407157" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <ThemedText type="defaultSemiBold" style={styles.label}>Buscar Animal</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Número de caravana"
            value={caravanaNumber}
            onChangeText={(text) => setCaravanaNumber(sanitizeNumeroCaravana(text))}
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            maxLength={NUMERO_CARAVANA_MAX_LENGTH}
          />
          {deferredCaravanaNumber.length >= 2 && filteredAnimals.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {filteredAnimals.slice(0, 6).map((animal) => (
                <TouchableOpacity
                  key={animal.numeroCaravana}
                  style={styles.suggestionChip}
                  onPress={() => {
                    setCaravanaNumber(animal.numeroCaravana);
                    abrirDetalleAnimal(animal.numeroCaravana);
                  }}
                >
                  <ThemedText style={styles.suggestionText}>{animal.numeroCaravana}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={handleSearchAnimal}>
            <ThemedText style={styles.buttonText}>Buscar</ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.filtersContainer}>
          <ThemedText type="defaultSemiBold" style={styles.filtersTitle}>Filtros rápidos</ThemedText>
          <View style={styles.filtersRow}>
            <TouchableOpacity
              style={[styles.filterChip, soloPreniadas && styles.filterChipActive]}
              onPress={() => setSoloPreniadas((prev) => !prev)}
            >
              <ThemedText style={[styles.filterChipText, soloPreniadas && styles.filterChipTextActive]}>
                Preñadas
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, soloRecienNacidos && styles.filterChipActive]}
              onPress={() => setSoloRecienNacidos((prev) => !prev)}
            >
              <ThemedText style={[styles.filterChipText, soloRecienNacidos && styles.filterChipTextActive]}>
                Recién nacidos
              </ThemedText>
            </TouchableOpacity>
            {[
              { key: 'todos', label: 'Todos' },
              { key: 'vivo', label: 'Vivos' },
              { key: 'murio', label: 'Muertos' },
              { key: 'vendido', label: 'Vendidos' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[styles.filterChip, estadoFiltro === option.key && styles.filterChipActive]}
                onPress={() => setEstadoFiltro(option.key as 'todos' | 'vivo' | 'murio' | 'vendido')}
              >
                <ThemedText style={[styles.filterChipText, estadoFiltro === option.key && styles.filterChipTextActive]}>
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ThemedText type='subtitle' style={styles.subtitle}>Animales en el lote</ThemedText>
        <ThemedText style={styles.resultCount}>{filteredAnimals.length} animales mostrados</ThemedText>
        <ScrollView contentContainerStyle={styles.caravanasList}>
          {filteredAnimals.map((animal) => (
            <TouchableOpacity
              key={animal.numeroCaravana}
              style={styles.caravanaItem}
              onPress={() => abrirDetalleAnimal(animal.numeroCaravana)}
            >
              <View style={styles.caravanaContent}>
                <Image source={require('@/assets/images/MiGanado_logo.png')} style={styles.logo} resizeMode="contain" />
                <View>
                  <Text style={styles.caravanaText}>N°: {animal.numeroCaravana}</Text>
                  <Text style={styles.caravanaMeta}>{animal.tipos} • {formatEstado(animal.estado)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Modal
          visible={isModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {animalEncontrado && (
                <View style={styles.animalDetail}>
                  <ThemedText type='subtitle' style={styles.modalTitle}>Detalle del Animal N°{animalEncontrado.numeroCaravana}</ThemedText>
                  <ThemedText style={styles.detail}>Tipo: {animalEncontrado.tipos}</ThemedText>
                  <ThemedText style={styles.detail}>Edad: {animalEncontrado.edad} años</ThemedText>
                  <ThemedText style={styles.detail}>Lote: {animalEncontrado.numero_lote}</ThemedText>
                  <ThemedText style={styles.detail}>Peso: {animalEncontrado.peso} kg</ThemedText>
                  <ThemedText style={styles.detail}>Estado: {formatEstado(animalEncontrado.estado)}</ThemedText>
                  {!isToro && (
                    <ThemedText style={styles.detail}>Preñada: {animalEncontrado.preniada ? 'Sí' : 'No'}</ThemedText>
                  )}
                  <ThemedText style={styles.detail}>Recién nacido: {animalEncontrado.reciennacida ? 'Sí' : 'No'}</ThemedText>
                </View>
              )}

              <View style={styles.statusActions}>
                <TouchableOpacity style={styles.statusButton} onPress={() => handleEstadoAnimal('vivo')}>
                  <ThemedText style={styles.buttonText}>Está vivo</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statusButton} onPress={() => handleEstadoAnimal('murio')}>
                  <ThemedText style={styles.buttonText}>Murió</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statusButton} onPress={() => handleEstadoAnimal('vendido')}>
                  <ThemedText style={styles.buttonText}>Fue vendido</ThemedText>
                </TouchableOpacity>
              </View>

              <View style={styles.sectionBlock}>
                {tratamientoEncontrado && tratamientoEncontrado.tratamiento ? (
                  <>
                    <ThemedText style={styles.detail}>Tratamiento: {tratamientoEncontrado.tratamiento}</ThemedText>
                    <ThemedText style={styles.detail}>Medicación: {tratamientoEncontrado.medicacion}</ThemedText>
                    <ThemedText style={styles.detail}>Fecha Inicio: {tratamientoEncontrado.fechaInicio}</ThemedText>
                  </>
                ) : (
                  <ThemedText style={styles.detail}>Tratamiento: Sin información.</ThemedText>
                )}
              </View>

              <View style={styles.sectionBlock}>
                {sangradoEncontrado ? (
                  <ThemedText style={styles.detail}>Sangrado: Tubo N° {sangradoEncontrado.numero_tubo}</ThemedText>
                ) : (
                  <ThemedText style={styles.detail}>Sangrado: Sin información.</ThemedText>
                )}
              </View>

              <TouchableOpacity style={styles.button} onPress={() => setIsModalVisible(false)}>
                <ThemedText style={styles.buttonText}>Cerrar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={isUpdateModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsUpdateModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ThemedText type='subtitle' style={styles.modalTitle}>Actualizar Nombre del Lote</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Nuevo nombre del lote"
                value={newLoteName}
                onChangeText={setNewLoteName}
              />
              <TouchableOpacity style={styles.button} onPress={handleUpdateLoteName}>
                <ThemedText style={styles.buttonText}>Actualizar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => setIsUpdateModalVisible(false)}>
                <ThemedText style={styles.buttonText}>Cerrar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ThemedView>
    </DismissKeyboardView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightHeader: {
    flexDirection: 'row',
  },
  title: {
    marginRight: 10,
    flexShrink: 1,
  },
  iconButton: {
    marginLeft: 10,
  },
  searchContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
    color: '#333333',
  },
  button: {
    backgroundColor: '#407157',
    borderRadius: 99,
    paddingVertical: 12,
    marginHorizontal: '20%',
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#6E7D75',
  },
  buttonText: {
    color: '#FFFFFF',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  filtersContainer: {
    marginBottom: 12,
  },
  filtersTitle: {
    marginBottom: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    backgroundColor: '#EFF4F1',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D5E0D9',
  },
  filterChipActive: {
    backgroundColor: '#407157',
    borderColor: '#407157',
  },
  filterChipText: {
    color: '#355947',
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  suggestionChip: {
    backgroundColor: '#E8F0EB',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  suggestionText: {
    color: '#407157',
  },
  caravanasList: {
    paddingBottom: 32,
  },
  caravanaItem: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  caravanaText: {
    fontSize: 16,
    color: '#1D2B24',
  },
  caravanaMeta: {
    fontSize: 13,
    color: '#65736C',
  },
  caravanaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalTitle: {
    marginBottom: 10,
  },
  animalDetail: {
    marginBottom: 10,
  },
  sectionBlock: {
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  statusActions: {
    marginVertical: 12,
  },
  statusButton: {
    backgroundColor: '#407157',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 25,
    marginRight: 10,
  },
  subtitle: {
    paddingVertical: 10,
  },
  resultCount: {
    color: '#6A756F',
    marginBottom: 10,
  },
});

export default AnimalSearchScreen;
