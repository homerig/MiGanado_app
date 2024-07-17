
import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, Text, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Asegúrate de que la ruta es correcta
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ThemedView } from '@/components/ThemedView'; // Asegúrate de que la ruta es correcta
import { registerAnimal, getUserLotes, buscarAnimal } from '../../api/api';
import { UserContext } from '../../api/UserContext';
import { useNavigation } from 'expo-router';

const ErrorIcon = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.errorIcon}>
    <FontAwesomeIcon icon={faTimesCircle} size={24} color="#d44648" />
  </TouchableOpacity>
);

const IngresarAnimalScreen = () => {
  const [numeroCaravana, setNumeroCaravana] = useState('');
  const [peso, setPeso] = useState('');
  const [edad, setEdad] = useState('');
  const [preniada, setPreniada] = useState(false);
  const [reciennacida, setReciennacida] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isTipoModalVisible, setIsTipoModalVisible] = useState<boolean>(false);
  const [tipos, setTipos] = useState(''); 
  const [numero_lote, setLotes] = useState(''); 
  const { userId } = useContext(UserContext);
  const [numero_loteError, setNumeroLoteError] = useState(false);
  const [numeroCaravanaError, setnumeroCaravanaError] = useState(false);
  const [pesoError, setPesoError] = useState(false);
  const [edadError, setEdadError] = useState(false);
  const [tiposError, setTiposError] = useState(false);

  const validateFields = () => {
    let isValid = true;
    if (!numero_lote) {
      setNumeroLoteError(true);
      isValid = false;
    } else {
      setNumeroLoteError(false);
    }
    if (!numeroCaravana) {
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
  const navigation = useNavigation();
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

      const animal = await registerAnimal({ numeroCaravana, numero_lote, tipos, peso, edad, preniada, reciennacida, userId});
      console.log("Animal registrado:", animal);
      setNumeroCaravana('');
      setPeso('');
      setEdad('');
      setLotes('');
      setTipos('');
      setPreniada(false);
      setReciennacida(false);
      Alert.alert('Éxito', 'Animal registrado correctamente.');
    } catch (error) {
      console.error('Error al registrar el animal:', error.message);
      Alert.alert('Error', 'No se pudo guardar el animal.');
    }
  };
  const handleFinalizar = () => {
    navigation.navigate('(tabs)');
  };


  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>Ingresar Animal</ThemedText>


      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Ingrese Tipo"
        value={tipos}
        onChangeText={setTipos}
      />
      {tiposError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Lote no puede estar vacío')} />}
      </View>

      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Ingresar número de Lote"
        value={numero_lote}
        onChangeText={setLotes}
      />
      {numero_loteError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Lote no puede estar vacío')} />}
      </View>

      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Número de caravana"
        value={numeroCaravana}
        onChangeText={setNumeroCaravana}
      />
      {numeroCaravanaError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Lote no puede estar vacío')} />}
      </View>

      <ThemedText style={styles.subLabel}>Historial Médico</ThemedText>
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Peso"
        value={peso}
        onChangeText={setPeso}
      />
      {pesoError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Lote no puede estar vacío')} />}
      </View>

      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
      />
      {edadError &&  <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Edad no puede estar vacío')} />}
      </View>

      <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxLabel}>Recién nacido</Text>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setReciennacida(!reciennacida)}
        >
          {reciennacida && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxLabel}>Preñada</Text>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setPreniada(!preniada)}
        >
          {preniada && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      </View>

      

      <TouchableOpacity
        style={styles.greenButton}
        onPress={handleGuardarAnimal} // Aquí se llama a la función handleGuardarAnimal
      >
        <ThemedText style={styles.greenButtonText}>Guardar</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.greenButton} onPress={handleFinalizar}>
          <ThemedText style={styles.buttonText}>Finalizar</ThemedText>
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
  subLabel: {
    fontSize: 18,
    padding: 2,
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
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: '#F1F1F1',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
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
});
export default IngresarAnimalScreen;