import React from 'react';
import { StyleSheet, ScrollView, View, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Picker } from '@react-native-picker/picker';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { getUserLotes } from '@/api/api';

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
  const [selectedLote, setSelectedLote] = React.useState<string>('');
  const [lotes, setLotes] = React.useState<{ id: string; name: string }[]>([]);
  const [userId, setUserId] = React.useState<string>(''); // Suponiendo que tienes el userId disponible

  // Simulación de datos calculados
  const natalidad = "60 crías";
  const preñez = "70%";
  const promedioPeso = "300 kg";

  // Simulación de datos de gráficos
  const barChartData1 = {
    labels: ["Ene", "Feb", "Mar", "Abr"],
    datasets: [
      {
        data: [5, 10, 15, 20]
      }
    ]
  };

  const barChartData2 = {
    labels: ["May", "Jun", "Jul", "Ago"],
    datasets: [
      {
        data: [10, 15, 20, 25]
      }
    ]
  };

  const pieChartData = [
    { name: "Crías", population: 60, color: "#407157", legendFontColor: "#7F7F7F", legendFontSize: 15 }
  ];

  React.useEffect(() => {
    const fetchLotes = async () => {
      try {
        const lotesData = await getUserLotes(userId);
        setLotes(lotesData);
        if (lotesData.length > 0) {
          setSelectedLote(lotesData[0].id);
        }
      } catch (error) {
        console.error('Error fetching lotes:', error);
      }
    };

    fetchLotes();
  }, [userId]);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Estadísticas</ThemedText>
        <Picker
          selectedValue={selectedLote}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedLote(itemValue)}
        >
          {lotes.map((lote) => (
            <Picker.Item key={lote.id} label={lote.name} value={lote.id} />
          ))}
        </Picker>
      </ThemedView>
      
      <StatisticsCard title={natalidad} value="En el último mes" subTitle="Tasa de Natalidad">
        <BarChart
          data={barChartData1}
          width={Dimensions.get("window").width - 40}  // Ajuste de ancho
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          yAxisLabel=""
          yAxisSuffix=" vacas"
          fromZero={true}
          style={styles.chartStyle}  // Nuevo estilo agregado
        />
      </StatisticsCard>
      
      <StatisticsCard title={preñez} value="En el último mes" subTitle="Tasa de Preñez">
        <BarChart
          data={barChartData2}
          width={Dimensions.get("window").width - 40}  // Ajuste de ancho
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          yAxisLabel=""
          yAxisSuffix=" vacas"
          fromZero={true}
          style={styles.chartStyle}  // Nuevo estilo agregado
        />
      </StatisticsCard>
      
      <StatisticsCard title={promedioPeso} value="Promedio de peso" subTitle="del lote">
        <PieChart
          data={pieChartData}
          width={Dimensions.get("window").width - 40}  // Ajuste de ancho
          height={220}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          style={styles.chartStyle}  // Nuevo estilo agregado
        />
      </StatisticsCard>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: "#407157",
  backgroundGradientFrom: "#407157",
  backgroundGradientTo: "#407157",
  decimalPlaces: 0,  // Cambiado a 0 para evitar decimales
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
    strokeDasharray: "", // solid background lines with no dashes
  },
  yAxisInterval: 1,  // Intervalo de 1 en el eje Y
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
  picker: {
    height: 50,
    width: 150,
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
  chartContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16
  }
});

export default EstadisticasScreen;
