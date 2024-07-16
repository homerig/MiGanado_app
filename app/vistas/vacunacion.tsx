import React, { useContext, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Asegúrate de que la ruta es correcta
import { ThemedView } from '@/components/ThemedView'; // Asegúrate de que la ruta es correcta
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../api/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { createVacunacion, getUserLotes } from '@/api/api';

const ErrorIcon = ({ onPress }) => (
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

  const navigation = useNavigation();

  const handleGuardar = async () => {
    if (!validateFields()) {
      return;
    }
    try {
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
      const Nuevotratamiento = await createVacunacion({ numero_lote, nombre_vacuna, fechaInicio, durante, cada, userId });
      console.log("Tratamiento registrado:", Nuevotratamiento);
      setNumeroLote('');
      setNombreVacuna('');
      setFechaInicio('');
      setDurante('');
      setCada('');
      Alert.alert('Éxito', 'Vacunacion registrada correctamente.');
    } catch (error) {
      console.error('Error al registrar la vacunacion:', error.message);
      Alert.alert('Error', 'No se pudo guardar la vacunacion.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Vacunación</ThemedText>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, numero_loteError && styles.errorInput]}
          placeholder="Seleccione Lote"
          value={numero_lote}
          onChangeText={setNumeroLote}
        />
        {numero_loteError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Lote no puede estar vacío')} />}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, nombre_vacunaError && styles.errorInput]}
          placeholder="Nombre de la Vacuna"
          value={nombre_vacuna}
          onChangeText={setNombreVacuna}
        />
        {nombre_vacunaError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Nombre de la Vacuna no puede estar vacío')} />}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, fechaInicioError && styles.errorInput]}
          placeholder="Fecha (YYYY-MM-DD)"
          value={fechaInicio}
          onChangeText={setFechaInicio}
        />
        {fechaInicioError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Fecha no puede estar vacío')} />}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, duranteError && styles.errorInput]}
          placeholder="Durante/Duración (dias)"
          value={durante}
          onChangeText={setDurante}
        />
        {duranteError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Durante no puede estar vacío')} />}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, cadaError && styles.errorInput]}
          placeholder="Cada..(dias)"
          value={cada}
          onChangeText={setCada}
        />
        {cadaError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Cada no puede estar vacío')} />}
      </View>

      <View style={styles.button}>
        <TouchableOpacity style={styles.button} onPress={handleGuardar}>
          <ThemedText style={styles.buttonText}>Agregar al calendario</ThemedText>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 10,
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
});

export default VacunacionScreen;
