import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChartColumn, faClipboardCheck, faCow, faFileMedical, faFlask, faPlus,faMapLocationDot, faSyringe, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { getUserNotificaciones, createNotificacion } from '../../api/api';
import { UserContext } from '../../api/UserContext';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaNotificacion, setNuevaNotificacion] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showOptions, setShowOptions] = useState(false);
  const [tipoNotificacion, setTipoNotificacion] = useState('Seleccione una opción');

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const selectOption = (tipo) => {
    setTipoNotificacion(tipo);
    setShowOptions(false);
  };

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
        newMarkedDates[date] = { ...newMarkedDates[date], selected: true, selectedColor: '#d3d3d3' };
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

  const agregarNotificacion = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate());
    const utcDate = new Date(Date.UTC(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate(), 0, 0, 0));
    const notificacion = createNotificacion(userId, tipoNotificacion, nuevaNotificacion, utcDate );
    setNotificaciones([...notificaciones, notificacion]);
    setNuevaNotificacion('');
    setTipoNotificacion('Seleccione una opción'); // Reiniciar el tipo de notificación
    setModalVisible(false);
  };

  const onChangeFecha = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>¡Bienvenido, {userName}!</ThemedText>
      </ThemedView>

      <ScrollView style={styles.scrollContainer}>
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
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '82%'}}>
              <ThemedText type="subtitle" style={styles.eventsTitle}>Eventos del día</ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.agregarNotificacionButton}>
                <FontAwesomeIcon icon={faPlus} size={16} color="#6e6e6e" style={styles.icon} />
              </TouchableOpacity>
            </View>
            
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

        {/* Modal para agregar notificación */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalBackground}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ThemedText type='subtitle' style={styles.modalTitle}>Crear un nuevo evento o recordatorio</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Ingrese la descripción del evento"
                onChangeText={text => setNuevaNotificacion(text)}
                value={nuevaNotificacion}
              />
              
              <TouchableOpacity style={styles.datePickerButton}>
                <Text>Fecha: <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="compact"
                  onChange={onChangeFecha}
                /></Text>
              </TouchableOpacity>
              
                
              
              <View >
                <TouchableOpacity style={styles.select} onPress={toggleOptions}>
                  <Text>{'Tipo de evento: '+tipoNotificacion || 'Tipo de evento: Selecciona una opción'}</Text>
                </TouchableOpacity>
                {showOptions && (
                  <View style={styles.options}>
                    <TouchableOpacity style={styles.option} onPress={() => selectOption('Lote')}>
                      <Text>Lote</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option} onPress={() => selectOption('Tratamiento')}>
                      <Text>Tratamiento</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option} onPress={() => selectOption('Tacto')}>
                      <Text>Tacto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option} onPress={() => selectOption('Vacunación')}>
                      <Text>Vacunación</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option} onPress={() => selectOption('Sangrado')}>
                      <Text>Sangrado</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={styles.modalButtonContainer}>
                <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                <Button title="Agregar" onPress={agregarNotificacion} />
              </View>
            </View>
          </View>
          </View>
          
        </Modal>

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

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('estadisticas')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faChartColumn} size={32} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.buttonText}>Estadísticas</Text>
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
              <Text style={styles.buttonText}>Vacunación</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('vistas/sangrado')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faFlask} size={32} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.buttonText}>Sangrado</Text>
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
        </View>
        <View style={{height: 25}}></View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 0,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    
  },
  scrollContainer: {
    padding: 20,
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
    marginBottom: 0,
    paddingTop: 20,
    paddingHorizontal: 20,
    flexDirection: 'row', // Para alinear el botón junto al título
    justifyContent: 'space-between', // Para espacio entre título y botón
  },
  title: {
    paddingVertical: 5,
  },
  agregarNotificacionButton: {
    padding: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
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
    marginRight: 5,
    marginLeft: 10,
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
  datePickerButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    minWidth: 200,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro con transparencia
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  select: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 200,
  },
  options: {
    width: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    
  },
});
