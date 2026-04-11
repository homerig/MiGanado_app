import React, { useContext, useState, useEffect } from 'react';
import { View, TextInput,  Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Asegúrate de que la ruta es correcta
import { ThemedView } from '@/components/ThemedView'; // Asegúrate de que la ruta es correcta
import { UserContext } from '../../api/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { createVacunacion, getUserLotes } from '@/api/api';
import { DateCarouselPicker } from '@/components/DateCarouselPicker';

import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type LoteOption = {
  id: number;
  numero: number;
};

const ErrorIcon = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.errorIcon}>
    <FontAwesomeIcon icon={faTimesCircle} size={24} color="#d44648" />
  </TouchableOpacity>
);

const VacunacionScreen = () => {
  const [numero_lote, setNumeroLote] = useState('');
  const [nombre_vacuna, setNombreVacuna] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [durante, setDurante] = useState('');
  const [cada, setCada] = useState('');
  const [numero_loteError, setNumeroLoteError] = useState(false);
  const [nombre_vacunaError, setNombreVacunaError] = useState(false);
  const [fechaInicioError, setFechaInicioError] = useState(false);
  const [duranteError, setDuranteError] = useState(false);
  const [cadaError, setCadaError] = useState(false);
  const { userId } = useContext(UserContext);

  const [lotes, setLotes] = useState<LoteOption[]>([]);
  const validateFields = () => {
    let isValid = true;
    if (!numero_lote) {
      setNumeroLoteError(true);
      isValid = false;
    } else {
      setNumeroLoteError(false);
    }
    if (!nombre_vacuna) {
      setNombreVacunaError(true);
      isValid = false;
    } else {
      setNombreVacunaError(false);
    }
    if (!fechaInicio) {
      setFechaInicioError(true);
      isValid = false;
    } else {
      setFechaInicioError(false);
    }
    if (!durante) {
      setDuranteError(true);
      isValid = false;
    } else {
      setDuranteError(false);
    }
    if (!cada) {
      setCadaError(true);
      isValid = false;
    } else {
      setCadaError(false);
    }
    return isValid;
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

  const opcionesLotes = Array.isArray(lotes) ? lotes.map((lote) => ({ title: String(lote.numero) })) : [];

  const handleGuardar = async () => {
    if (!validateFields()) {
      return;
    }
    try {
      
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
      const Nuevotratamiento = await createVacunacion({ numero_lote, nombre_vacuna, fechaInicio, durante, cada, userId });
      console.log("Tratamiento registrado:", Nuevotratamiento);
      setNumeroLote('');
      setNombreVacuna('');
      setFechaInicio('');
      setDurante('');
      setCada('');
      Alert.alert('Éxito', 'Vacunacion registrada correctamente.');
    } catch (error: any) {
      console.error('Error al registrar la vacunacion:', error.message);
      Alert.alert('Error', 'No se pudo guardar la vacunacion.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Vacunación</ThemedText>

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
          style={[styles.input, nombre_vacunaError && styles.errorInput]}
          placeholder="Nombre de la Vacuna"
          placeholderTextColor='#565859'
          value={nombre_vacuna}
          onChangeText={setNombreVacuna}
        />
        {nombre_vacunaError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Nombre de la Vacuna no puede estar vacío')} />}
      </View>

      <View style={styles.inputContainer}>
        <DateCarouselPicker value={fechaInicio} onChange={setFechaInicio} error={fechaInicioError} />
        {fechaInicioError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Fecha no puede estar vacío')} />}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, duranteError && styles.errorInput]}
          placeholder="Durante/Duración (días)"
          placeholderTextColor='#565859'
          value={durante}
          onChangeText={setDurante}
        />
        {duranteError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Durante no puede estar vacío')} />}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, cadaError && styles.errorInput]}
          placeholder="Cada..(días)"
          placeholderTextColor='#565859'
          value={cada}
          onChangeText={setCada}
        />
        {cadaError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Cada no puede estar vacío')} />}
      </View>


        <TouchableOpacity style={styles.button} onPress={handleGuardar}>
          <ThemedText style={styles.buttonText}>Agregar al calendario</ThemedText>
        </TouchableOpacity>

    </ThemedView>
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
    justifyContent: 'center',
  },
  errorInput: {
    borderColor: '#d44648',
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

export default VacunacionScreen;
