import React, { useState } from 'react';
import { useNavigation } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { registerUser } from '../../api/api';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [campo, setCampo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!name || !campo || !email || !password || !repeatPassword) {
      alert('Por favor, complete todos los campos');
      return;
    }

    if (password !== repeatPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const userData = {
      nombre: name,
      nombreCampo: campo,
      correoElectronico: email,
      contrasenia: password,
      idTipo: 'cliente',  // Ajusta según sea necesario
    };

    try {
      const registeredUser = await registerUser(userData);
      console.log('Usuario registrado:', registeredUser);
      navigation.navigate('(tabs)'); // Navegar después del registro exitoso
    } catch (error) {
      if (error.response) {
        console.error('Error al registrar el usuario:', error.response.data);
        alert(`Error al registrar el usuario: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error('Error al registrar el usuario:', error.message);
        alert('Error al registrar el usuario');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete sus datos</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#666666"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre campo/estancia"
        placeholderTextColor="#666666"
        value={campo}
        onChangeText={setCampo}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Repetir Contraseña"
        placeholderTextColor="#666666"
        secureTextEntry
        value={repeatPassword}
        onChangeText={setRepeatPassword}
      />
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleSignUp}>
        <Text style={styles.registerButtonText}>REGISTRARSE</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#407157',
  },
  input: {
    width: '90%',
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 70,
    backgroundColor: '#fff',
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

export default SignUpScreen;
