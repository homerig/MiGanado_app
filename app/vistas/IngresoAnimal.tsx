
import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Asegúrate de que la ruta es correcta
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ThemedView } from '@/components/ThemedView'; // Asegúrate de que la ruta es correcta
import { registerAnimal, getUserLotes, buscarAnimal } from '../../api/api';
import { UserContext } from '../../api/UserContext';
import { useRouter } from 'expo-router';
import { getNumeroCaravanaError, NUMERO_CARAVANA_MAX_LENGTH, sanitizeNumeroCaravana } from '@/utils/caravana';
import { DismissKeyboardView } from '@/components/DismissKeyboardView';

import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NumberCarouselPicker } from '@/components/NumberCarouselPicker';

const sanitizePeso = (text: string) => text.replace(/[^0-9.,]/g, '').replace(',', '.');

type LoteOption = {
  id: number;
  numero: number;
  nombre_lote: string;
};

const ErrorIcon = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.errorIcon}>
    <FontAwesomeIcon icon={faTimesCircle} size={24} color="#d44648" />
  </TouchableOpacity>
);

const IngresarAnimalScreen = () => {
  const [numeroCaravana, setNumeroCaravana] = useState('');
  const [peso, setPeso] = useState('');
  const [edad, setEdad] = useState('0');
  const [preniada, setPreniada] = useState(false);
  const [reciennacida, setReciennacida] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isTipoModalVisible, setIsTipoModalVisible] = useState<boolean>(false);
  const [tipos, setTipos] = useState(''); 
  const [numero_lote, setNumeroLote] = useState(''); 
  const { userId } = useContext(UserContext);
  const [numero_loteError, setNumeroLoteError] = useState(false);
  const [numeroCaravanaError, setnumeroCaravanaError] = useState(false);
  const [pesoError, setPesoError] = useState(false);
  const [edadError, setEdadError] = useState(false);
  const [tiposError, setTiposError] = useState(false);
  const [lotes, setLotes] = useState<LoteOption[]>([]);
  
  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await getUserLotes(userId);
        if (Array.isArray(response)) {
          setLotes(response);

          if (response.length === 0) {
            Alert.alert('Sin lotes', 'Primero tenés que crear al menos un lote para poder ingresar un animal.');
          }
        } else {
          console.error('Unexpected response structure:', response);
        }
      } catch (error) {
        console.error('Error fetching lotes:', error);
      }
    };
    fetchLotes();
  }, [userId]); // Re-run effect if userId changes

  const opcionesLotes = Array.isArray(lotes) ? lotes.map((lote) => ({ title: String(lote.numero) })) : [];

  const animalTypes = [
    { title: 'Vaca' },
    { title: 'Toro' }
  ];
  const isToro = tipos.toLowerCase() === 'toro';

  const validateFields = () => {
    let isValid = true;
    if (lotes.length === 0) {
      Alert.alert('Sin lotes', 'Primero tenés que crear un lote para poder ingresar animales.');
      return false;
    }
    if (!numero_lote) {
      setNumeroLoteError(true);
      isValid = false;
    } else {
      setNumeroLoteError(false);
    }
    if (!numeroCaravana) {
      setnumeroCaravanaError(true);
      isValid = false;
    } else if (getNumeroCaravanaError(numeroCaravana)) {
      setnumeroCaravanaError(true);
      isValid = false;
    } else {
      setnumeroCaravanaError(false);
    }
    if (!peso) {
      setPesoError(true);
      isValid = false;
    } else {
      setPesoError(false);
    }
    if (!edad) {
      setEdadError(true);
      isValid = false;
    } else {
      setEdadError(false);
    }
    if (!tipos) {
      setTiposError(true);
      isValid = false;
    } else {
      setTiposError(false);
    }
    return isValid;
  };
  const router = useRouter();
  const handleGuardarAnimal = async () => {
    if (!validateFields()) {
      return;
    }
    try {
      const animal2 = await buscarAnimal(userId, numeroCaravana);
      if (animal2 && animal2.numeroCaravana === numeroCaravana) {
        Alert.alert('Error', 'El número de caravana ya está en uso.');
        return;
      }
      const lotes: LoteOption[] = await getUserLotes(userId);
      console.log('Lotes:', lotes);

       const numeroLoteInt = parseInt(numero_lote, 10);
      const loteExiste = lotes.some((lote) => {
      console.log(`Comparando ${lote.numero} con ${numeroLoteInt}`); 
      return lote.numero === numeroLoteInt;
    });
    
      
      if (!loteExiste) {
        Alert.alert('Error', 'El lote especificado no existe.');
        return;
      }
      const animal = await registerAnimal({ numeroCaravana, numero_lote, tipos, peso, edad, preniada, reciennacida, userId});
      console.log("Animal registrado:", animal);
      setNumeroCaravana('');
      setPeso('');
      setEdad('0');
      setPreniada(false);
      setReciennacida(false);
      setTipos('');
      setNumeroLote('');
      Alert.alert('Éxito', 'Animal registrado correctamente.');
    } catch (error: any) {
      console.error('Error al registrar el animal:', error.message);
      Alert.alert('Error', 'No se pudo guardar el animal.');
    }
  };

  const handleRecienNacidaToggle = () => {
    setReciennacida((prev) => {
      const nextValue = !prev;

      if (nextValue) {
        setEdad('0');
      }

      return nextValue;
    });
  };
  const handleFinalizar = () => {
    router.replace('/home');
  };


  return (
    <DismissKeyboardView>
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Ingresar Animal</ThemedText>


      <View style={styles.inputContainer}>
        <SelectDropdown
          data={animalTypes}
          onSelect={(selectedItem, index) => {
            setTipos(selectedItem.title);
            if (selectedItem.title.toLowerCase() === 'toro') {
              setPreniada(false);
            }
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                  <Text style={styles.dropdownButtonTxtStyle}>
                  {selectedItem ? `${selectedItem.title}` : tipos || 'Seleccione tipo'}
                </Text>
                <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
        
      </View>

      <View>
        <SelectDropdown
            data={opcionesLotes}
            onSelect={(selectedItem, index) => {
              setNumeroLote(selectedItem.title);
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  {selectedItem && (
                    <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
                  )}
                    <Text style={styles.dropdownButtonTxtStyle}>
                    {selectedItem ? `Lote ${selectedItem.title}` : numero_lote ? `Lote ${numero_lote}` : 'Número de lote'}
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

      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Número de caravana"
        placeholderTextColor='#565859'
        value={numeroCaravana}
        onChangeText={(text) => setNumeroCaravana(sanitizeNumeroCaravana(text))}
        keyboardType="number-pad"
        maxLength={NUMERO_CARAVANA_MAX_LENGTH}
      />
      {numeroCaravanaError && <ErrorIcon onPress={() => Alert.alert('Error', getNumeroCaravanaError(numeroCaravana) ?? 'El campo Número de caravana no puede estar vacío')} />}
      </View>

      <ThemedText style={styles.subLabel}>Historial Médico</ThemedText>
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        placeholderTextColor='#565859'
        value={peso}
        onChangeText={(text) => setPeso(sanitizePeso(text))}
        keyboardType="decimal-pad"
      />
      {pesoError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Peso no puede estar vacío')} />}
      </View>

      <NumberCarouselPicker
        value={edad}
        onChange={(value) => {
          if (!reciennacida) {
            setEdad(value);
          }
        }}
        label="Edad (años)"
        max={25}
      />
      {edadError &&  <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Edad no puede estar vacío')} />}

      <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxLabel}>Recién nacido</Text>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={handleRecienNacidaToggle}
        >
          {reciennacida && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      </View>

      {!isToro && (
        <View style={styles.checkboxContainer}>
          <Text style={styles.checkboxLabel}>Preñada</Text>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setPreniada(!preniada)}
          >
            {preniada && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        </View>
      )}

      

      <TouchableOpacity
        style={styles.greenButton}
        onPress={handleGuardarAnimal} // Aquí se llama a la función handleGuardarAnimal
      >
        <ThemedText style={styles.greenButtonText}>Guardar</ThemedText>
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
  subLabel: {
    fontSize: 18,
    paddingHorizontal: 20,
    marginTop: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
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
  inputContainer: {
    position: 'relative',
  },
  inputError: {
    borderColor: '#d44648',
  },
  errorIcon: {
    position: 'absolute',
    right: 30,
    top: 20,
    color: '#d44648',

  },
  errorText: {
    color: '#d44648',
    fontSize: 12,
    marginBottom: 5,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  grayButton: {
    backgroundColor: '#A9A9A9',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  grayButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  greenButton: {
    backgroundColor: '#407157',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  greenButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 5,
  },
  checkboxLabel: {
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#407157',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalItem: {
    padding: 10,
    color: '#407157',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  closeText: {
    marginTop: 10,
    color: '#407157',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#407157',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#FFFFFF',
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
export default IngresarAnimalScreen;
