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
} from 'react-native';
import { registerUser } from '../../api/api';

// Icono de 'X' para mostrar junto a los campos con error
const ErrorIcon = () => (
  <TouchableOpacity style={styles.errorIcon}>
    <FontAwesomeIcon icon={faTimesCircle} size={24} color="#d44648" />
  </TouchableOpacity>
);

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [campo, setCampo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    campo: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const navigation = useNavigation();
  const { setUserId } = useContext(UserContext); 
  const handleSignUp = async () => {
    setErrors({
      name: '',
      campo: '',
      email: '',
      password: '',
      repeatPassword: '',
    });

    let formIsValid = true;

    if (!name) {
      setErrors(prevState => ({
        ...prevState,
        name: 'Por favor, ingrese su nombre',
      }));
      formIsValid = false;
    }

    if (!campo) {
      setErrors(prevState => ({
        ...prevState,
        campo: 'Por favor, ingrese el nombre de su campo/estancia',
      }));
      formIsValid = false;
    }

    if (!email) {
      setErrors(prevState => ({
        ...prevState,
        email: 'Por favor, ingrese su correo electrónico',
      }));
      formIsValid = false;
    } else {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(email)) {
        setErrors(prevState => ({
          ...prevState,
          email: 'Ingrese un correo electrónico válido',
        }));
        formIsValid = false;
      }
    }

    if (!password) {
      setErrors(prevState => ({
        ...prevState,
        password: 'Por favor, ingrese su contraseña',
      }));
      formIsValid = false;
    }

    if (!repeatPassword) {
      setErrors(prevState => ({
        ...prevState,
        repeatPassword: 'Por favor, repita su contraseña',
      }));
      formIsValid = false;
    }

    if (password !== repeatPassword) {
      setErrors(prevState => ({
        ...prevState,
        password: 'Las contraseñas no coinciden',
        repeatPassword: 'Las contraseñas no coinciden',
      }));
      formIsValid = false;
    }

    if (formIsValid) {
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
        await setUserId(registeredUser.id)
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
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>Complete sus datos</ThemedText>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.name ? styles.inputError : null]}
          placeholder="Nombre"
          placeholderTextColor="#666666"
          value={name}
          onChangeText={setName}
        />
        {errors.name ? <ErrorIcon /> : null}
        {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

      </View>
      
      <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, errors.campo ? styles.inputError : null]}
        placeholder="Nombre campo/estancia"
        placeholderTextColor="#666666"
        value={campo}
        onChangeText={setCampo}
      />
      {errors.campo ? <ErrorIcon /> : null}
      {errors.campo ? <Text style={styles.errorText}>{errors.campo}</Text> : null}
      </View>


      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.email ? styles.inputError : null]}
          placeholder="Correo electrónico"
          placeholderTextColor="#666666"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {errors.email ? <ErrorIcon /> : null}
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.password ? styles.inputError : null]}
          placeholder="Contraseña"
          placeholderTextColor="#666666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errors.password ? <ErrorIcon /> : null}
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
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

export default SignUpScreen;
