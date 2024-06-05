import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#FFF"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#FFF"
        secureTextEntry
      />
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>¿Has olvidado tu contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>MiGanado</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#355e3b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: '#527351',
    borderRadius: 20,
    paddingHorizontal: 10,
    color: '#FFF',
    marginBottom: 10,
  },
  forgotPassword: {
    color: '#FFF',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#527351',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  registerButton: {
    width: '80%',
    height: 40,
    backgroundColor: '#D0D0D0',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#355e3b',
    fontSize: 16,
  },
  footerText: {
    color: '#FFF',
    fontSize: 18,
    marginTop: 20,
  },
});
