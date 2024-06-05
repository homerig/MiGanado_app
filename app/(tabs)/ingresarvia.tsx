import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

const IngresarViaScreen = () => {
  const [logoSize, setLogoSize] = useState(90); // Tamaño inicial del logo

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Ingresar Vía</Text>
      </View>
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
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Registarme</Text>
      </TouchableOpacity>
      <Image source={require('../../assets/images/logo.png')} style={{ width: logoSize, height: logoSize, marginTop: 100 }} />
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
  logoContainer: {
    marginBottom: 40,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
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
  miganadoText: {
  color: '#fff',
  fontSize: 25,
  marginTop: 10,
},
});

export default IngresarViaScreen;
