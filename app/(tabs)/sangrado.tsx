import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SangradoScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Sangrado</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Seleccione Lote"
      />
      <TextInput
        style={styles.input}
        placeholder="Número de caravana"
      />
      <TextInput
        style={styles.input}
        placeholder="Número del tubo de ensayo"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Siguiente</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Finalizar</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    padding: 5,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left', // Alinear el texto a la izquierda
    marginHorizontal: -2, // Añadir margen horizontal para asegurar que no se corte
  },
  input: {
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});