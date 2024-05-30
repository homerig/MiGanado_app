import { Image, StyleSheet, Platform } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFilter, } from '@fortawesome/free-solid-svg-icons';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Estadísticas</ThemedText>
            <FontAwesomeIcon icon={faFilter} size={24} color="#605856" />
          </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionItem}>
          <ThemedText type="default">Lote (X)</ThemedText>
          <ThemedText type="title">(X) Crías</ThemedText>
          <ThemedText type="subtitle">En el último mes</ThemedText>
        </ThemedView>
        <ThemedText style={styles.sectionHeader}>espacio</ThemedText>
      </ThemedView>


    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20
  },
  section: {
    // alignItems: 'center',
    justifyContent: 'space-between',
    margin: 16,
    marginTop: 5,
    gap: 16,
    borderRadius: 10,
    shadowColor: '#0000001A', // Color de la sombra
    shadowOpacity: 1, // Opacidad de la sombra (valor entre 0 y 1)
    shadowRadius: 10, // Radio de la sombra
    shadowOffset: {
      width: 0, // Desplazamiento horizontal
      height: 0, // Desplazamiento vertical
    },
    elevation: 4
  },
  sectionItem:{
    padding: 20,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  sectionHeader:{
    padding: 20,
    backgroundColor: '#407157',
    color: 'white',
    width: '100%',

  }
});