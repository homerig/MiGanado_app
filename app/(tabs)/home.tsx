import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChartColumn, faClipboardCheck, faCow, faFileMedical, faFlask, faMapLocationDot, faSyringe, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { getUserNotificaciones } from '../../api/api';
import { UserContext } from '../../api/UserContext';

dayjs.locale('es');

// Configuración de LocaleConfig para react-native-calendars
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  monthNamesShort: [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ],
  dayNames: [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { userId, userName, fetchUserName } = useContext(UserContext);
  const [notificaciones, setNotificaciones] = useState([]);
  const [filteredNotificaciones, setFilteredNotificaciones] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().toDate());
  const [markedDates, setMarkedDates] = useState({});
  const [activeDotIndex, setActiveDotIndex] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchUserName(userId);
    }

    const fetchNotificaciones = async () => {
      try {
        const data = await getUserNotificaciones(userId);
        setNotificaciones(data);

        // Crear un objeto para marcar las fechas con notificaciones
        const marked = {};
        data.forEach(notificacion => {
          const notificacionDate = dayjs(notificacion.fecha).add(1, 'day');
          const notificacionDateStr = notificacionDate.format('YYYY-MM-DD');

          console.log(notificacionDate);
          console.log(notificacionDateStr);

          marked[notificacionDateStr] = { 
            selected: true,
            selectedColor: '#d3d3d3',
            // Opcional: añadir un borde gris alrededor del número del día
            customStyles: {
              container: {
                borderWidth: 1,
                borderColor: '#d3d3d3',
                borderRadius: 5,
              },
              text: {
                color: '#000', // Color del número del día
              },
            },
          };
        });

        // Marcar también el día actual
        const today = dayjs().format('YYYY-MM-DD');
        marked[today] = {
          selected: true,
          selectedColor: '#B43A3A'
        };

        // Actualizar el estado de markedDates con las fechas marcadas
        setMarkedDates(marked);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (userId) {
      fetchNotificaciones();
    }
  }, [userId]);

  useEffect(() => {
    const filterNotificaciones = () => {
      const selectedDateStr = dayjs(selectedDate).format('YYYY-MM-DD');
      const filtered = notificaciones.filter((notificacion) => {
        const notificacionDateStr = dayjs(notificacion.fecha).format('YYYY-MM-DD');
        return notificacionDateStr === selectedDateStr;
      });
      setFilteredNotificaciones(filtered);
    };

    filterNotificaciones();
  }, [selectedDate, notificaciones]);

  const handleDayPress = (day) => {
    const newMarkedDates = { ...markedDates };

    // Deseleccionar días que no tienen notificaciones
    Object.keys(newMarkedDates).forEach(date => {
      if (!newMarkedDates[date].hasOwnProperty('customStyles')) {
        newMarkedDates[date] = { ...newMarkedDates[date], selected: false };
      }
    });

    Object.keys(newMarkedDates).forEach(date => {
      if (newMarkedDates[date].hasOwnProperty('customStyles')) {
        newMarkedDates[date] = { ...newMarkedDates[date], selected: true, selectedColor: '#d3d3d3',};
      }
    });
    // Marcar el día seleccionado
    newMarkedDates[day.dateString] = {
      ...newMarkedDates[day.dateString],
      selected: true,
      selectedColor: '#B43A3A'
    };

    setMarkedDates(newMarkedDates);
    setSelectedDate(new Date(day.dateString));
  };

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.round(contentOffset.x / event.nativeEvent.layoutMeasurement.width);
    setActiveDotIndex(index);
  };

  return (
    
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title}>¡Bienvenido, {userName}!</ThemedText>
        </ThemedView>

        <ScrollView>

        
        <ThemedView style={styles.calendarContainer}>
          <Calendar
            style={styles.calendar}
            markedDates={markedDates}
            onDayPress={handleDayPress}
            monthFormat={'MMMM yyyy'}
            theme={{
              selectedDayBackgroundColor: '#407157',
              todayTextColor: '#629479',
              arrowColor: '#407157',
            }}
          />
          <View style={styles.eventsContainer}>
            <ThemedText type="subtitle" style={styles.eventsTitle}>Eventos del día</ThemedText>
            {filteredNotificaciones.length > 0 ? (
              <ScrollView 
                horizontal 
                pagingEnabled 
                onScroll={handleScroll}
                showsHorizontalScrollIndicator={false}
                style={styles.eventScrollView}
              >
                {filteredNotificaciones.map((event, index) => (
                  <View key={event.id} style={styles.eventBox}>
                    <Text style={styles.eventDescription}>{event.mensaje}</Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.noEventsText}>No hay eventos para este día</Text>
            )}
            <View style={styles.dotContainer}>
              {filteredNotificaciones.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.dot, 
                    activeDotIndex === index ? styles.activeDot : styles.inactiveDot
                  ]} 
                />
              ))}
            </View>
          </View>
        </ThemedView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('vistas/buscar_animal')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faCow} size={32} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.buttonText}>Mis Animales</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('vistas/IngresoAnimal')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faClipboardCheck} size={32} color="#FFFFFF" style={styles.icon} />
              <View style={styles.splitTextContainer}>
                <Text style={styles.splitTextTop}>Ingresar</Text>
                <Text style={styles.splitTextBottom}>Animales</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('vistas/sangrado')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faFlask} size={32} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.buttonText}>Sangrado</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('lotes')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faMapLocationDot} size={32} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.buttonText}>Lotes</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('vistas/vacunacion')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faSyringe} size={32} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.buttonText}>Vacunacion</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('vistas/tacto')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faUserDoctor} size={32} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.buttonText}>Tacto</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('vistas/tratamientos')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faFileMedical} size={32} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.buttonText}>Tratamiento</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('estadisticas')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faChartColumn} size={32} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.buttonText}>Estadistica</Text>
            </View>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  calendarContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  calendar: {
    borderRadius: 15,
  },
  eventsContainer: {
    width: '100%',
    padding: 16,
    marginBottom: 5,
  },
  eventsTitle: {
    marginLeft: 5,
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventScrollView: {
    flexDirection: 'row',
  },
  eventBox: {
    width: 300,
    padding: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
  },
  noEventsText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#999',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#707070',
  },
  inactiveDot: {
    backgroundColor: '#d3d3d3',
  },
  titleContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
    padding: 5,
  },
  title: {
    paddingVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#407157',
    padding: 10,
    borderRadius: 15,
    height: 70,
    width: '48%',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    margin: 10,
  },
  splitTextContainer: {
    marginLeft: 10,
    textAlign: 'center',
  },
  splitTextTop: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  splitTextBottom: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
});
