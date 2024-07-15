import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserContext } from '../../api/UserContext';
import { createSangrado, buscarAnimal, buscarSan, actualizarSangrado } from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

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
  const navigation = useNavigation();

  const validateFields = () => {
    let isValid = true;
    if (!numeroCaravana) {
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

  const handlesig = async () => {
    if (!validateFields()) {
      return;
    }
    try {
      const animalValido = await validar();
      if (animalValido) {
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
      navigation.navigate('(tabs)');
    } catch (error) {
      console.error('Error al finalizar:', error.message);
      Alert.alert('Error', 'No se pudo completar la acción.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Sangrado</ThemedText>
      <TextInput
        style={[styles.input, numeroLoteError && styles.errorInput]}
        placeholder="Seleccione Lote"
        value={numero_lote}
        onChangeText={setNumeroLote}
      />
      {numeroLoteError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Lote no puede estar vacío')} />}
      <TextInput
        style={[styles.input, numeroCaravanaError && styles.errorInput]}
        placeholder="Número de caravana"
        value={numeroCaravana}
        onChangeText={setNumeroCaravana}
      />
      {numeroCaravanaError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Número de caravana no puede estar vacío')} />}
      <TextInput
        style={[styles.input, numeroTuboError && styles.errorInput]}
        placeholder="Número del tubo de ensayo"
        value={numero_tubo}
        onChangeText={setNumeroTubo}
      />
      {numeroTuboError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Número del tubo de ensayo no puede estar vacío')} />}
      <TextInput
        style={[styles.input, fechaError && styles.errorInput]}
        placeholder="Fecha (YYYY-MM-DD)"
        value={fecha}
        onChangeText={setFecha}
      />
      {fechaError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo fecha no puede estar vacío')} />}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlesig}>
          <ThemedText style={styles.buttonText}>Siguiente</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleFinalizar}>
          <ThemedText style={styles.buttonText}>Finalizar</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
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
  input: {
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 16,
    paddingHorizontal: 10,
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
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
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

export default SangradoScreen;
