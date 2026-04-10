import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserContext } from '../../api/UserContext';
import { createSangrado, buscarAnimal, buscarSan, actualizarSangrado, getUserLotes } from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { DateCarouselPicker } from '@/components/DateCarouselPicker';

import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getNumeroCaravanaError, NUMERO_CARAVANA_MAX_LENGTH, sanitizeNumeroCaravana } from '@/utils/caravana';
import { DismissKeyboardView } from '@/components/DismissKeyboardView';

const ErrorIcon = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.errorIcon}>
    <FontAwesomeIcon icon={faTimesCircle} size={24} color="#d44648" />
  </TouchableOpacity>
);

const SangradoScreen = () => {
  const [numero_lote, setNumeroLote] = useState('');
  const [numeroCaravana, setNumeroCaravana] = useState('');
  const [numero_tubo, setNumeroTubo] = useState('');
  const [numeroCaravanaError, setNumeroCaravanaError] = useState(false);
  const [numeroTuboError, setNumeroTuboError] = useState(false);
  const [numeroLoteError, setNumeroLoteError] = useState(false);
  const [fechaError, setFechaError] = useState(false);
  const [fecha, setFecha] = useState('');
  const { userId } = useContext(UserContext);
  
  const [lotes, setLotes] = useState([]);
  
  const router = useRouter();


  const validateFields = () => {
    let isValid = true;
    if (!numeroCaravana) {
      setNumeroCaravanaError(true);
      isValid = false;
    } else if (getNumeroCaravanaError(numeroCaravana)) {
      setNumeroCaravanaError(true);
      isValid = false;
    } else {
      setNumeroCaravanaError(false);
    }
    if (!numero_tubo) {
      setNumeroTuboError(true);
      isValid = false;
    } else {
      setNumeroTuboError(false);
    }
    if (!numero_lote) {
      setNumeroLoteError(true);
      isValid = false;
    } else {
      setNumeroLoteError(false);
    }
    if (!fecha) {
      setFechaError(true);
      isValid = false;
    } else {
      setFechaError(false);
    }
    return isValid;
  };

  const validar = async () => {
    try {
      const animal = await buscarAnimal(userId, numeroCaravana);
      if (animal && animal.numeroCaravana === numeroCaravana) {
        return true;
      } else {
        Alert.alert(
          'Animal no encontrado',
          'No se encontró un animal con ese número de caravana. Inténtelo de nuevo.',
          [{ text: 'OK', onPress: () => setNumeroCaravana('') }]
        );
        return false;
      }
    } catch (error) {
      console.error('Error al buscar animal:', error);
      Alert.alert('Error', 'No se pudo buscar el animal. Inténtelo de nuevo más tarde.');
      return false;
    }
  };

  const validarSangrado = async () => {
    try {
      const sangrado = await buscarSan(userId, numeroCaravana);
      if (sangrado && sangrado.numeroCaravana === numeroCaravana) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error al buscar animal:', error);
      Alert.alert('Error', 'No se pudo buscar el animal. Inténtelo de nuevo más tarde.');
      return false;
    }
  };

  useEffect(() => {
    // Define the async function
    const fetchLotes = async () => {
      try {
        const response = await getUserLotes(userId); // Replace with your API call
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

  const opcionesLotes = Array.isArray(lotes) ? lotes.map(lote => ({ title: lote.numero })) : [];


  const handlesig = async () => {
    if (!validateFields()) {
      return;
    }
    try {
      const animalValido = await validar();
      if (animalValido) {
        const lotes = await getUserLotes(userId);
        console.log('Lotes:', lotes);
        const numeroLoteInt = parseInt(numero_lote, 10);
        const loteExiste = lotes.some(lote => {
          console.log(`Comparando ${lote.numero} con ${numeroLoteInt}`); 
          return lote.numero === numeroLoteInt;
        });
        
          
          if (!loteExiste) {
            Alert.alert('Error', 'El lote especificado no existe.');
            return;
          }
        const sangradoExistente = await validarSangrado();
        if (sangradoExistente) {
          await actualizarSangrado(userId, numeroCaravana, numero_tubo);
          Alert.alert('Éxito', 'Sangrado actualizado correctamente.');
        } else {
          await createSangrado({ numero_lote, numeroCaravana, numero_tubo, fecha, userId });
          Alert.alert('Éxito', 'Sangrado registrado correctamente.');
        }
        setNumeroLote('');
        setNumeroCaravana('');
        setNumeroTubo('');
        setFecha('');
      }
    } catch (error) {
      console.error('Error al registrar el sangrado:', error.message);
      Alert.alert('Error', 'No se pudo guardar el sangrado.');
    }
  };

  const handleFinalizar = async () => {
    if (!validateFields()) {
      return;
    }
    try {
      await handlesig();
      router.replace('/home');
    } catch (error) {
      console.error('Error al finalizar:', error.message);
      Alert.alert('Error', 'No se pudo completar la acción.');
    }
  };

  return (
    <DismissKeyboardView>
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Sangrado</ThemedText>

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

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, numeroCaravanaError && styles.errorInput]}
          placeholder="Número de caravana"
          placeholderTextColor='#565859'
          value={numeroCaravana}
          onChangeText={(text) => setNumeroCaravana(sanitizeNumeroCaravana(text))}
          keyboardType="number-pad"
          maxLength={NUMERO_CARAVANA_MAX_LENGTH}
        />
        {numeroCaravanaError && <ErrorIcon onPress={() => Alert.alert('Error', getNumeroCaravanaError(numeroCaravana) ?? 'El campo Número de caravana no puede estar vacío')} />}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, numeroTuboError && styles.errorInput]}
          placeholder="Número del tubo de ensayo"
          placeholderTextColor='#565859'
          value={numero_tubo}
          onChangeText={setNumeroTubo}
        />
        {numeroTuboError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Número del tubo de ensayo no puede estar vacío')} />}
      </View>

      <View style={styles.inputContainer}>
        <DateCarouselPicker value={fecha} onChange={setFecha} error={fechaError} />
        {fechaError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Fecha no puede estar vacío')} />}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={handlesig}>
          <ThemedText style={styles.buttonText}>Siguiente</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={handleFinalizar}>
          <ThemedText style={styles.buttonText}>Finalizar</ThemedText>
        </TouchableOpacity>
      </View>
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
    padding: 5,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    marginHorizontal: -2,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  errorInput: {
    borderColor: '#d44648',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonGreen: {
    backgroundColor: '#407157',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
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

export default SangradoScreen;
