import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserContext } from '../../api/UserContext';
import { createTacto, buscarAnimal, actualizarPrenies, getUserLotes } from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const ErrorIcon = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.errorIcon}>
    <FontAwesomeIcon icon={faTimesCircle} size={24} color="#d44648" />
  </TouchableOpacity>
);

const TactoScreen = () => {
  const [numero_lote, setNumeroLote] = useState('');
  const [numeroCaravana, setNumeroCaravana] = useState('');
  const [prenada, setPrenada] = useState(false);
  const [fecha, setFecha] = useState('');
  const [numeroLoteError, setNumeroLoteError] = useState(false);
  const [numeroCaravanaError, setNumeroCaravanaError] = useState(false);
  const [fechaError, setFechaError] = useState(false);
  const [animalEncontrado, setAnimalEncontrado] = useState(false);
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

  const handleFinalizar = async () => {
    if (!validateFields()) {
      return;
    }
    try {
      const result = await handlesig();
      if (result) {
        Alert.alert('Éxito', 'Tacto registrado y finalizado correctamente.');
        navigation.navigate('(tabs)');
      }
    } catch (error) {
      console.error('Error al finalizar:', error.message);
      Alert.alert('Error', 'No se pudo completar la acción.');
    }
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

  const handlesig = async () => {
    if (!validateFields()) {
      return false;
    }
    const valid = await validar();
    if (valid) {
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
        const tacto = await createTacto({ numero_lote, numeroCaravana, fecha, prenada, userId });
        console.log("Tacto registrado:", tacto);
        
        // Actualizar la preñez del animal
        await actualizarPrenies(userId, numeroCaravana, prenada);
        console.log("Preñez del animal actualizada");
        
        // Limpiar los campos después de guardar exitosamente
        setNumeroLote('');
        setNumeroCaravana('');
        setPrenada(false);
        setFecha('');
        Alert.alert('Éxito', 'Tacto registrado correctamente.');
        return true;
      } catch (error) {
        console.error('Error al registrar el tacto:', error.message);
        Alert.alert('Error', 'No se pudo guardar el tacto.');
        return false;
      }
    }
    return false;
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Tacto</ThemedText>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, numeroLoteError && styles.errorInput]}
          placeholder="Seleccione Lote"
          value={numero_lote}
          onChangeText={setNumeroLote}
        />
        {numeroLoteError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Lote no puede estar vacío')} />}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, numeroCaravanaError && styles.errorInput]}
          placeholder="Número de caravana"
          value={numeroCaravana}
          onChangeText={setNumeroCaravana}
        />
        {numeroCaravanaError && (
          <ErrorIcon
            onPress={() =>
              Alert.alert('Error', 'El campo Número de caravana no puede estar vacío')
            }
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, fechaError && styles.errorInput]}
          placeholder="Fecha (YYYY-MM-DD)"
          value={fecha}
          onChangeText={setFecha}
        />
        {fechaError && (
          <ErrorIcon onPress={() => Alert.alert('Error', 'El campo fecha no puede estar vacío')} />
        )}
      </View>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setPrenada(!prenada)}
        >
          <View style={styles.box}>
            {prenada && <ThemedText style={styles.checkmark}>✓</ThemedText>}
          </View>
        </TouchableOpacity>
        <ThemedText style={styles.label}>Preñada</ThemedText>
      </View>

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
  },
  errorInput: {
    borderColor: '#d44648',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 8,
  },
  box: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#407157',
    fontSize: 18,
  },
  label: {
    margin: 8,
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
  errorIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default TactoScreen;
