import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from 'expo-router';


const IngresarViaScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>Ingresar Vía</ThemedText>
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require('../../assets/images/google.jpeg')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.socialButtonText}>Continuar con Google</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require('../../assets/images/apple.jpeg')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.socialButtonText}>Continuar con Apple</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Image source={require('../../assets/images/sobre.jpg')} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.socialButtonText}>Continuar con Correo</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.orText}>o</Text>
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('singup')}>
        <Text style={styles.loginButtonText}>Registrarse Manualmente</Text>
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <ThemedText type="title" style={styles.logoText}>MiGanado</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#407157',
    padding: 16,
    paddingTop: 200,
  },
  title: {
    color: '#fff',
    marginBottom: 15,
  },
  logoContainer:{
    position: 'absolute',
    bottom: '10%',
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 15,
  },
  logoText: {
    color: '#fff', // Color del texto blanco
  },
  socialButton: {
    flexDirection: 'row',
    width: '90%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  socialButtonText: {
    color: '#407157',
    fontSize: 16,
  },
  orText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 10,
  },
  loginButton: {
    width: '90%',
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
});

export default IngresarViaScreen;
