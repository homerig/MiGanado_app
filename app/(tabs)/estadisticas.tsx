import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Dimensions, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { UserContext } from '../../api/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { buscarAnimalLote } from '../../api/api';

const ErrorIcon = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.errorIcon}>
    <FontAwesomeIcon icon={faTimesCircle} size={24} color="#d44648" />
  </TouchableOpacity>
);

type StatisticsCardProps = {
  title: string;
  value: string;
  subTitle: string;
  children?: React.ReactNode;
};

const StatisticsCard: React.FC<StatisticsCardProps> = ({ title, value, subTitle, children }) => {
  return (
    <ThemedView style={styles.card}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.value}>{value}</ThemedText>
      <ThemedText style={styles.subTitle}>{subTitle}</ThemedText>
      {children}
    </ThemedView>
  );
};

const EstadisticasScreen = () => {
  const [numero_lote, setNumeroLote] = useState('');
  const [numero_loteError, setNumeroLoteError] = useState(false);
  const [animalesEncontrado, setAnimalesEncontrado] = useState(null);
  const { userId } = useContext(UserContext);
  const [porcentajePrenez, setPorcentajePrenez] = useState(0);
  const [cantidadCrias, setCantidadCrias] = useState(0);

  useEffect(() => {
    if (animalesEncontrado && animalesEncontrado.length > 0) {
      const vacasTotales = animalesEncontrado.length;
      const vacasPrenez = animalesEncontrado.filter(animal => animal.preniada).length;
      const porcentajePrenez = (vacasPrenez / vacasTotales) * 100;
      setPorcentajePrenez(porcentajePrenez);

      const criasRecienNacidas = animalesEncontrado.filter(animal => animal.reciennacida).length;
      setCantidadCrias(criasRecienNacidas);
    } else {
      setPorcentajePrenez(0);
      setCantidadCrias(0);
    }
  }, [animalesEncontrado]);

  const buscar = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      const animales = await buscarAnimalLote(userId, numero_lote);

      if (Array.isArray(animales) && animales.length > 0) {
        setAnimalesEncontrado(animales);
        
      } else {
        setAnimalesEncontrado(null);
        Alert.alert('Animales no encontrados', 'No se encontraron animales con ese número de lote. Inténtelo de nuevo.', [
          { text: 'OK', onPress: () => setNumeroLote('') }
        ]);
      }
    } catch (error) {
      console.error('Error al buscar animales:', error);
      Alert.alert('Error', 'Hubo un error al buscar los animales. Por favor, inténtelo de nuevo.');
    }
  };

  const resetForm = () => {
    setNumeroLote('');
    setAnimalesEncontrado(null);
  };

  const calcularPromedioPeso = () => {
    if (!animalesEncontrado || animalesEncontrado.length === 0) {
      return 'Sin datos';
    }

    const pesos = animalesEncontrado.map(animal => animal.peso);
    const sumaPesos = pesos.reduce((acc, peso) => acc + peso, 0);
    const promedio = sumaPesos / animalesEncontrado.length;
    return `${promedio.toFixed(2)} kg`;
  };

  const pieChartDataPrenez = [
    { name: "Preñadas", population: porcentajePrenez, color: "#407157", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "No preñadas", population: 100 - porcentajePrenez, color: "#e0e0e0", legendFontColor: "#7F7F7F", legendFontSize: 15 }
  ];

  const barChartData2 = {
    labels: animalesEncontrado ? animalesEncontrado.map((_, index) => `${index + 1}`) : [],
    datasets: [
      {
        data: animalesEncontrado ? animalesEncontrado.map(animal => animal.peso) : []
      }
    ]
  };

  const pieChartDataCrias = [
    { name: "Recién Nacidas", population: cantidadCrias, color: "#407157", legendFontColor: "#7F7F7F", legendFontSize: 15 },
    { name: "No Recién Nacidas", population: animalesEncontrado ? animalesEncontrado.length - cantidadCrias : 0, color: "#e0e0e0", legendFontColor: "#7F7F7F", legendFontSize: 15 }
  ];

  const validateFields = () => {
    let isValid = true;
    if (!numero_lote) {
      setNumeroLoteError(true);
      isValid = false;
    } else {
      setNumeroLoteError(false);
    }
    return isValid;
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Estadísticas</ThemedText>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, numero_loteError && styles.errorInput]}
            placeholder="Ingrese Lote"
            value={numero_lote}
            onChangeText={setNumeroLote}
          />
          {numero_loteError && <ErrorIcon onPress={() => Alert.alert('Error', 'El campo Lote no puede estar vacío')} />}
        </View>
        <TouchableOpacity style={styles.button} onPress={buscar}>
          <ThemedText style={styles.buttonText}>Buscar</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <StatisticsCard title={`${cantidadCrias} crías`} value="En el último mes" subTitle="Cantidad de Crías Recién Nacidas">
        <PieChart
          data={pieChartDataCrias}
          width={Dimensions.get("window").width - 70}
          height={220}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          style={styles.chartStyle}
        />
      </StatisticsCard>

      <StatisticsCard title={`${porcentajePrenez.toFixed(2)}%`} value="En el último mes" subTitle="Tasa de Preñez">
        <PieChart
          data={pieChartDataPrenez}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          style={styles.chartStyle}
        />
      </StatisticsCard>

      <StatisticsCard title={calcularPromedioPeso()} value="Promedio de peso" subTitle="del lote">
        <BarChart
          data={barChartData2}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          yAxisLabel=""
          yAxisSuffix=" kg"
          fromZero={true}
          style={styles.chartStyle}
        />
      </StatisticsCard>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: "#407157",
  backgroundGradientFrom: "#407157",
  backgroundGradientTo: "#407157",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726"
  },
  propsForBackgroundLines: {
    strokeDasharray: "",
  },
  yAxisInterval: 1,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  errorInput: {
    borderColor: '#d44648',
  },
  button: {
    backgroundColor: '#407157',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    margin: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: '#7F7F7F',
    marginBottom: 10,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  errorIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
});

export default EstadisticasScreen;
