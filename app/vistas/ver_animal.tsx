import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Asegúrate de que la ruta es correcta
import { ThemedView } from '@/components/ThemedView'; // Asegúrate de que la ruta es correcta
import { faCow, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

export default function AnimalDetailScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>N° 367G</ThemedText>
          <View style={styles.headerIcons}>
            <TouchableOpacity>
            <View style={styles.buttonContent}>
                <FontAwesomeIcon icon={faPen} size={25} color="#000000" style={styles.icon} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.buttonContent}>
                <FontAwesomeIcon icon={faTrash} size={25} color="#000000" style={styles.icon} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <ThemedText style={styles.detail}>Edad: 2 años</ThemedText>
        <ThemedText style={styles.detail}>Lote: 1</ThemedText>
        <ThemedText style={styles.detail}>Raza: negra y blanca</ThemedText>
        <ThemedText style={styles.detail}>Preñada: No</ThemedText>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Vacunaciones</ThemedText>
            <TouchableOpacity>
              <Text style={styles.icon}>➕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContent}>
            <ThemedText>Próxima fecha: 28/05/2024</ThemedText>
            <ThemedText>Fecha finalización: 28/10/2024</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Peso</ThemedText>
            <TouchableOpacity>
              <Text style={styles.icon}>➕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContent}>
            <ThemedText>Actual: 403kg</ThemedText>
            <ThemedText>Promedio: 398kg</ThemedText>
            {/* Aquí deberías insertar el gráfico de peso */}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Tratamientos</ThemedText>
            <TouchableOpacity>
              <Text style={styles.icon}>➕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContent}>
            <ThemedText>Ningún tratamiento en curso</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Sangrado</ThemedText>
          </View>
          <View style={styles.sectionContent}>
            <ThemedText>N° tubo: 1827HFG</ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    padding: 10,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    fontSize: 24,
    marginLeft: 10,
  },
  detail: {
    fontSize: 18,
    marginBottom: 5,
  },
  section: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionContent: {
    paddingHorizontal: 10,
  },
});