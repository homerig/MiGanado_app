import React, { useContext, useDeferredValue, useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Asegúrate de que la ruta es correcta
import { ThemedView } from '@/components/ThemedView'; // Asegúrate de que la ruta es correcta
import { UserContext } from '../../api/UserContext';
import { createTratamiento, buscarAnimalLote, getUserLotes } from '../../api/api';
import { DateCarouselPicker } from '@/components/DateCarouselPicker';
import { getNumeroCaravanaError, NUMERO_CARAVANA_MAX_LENGTH, sanitizeNumeroCaravana } from '@/utils/caravana';
import { DismissKeyboardView } from '@/components/DismissKeyboardView';
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type LoteOption = {
  id: number;
  numero: number;
};

type AnimalItem = {
  numeroCaravana: string;
  numero_lote: number | string;
};

const TratamientosScreen = () => {
  const [numero_lote, setNumeroLote] = useState('');
  const [numeroCaravana, setNumeroCaravana] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [medicacion, setMedicacion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [durante, setDuracion] = useState('');
  const [cada, setCada] = useState('');
  const { userId } = useContext(UserContext);
  const [lotes, setLotes] = useState<LoteOption[]>([]);
  const [animalesLote, setAnimalesLote] = useState<AnimalItem[]>([]);
  const deferredNumeroCaravana = useDeferredValue(numeroCaravana);

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await getUserLotes(userId);
        if (Array.isArray(response)) {
          setLotes(response);
        }
      } catch (error) {
        console.error('Error fetching lotes:', error);
      }
    };

    fetchLotes();
  }, [userId]);

  useEffect(() => {
    const fetchAnimalesLote = async () => {
      if (!numero_lote) {
        setAnimalesLote([]);
        return;
      }

      try {
        const animales = await buscarAnimalLote(userId, numero_lote);
        setAnimalesLote(Array.isArray(animales) ? animales : []);
      } catch (error) {
        console.error('Error fetching animals by lote:', error);
        setAnimalesLote([]);
      }
    };

    fetchAnimalesLote();
  }, [numero_lote, userId]);

  const opcionesLotes = Array.isArray(lotes) ? lotes.map((lote) => ({ title: String(lote.numero) })) : [];
  const filteredAnimals = deferredNumeroCaravana.length < 2
    ? []
    : animalesLote.filter((animal) => animal.numeroCaravana.includes(deferredNumeroCaravana));

  const handleGuardar = async () => {
    const numeroCaravanaError = getNumeroCaravanaError(numeroCaravana);

    if (numeroCaravanaError) {
      Alert.alert('Error', numeroCaravanaError);
      return;
    }

    try {
      
      const Nuevotratamiento = await createTratamiento({ numeroCaravana, tratamiento , medicacion, fechaInicio, cada, durante, userId });
      console.log("Tratamiento registrado:", Nuevotratamiento);
      setNumeroLote('');
      setNumeroCaravana('');
      setTratamiento('');
      setMedicacion('');
      setFechaInicio('');
      setCada('');
      setDuracion('');
      Alert.alert('Éxito', 'Tratamiento registrado correctamente.');
    } catch (error: any) {
      console.error('Error al registrar el tratamiento:', error.message);
      Alert.alert('Error', 'No se pudo guardar el tratamiento.');
    }
  }

  return (
    <DismissKeyboardView>
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Tratamientos</ThemedText>

      <View>
        <SelectDropdown
          data={opcionesLotes}
          onSelect={(selectedItem) => {
            setNumeroLote(selectedItem.title);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                {selectedItem && (
                  <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
                )}
                <Text style={styles.dropdownButtonTxtStyle}>
                  {selectedItem ? `Lote ${selectedItem.title}` : 'Número de lote'}
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
        placeholderTextColor='#565859'
        value={numeroCaravana}
        onChangeText={(text) => setNumeroCaravana(sanitizeNumeroCaravana(text))}
        keyboardType="number-pad"
        maxLength={NUMERO_CARAVANA_MAX_LENGTH}
      />
      {deferredNumeroCaravana.length >= 2 && filteredAnimals.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {filteredAnimals.slice(0, 6).map((animal) => (
            <TouchableOpacity
              key={animal.numeroCaravana}
              style={styles.suggestionChip}
              onPress={() => setNumeroCaravana(animal.numeroCaravana)}
            >
              <ThemedText style={styles.suggestionText}>{animal.numeroCaravana}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Nombre del Tratamiento"
        placeholderTextColor='#565859'
        value={tratamiento}
        onChangeText={setTratamiento}
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre de la Medicación"
        placeholderTextColor='#565859'
        value={medicacion}
        onChangeText={setMedicacion}
      />

      <DateCarouselPicker value={fechaInicio} onChange={setFechaInicio} />

      <TextInput
        style={styles.input}
        placeholder="Durante/Duración (días)"
        placeholderTextColor='#565859'
        value={durante}
        onChangeText={setDuracion}
      />

      <TextInput
        style={styles.input}
        placeholder="Cada..(días)"
        placeholderTextColor='#565859'
        value={cada}
        onChangeText={setCada}
      />

      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
          <ThemedText style={styles.buttonText}>Agregar al calendario</ThemedText>
        </TouchableOpacity>
    </ThemedView>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 24,
    padding: 2,
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
    justifyContent: 'center',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
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
  button: {
    backgroundColor: '#407157',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  dropdownButtonStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 16,
    color: '#565859',
  },
  dropdownButtonArrowStyle: {
    fontSize: 22,
    color: '#565859',
  },
  dropdownButtonIconStyle: {
    fontSize: 22,
    marginRight: 8,
    color: '#565859',
  },
  dropdownMenuStyle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 16,
    color: '#151E26',
  },
});

export default TratamientosScreen;
