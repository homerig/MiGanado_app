import React from 'react';
import { Image, StyleSheet, Platform, Alert, TouchableOpacity, Text,View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCoffee, faUser } from '@fortawesome/free-solid-svg-icons';


export default function HomeScreen() {
  return (

    
    <ThemedView style={styles.container}>
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">¡Bienvenido, (Nombre)!</ThemedText>
      </ThemedView>

      <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => Alert.alert('Botón personalizado presionado')}
      >
        <Text style={styles.buttonText}><FontAwesomeIcon icon={faUser} size={32} color="#000" />
        HOla
         </Text>
      </TouchableOpacity>
      </View>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  stepContainer: {
    marginBottom: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  button: {
    backgroundColor: '#407157',
    padding: 10,
    borderRadius: 5,
    height: 70,
    width: 205,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  
});
