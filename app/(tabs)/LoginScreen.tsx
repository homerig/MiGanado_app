import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
  
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
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
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>
      <Text style={styles.miganadoText}>MiGanado</Text>
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
    width: 150,
    height: 150,
    marginBottom: 50,
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
    backgroundColor: '#407157',
  },
  loginButton: {
    width: '50%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 70,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#407157',
    fontSize: 16,
  },
  registerButton: {
    width: '50%',
    padding: 15,
    marginVertical: 50,
    backgroundColor: '#fff',
    borderRadius: 70,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#407157',
    fontSize: 16,
  },
  miganadoText: {
    color: '#fff',
    fontSize: 25,
    marginTop: 10,
  },
});

export default LoginScreen;
