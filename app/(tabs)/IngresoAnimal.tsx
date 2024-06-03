import { ThemedText } from '@/components/ThemedText';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, CheckBox, StyleSheet, ScrollView, Picker} from 'react-native';

const AnimalForm = () => {
  const [tipo, setTipo] = useState('');
  const [lote, setLote] = useState('');
  const [numeroCaravana, setNumeroCaravana] = useState('');
  const [peso, setPeso] = useState('');
  const [edad, setEdad] = useState('');
  const [recienNacido, setRecienNacido] = useState(false);
  const [preñada, setPreñada] = useState(false);

  const handleSave = () => {
    console.log({
      tipo, lote, numeroCaravana, peso, edad, recienNacido, preñada
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ingresar Animal</Text>

      <Text style={styles.label}>Tipo</Text>
      <Picker
        selectedValue={tipo}
        style={styles.picker}
        onValueChange={(itemValue) => setTipo(itemValue)}
      >
        <Picker.Item label="Seleccione tipo" value="" />
        <Picker.Item label="Vaca" value="Vaca" />
        <Picker.Item label="Toro" value="Toro" />
      </Picker>


      <Text style={styles.label}>Lote</Text>
      <Picker
        selectedValue={lote}
        style={styles.picker}
        onValueChange={(itemValue) => setLote(itemValue)}
      >
        <Picker.Item label="Seleccione lote" value="" />
        <Picker.Item label="Lote 1" value="lote1" />
        <Picker.Item label="Lote 2" value="lote2" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Número de caravana"
        value={numeroCaravana}
        onChangeText={setNumeroCaravana}
      />

      <Text style={styles.subTitle}>Historial Médico</Text>

      <TextInput
        style={styles.input}
        placeholder="Peso"
        value={peso}
        onChangeText={setPeso}
      />

      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
      />

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setChecked(!isChecked)}
        >
          <View style={styles.box}>
            {isChecked && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
        <ThemedText style={styles.label}>Recién nacido</ThemedText>
      </View>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setChecked(!isChecked)}
        >
          <View style={styles.box}>
            {isChecked && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
        <ThemedText style={styles.label}>Preñada</ThemedText>
      </View>
      <TouchableOpacity style={styles.grayButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Agregar Tratamiento</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.greenButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AnimalForm;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 40,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    paddingLeft: 8,
  },
  greenButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    borderRadius: 40,
    marginTop: 20,
    width: 200,
  },
  grayButton: {
    backgroundColor: 'gray',
    padding: 10,
    alignItems: 'center',
    borderRadius: 40,
    marginTop: 10,
    width: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginLeft: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
});
