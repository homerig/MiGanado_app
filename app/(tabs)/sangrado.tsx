import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserContext } from '../../api/UserContext';
import { createSangrado } from '../../api/api'; // Importar la función de API

export default function SangradoScreen() {
  const [lote, setLote] = useState('');
  const [numeroCaravana, setNumeroCaravana] = useState('');
  const [numeroTuboEnsayo, setNumeroTuboEnsayo] = useState('');
  const { userId } = useContext(UserContext);
  const navigation = useNavigation();

  const handleSave = async (navigateAfterSave = false) => {
    try {
      await createSangrado({ lote, numeroCaravana, numeroTuboEnsayo, userId });
      if (navigateAfterSave) {
        navigation.navigate('(tabs)');
      } else {
        setLote('');
        setNumeroCaravana('');
        setNumeroTuboEnsayo('');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el sangrado.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Sangrado</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Seleccione Lote"
        value={lote}
        onChangeText={setLote}
      />
      <TextInput
        style={styles.input}
        placeholder="Número de caravana"
        value={numeroCaravana}
        onChangeText={setNumeroCaravana}
      />
      <TextInput
        style={styles.input}
        placeholder="Número del tubo de ensayo"
        value={numeroTuboEnsayo}
        onChangeText={setNumeroTuboEnsayo}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleSave(false)}>
          <ThemedText style={styles.buttonText}>Siguiente</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleSave(true)}>
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
    textAlign: 'left',
    marginHorizontal: -2,
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
