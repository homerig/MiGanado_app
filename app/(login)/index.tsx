import React, { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../../api/api'; // Importa la función loginUser
import { ThemedText } from '@/components/ThemedText';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { UserContext } from '../../api/UserContext'; 

const ErrorIcon = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.errorIcon}>
    <FontAwesomeIcon icon={faTimesCircle} size={24} color="#d44648" />
  </TouchableOpacity>
);

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigation = useNavigation();
  const { setUserId } = useContext(UserContext); // Utiliza setUserId del contexto

  const validateFields = () => {
    let isValid = true;
    if (!email) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }
    if (!password) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateFields()) {
      return;
    }
    try {
      const userData = await loginUser(email, password); // Llama a la función loginUser con email y password
      console.log('Inicio de sesión exitoso:', userData);
      await setUserId(userData.id); // Guarda el ID del usuario en el contexto y AsyncStorage
      navigation.navigate('(tabs)'); // Navega a la pantalla Home
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      Alert.alert('Error', 'Inicio de sesión fallido');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="Correo electrónico"
          placeholderTextColor="#666666"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {emailError && (
          <ErrorIcon onPress={() => Alert.alert('Error', 'El correo electrónico no puede estar vacío')} />
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, passwordError && styles.inputError]}
          placeholder="Contraseña"
          placeholderTextColor="#666666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {passwordError && (
          <ErrorIcon onPress={() => Alert.alert('Error', 'La contraseña no puede estar vacía')} />
        )}
      </View>

      <TouchableOpacity onPress={() => Alert.alert('Recuperar contraseña')}>
        <Text style={styles.forgotPasswordText}>¿Has olvidado tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('ingresarvia')}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>
      <ThemedText type="title" style={styles.logoText}>MiGanado</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#407157',
    padding: 16,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 50,
  },
  logoText: {
    color: '#fff', // Color del texto blanco
  },
  inputContainer: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 70,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#d44648',
    borderTopWidth: 2,
  },
  errorIcon: {
    position: 'absolute',
    right: 15,
  },
  forgotPasswordText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 25,
    textDecorationLine: 'none',
    backgroundColor: '#407157', // Cambio de color del texto a blanco
  },
  loginButton: {
    width: '50%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff', // Color de fondo blanco
    borderRadius: 70,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#407157', // Cambio de color del texto a verde del botón
    fontSize: 16, // Tamaño de texto más pequeño
  },
  registerButton: {
    width: '50%',
    padding: 15,
    marginTop: 100,
    marginBottom: 40,
    backgroundColor: '#fff', // Color de fondo blanco
    borderRadius: 70,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#407157', // Cambio de color del texto a verde del botón
    fontSize: 16, // Tamaño de texto más pequeño
  },
});

export default LoginScreen;
