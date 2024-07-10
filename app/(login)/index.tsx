
import React, { useState } from 'react';
import { useNavigation } from 'expo-router';
import { loginUser } from '../../api/api'; // Importa la función loginUser

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const userData = await loginUser(email, password); // Llama a la función loginUser con email y password
      console.log('Inicio de sesión exitoso:', userData);
      navigation.navigate('(tabs)');
      // Aquí puedes navegar a la siguiente pantalla o realizar otras acciones después del inicio de sesión exitoso
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      Alert.alert('Error', 'Inicio de sesión fallido');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>

      </View>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#666666"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#666666"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={() => Alert.alert('Recuperar contraseña')}>
        <Text style={styles.forgotPasswordText}>¿Has olvidado tu contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('ingresarvia')}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>
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
  logoContainer: {
    marginBottom: 90,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff', // Color del texto blanco
  },
  input: {
    width: '90%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 70,
    backgroundColor: '#fff',
  },
  forgotPasswordText: {
    color: '#fff',
    fontSize: 14,
    marginVertical: 10,
    textDecorationLine: 'underline',
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
    marginVertical: 90,
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
