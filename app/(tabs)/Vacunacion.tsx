import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Asegúrate de que la ruta es correcta
import { ThemedView } from '@/components/ThemedView'; // Asegúrate de que la ruta es correcta

export default function VacunacionScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Vacunación</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Seleccione Lote"
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre de la Vacuna"
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de inicio"
      />
      <TextInput
        style={styles.input}
        placeholder="Durante / Duración"
      />
      <TextInput
        style={styles.input}
        placeholder="Cada"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Agregar al calendario</ThemedText>
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
    padding: 2,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    width: '70%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
