// EstadisticasScreen.js
import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const StatisticsCard = ({ title, value, subTitle }: { title: string, value: string, subTitle: string }) => {
  return (
    <ThemedView style={styles.card}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.value}>{value}</ThemedText>
      <ThemedText style={styles.subTitle}>{subTitle}</ThemedText>
    </ThemedView>
  );
};

const EstadisticasScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Estadísticas</ThemedText>
        <ThemedText style={styles.lote}>Lote X</ThemedText>
      </ThemedView>
      
      <StatisticsCard title="60 crías" value="En el último mes" subTitle="Tasa de Natalidad" />
      <StatisticsCard title="30 decesos" value="En el último mes" subTitle="Tasa de Mortalidad" />
      <StatisticsCard title="60 crías" value="El último mes" subTitle="Tasa de Preñez" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  lote: {
    fontSize: 16,
    color: '#888',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  subTitle: {
    fontSize: 14,
    color: '#00a680',
    marginTop: 10,
  },
});

export default EstadisticasScreen;
