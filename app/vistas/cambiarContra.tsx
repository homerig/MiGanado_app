import React, { useState, useContext } from 'react';
import { useNavigation } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ThemedText } from '@/components/ThemedText';
import { UserContext } from '../../api/UserContext'; 
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { changePassword } from '../../api/api';

// Icono de 'X' para mostrar junto a los campos con error
const ErrorIcon = () => (
  <TouchableOpacity style={styles.errorIcon}>
    <FontAwesomeIcon icon={faTimesCircle} size={24} color="#d44648" />
  </TouchableOpacity>
);

const cambiarContraseñaScreen = () => {
  const navigation = useNavigation();
  
  const { setUserId } = useContext(UserContext);
  const [userID, setUserID] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    repeatPassword: '',
  });
  
  const handleChangePassword = async () => {
    try {
      // Llama a la función changePassword con los datos necesarios
      const userData = { userID, oldPassword, newPassword, repeatPassword };
      const response = await changePassword(userData);

      // Maneja la respuesta según sea necesario
      if (response && response.success) {
        Alert.alert('Contraseña cambiada correctamente');
        // Si es necesario, actualiza el estado global del ID de usuario utilizando el contexto
        if (setUserId) {
          setUserId(userID); // Actualiza el ID de usuario en el contexto si es necesario
        }
      } else {
        Alert.alert('Error al cambiar la contraseña', response.message || 'Hubo un problema al intentar cambiar la contraseña');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error.message);
      Alert.alert('Error', 'Hubo un problema al intentar cambiar la contraseña. Por favor, inténtalo nuevamente.');
    }
  };
  
  return (
    <View style={styles.container}>  
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.oldPassword ? styles.inputError : null]}
          placeholder="Contraseña Antigua"
          placeholderTextColor="#666666"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        {errors.oldPassword ? <ErrorIcon /> : null}
        {errors.oldPassword ? <Text style={styles.errorText}>{errors.oldPassword}</Text> : null}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.newPassword ? styles.inputError : null]}
          placeholder="Nueva Contraseña"
          placeholderTextColor="#666666"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        {errors.newPassword ? <ErrorIcon /> : null}
        {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.repeatPassword ? styles.inputError : null]}
          placeholder="Repetir Contraseña"
          placeholderTextColor="#666666"
          secureTextEntry
          value={repeatPassword}
          onChangeText={setRepeatPassword}
        />
        {errors.repeatPassword ? <ErrorIcon /> : null}
        {errors.repeatPassword ? <Text style={styles.errorText}>{errors.repeatPassword}</Text> : null}
      </View>
      <TouchableOpacity 
        style={styles.registerButton}
        onPress={handleChangePassword}
        >
        <Text style={styles.registerButtonText}>CAMBIAR CONTRASEÑA</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  inputContainer:{
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 25,
    color: '#407157',
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 70,
    backgroundColor: '#fff',
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
  registerButton: {
    width: '50%',
    padding: 15,
    marginVertical: 20,
    backgroundColor: '#407157',
    borderRadius: 70,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default cambiarContraseñaScreen;
