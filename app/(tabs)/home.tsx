import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Platform, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChartColumn, faClipboardCheck, faCow, faFileMedical, faFlask, faPlus,faMapLocationDot, faSyringe, faUserDoctor } from '@fortawesome/free-solid-svg-icons';

import { Calendar, LocaleConfig } from 'react-native-calendars';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { getUserNotificaciones, createNotificacion } from '../../api/api';
import { UserContext } from '../../api/UserContext';
import DateTimePicker from '@react-native-community/datetimepicker';

import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Notification = {
  id?: number;
  tipo: string;
  mensaje: string;
  fecha: string | Date;
};

type MarkedDateMap = Record<string, {
  selected?: boolean;
  selectedColor?: string;
  customStyles?: {
    container?: {
      borderWidth?: number;
      borderColor?: string;
      borderRadius?: number;
    };
    text?: {
      color?: string;
    };
  };
}>;

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

const getNotificationDate = (fecha: string | Date) => {
  const fechaNotificacion = dayjs(fecha).startOf('day');
  let notificacionDate = dayjs(fecha).format('YYYY-MM-DD');

  if (fechaNotificacion.format("YYYY-MM-DD'T'HH:mm:ss'Z'") === dayjs(fecha).format("YYYY-MM-DD'T'HH:mm:ss'Z'")) {
    notificacionDate = dayjs(fecha).startOf('day').add(-1, 'day').format('YYYY-MM-DD');
  }

  return notificacionDate;
};

const parseLocalDateString = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const buildMarkedDates = (notifications: Notification[], selectedDate: Date): MarkedDateMap => {
  const marked: MarkedDateMap = {};

  notifications.forEach((notificacion: Notification) => {
    const notificacionDate = getNotificationDate(notificacion.fecha);
    marked[notificacionDate] = {
      selected: true,
      selectedColor: '#d3d3d3',
      customStyles: {
        container: {
          borderWidth: 1,
          borderColor: '#d3d3d3',
          borderRadius: 5,
        },
        text: {
          color: '#000',
        },
      },
    };
  });

  const selectedDateKey = dayjs(selectedDate).format('YYYY-MM-DD');
  marked[selectedDateKey] = {
    ...marked[selectedDateKey],
    selected: true,
    selectedColor: '#B43A3A',
  };

  return marked;
};

export default function HomeScreen() {
  const router = useRouter();
  const { userId, userName, fetchUserName } = useContext(UserContext);
  const [notificaciones, setNotificaciones] = useState<Notification[]>([]);
  const [filteredNotificaciones, setFilteredNotificaciones] = useState<Notification[]>([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().toDate());
  const [markedDates, setMarkedDates] = useState<MarkedDateMap>({});
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevaNotificacion, setNuevaNotificacion] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showOptions, setShowOptions] = useState(false);
  const [tipoNotificacion, setTipoNotificacion] = useState('Seleccione una opción');

  const fetchNotificaciones = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      const data = await getUserNotificaciones(userId);
      setNotificaciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [userId]);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const selectOption = (tipo: string) => {
    setTipoNotificacion(tipo);
    setShowOptions(false);
  };

  useEffect(() => {
    if (userId) {
      fetchUserName(userId);
    }

    if (userId) {
      fetchNotificaciones();
    }
  }, [userId, fetchNotificaciones, fetchUserName]);

  useFocusEffect(
    useCallback(() => {
      fetchNotificaciones();
    }, [fetchNotificaciones])
  );

  useEffect(() => {
    const filterNotificaciones = () => {
      const selectedDateStr = dayjs(selectedDate).format('YYYY-MM-DD');
      const filtered = notificaciones.filter((notificacion: Notification) => {
        return getNotificationDate(notificacion.fecha) === selectedDateStr;
      });
      setFilteredNotificaciones(filtered);
    };

    filterNotificaciones();
  }, [selectedDate, notificaciones]);

  useEffect(() => {
    setMarkedDates(buildMarkedDates(notificaciones, selectedDate));
  }, [notificaciones, selectedDate]);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(parseLocalDateString(day.dateString));
  };

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const index = Math.round(contentOffset.x / event.nativeEvent.layoutMeasurement.width);
    setActiveDotIndex(index);
  };

  const openCreateEventModal = () => {
    setShowDatePicker(false);
    setModalVisible(true);
  };

  const closeCreateEventModal = () => {
    setShowDatePicker(false);
    setModalVisible(false);
  };

  const agregarNotificacion = async () => {
    if (!nuevaNotificacion.trim()) {
      Alert.alert('Error', 'Ingresá una descripción para el evento.');
      return;
    }

    if (tipoNotificacion === 'Seleccione una opción') {
      Alert.alert('Error', 'Seleccioná un tipo de evento.');
      return;
    }

    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate());
    const utcDate = new Date(Date.UTC(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate(), 0, 0, 0));

    try {
      const notificacion = await createNotificacion(userId, tipoNotificacion, nuevaNotificacion, utcDate);
      if (notificacion) {
        setNotificaciones((prevNotificaciones) => [...prevNotificaciones, notificacion]);
      }
      setNuevaNotificacion('');
      setTipoNotificacion('Seleccione una opción');
      closeCreateEventModal();
    } catch (error) {
      console.error('Error creating notification:', error);
      Alert.alert('Error', 'No se pudo crear el evento.');
    }
  };

  const onChangeFecha = (_event: unknown, nextSelectedDate?: Date) => {
    if (nextSelectedDate) {
      setSelectedDate(nextSelectedDate);
    }

    if (Platform.OS !== 'ios') {
      setShowDatePicker(false);
    }
  };

  const opcionesEvento = [
    {title: 'Lote'},
    {title: 'Tratamiento'},
    {title: 'Tacto'},
    {title: 'Vacunación'},
    {title: 'Sangrado'},
  ];

  return (
    <View style={styles.containerColor}>
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
            renderArrow={(direction) => (
              <View style={styles.calendarArrow}>
                <Text style={styles.calendarArrowText}>{direction === 'left' ? '<' : '>'}</Text>
              </View>
            )}
            theme={{
              selectedDayBackgroundColor: '#407157',
              todayTextColor: '#629479',
              arrowColor: '#407157',
              monthTextColor: '#1E3428',
              textMonthFontWeight: '700',
            }}
          />
          <View style={styles.eventsContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '82%'}}>
              <ThemedText type="subtitle" style={styles.eventsTitle}>Eventos del día</ThemedText>
              <TouchableOpacity onPress={openCreateEventModal} style={styles.agregarNotificacionButton}>
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
                  <View key={event.id ?? `${event.mensaje}-${event.fecha}-${index}`} style={styles.eventBox}>
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
          onRequestClose={closeCreateEventModal}
        >
          <View style={styles.modalBackground}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ThemedText type='subtitle' style={styles.modalTitle}>Crear un nuevo evento o recordatorio</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Descripción del evento"
                placeholderTextColor='#151E26'
                onChangeText={text => setNuevaNotificacion(text)}
                value={nuevaNotificacion}
              />
              
              <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker((prev) => !prev)}>
                <Text style={styles.datePickerLabel}>Fecha</Text>
                <Text style={styles.datePickerValue}>{dayjs(selectedDate).format('DD/MM/YYYY')}</Text>
              </TouchableOpacity>

              {showDatePicker && (
                <View style={styles.datePickerContainer}>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onChangeFecha}
                    style={styles.picker}
                  />
                </View>
              )}
            
              <View>
              <SelectDropdown
                  data={opcionesEvento}
                  onSelect={(selectedItem) => {
                    selectOption(selectedItem.title);
                  }}
                  renderButton={(selectedItem, isOpened) => {
                    return (
                      <View style={styles.dropdownButtonStyle}>
                        {selectedItem && (
                          <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
                        )}
                        <Text style={styles.dropdownButtonTxtStyle}>
                          {(selectedItem && selectedItem.title) || 'Tipo de evento'}
                        </Text>
                        <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                      </View>
                    );
                  }}
                  renderItem={(item, index, isSelected) => {
                    return (
                      <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                        <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                      </View>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  dropdownStyle={styles.dropdownMenuStyle}
                />
              </View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity  style={styles.modalButtonCancel} onPress={closeCreateEventModal}> 
                <ThemedText style={styles.modalButtonText}>Cancelar</ThemedText> 
                </TouchableOpacity>

                <TouchableOpacity  style={styles.modalButton} onPress={agregarNotificacion}> 
                <ThemedText style={styles.modalButtonText}>Agregar</ThemedText> 
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </View>
          
        </Modal>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/vistas/buscar_animal')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faCow} size={32} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.buttonText}>Mis Animales</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/vistas/IngresoAnimal')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faClipboardCheck} size={32} color="#FFFFFF" style={styles.icon} />
              <View style={styles.splitTextContainer}>
                <Text style={styles.splitTextTop}>Ingresar</Text>
                <Text style={styles.splitTextBottom}>Animales</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.navigate('/estadisticas')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faChartColumn} size={32} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.buttonText}>Estadísticas</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.navigate('/lotes')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faMapLocationDot} size={32} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.buttonText}>Lotes</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/vistas/vacunacion')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faSyringe} size={32} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.buttonText}>Vacunación</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/vistas/sangrado')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faFlask} size={32} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.buttonText}>Sangrado</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/vistas/tacto')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faUserDoctor} size={32} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.buttonText}>Tacto</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push('/vistas/tratamientos')}>
            <View style={styles.buttonContent}>
              <FontAwesomeIcon icon={faFileMedical} size={32} color="#FFFFFF" style={styles.icon} />
              <Text style={styles.buttonText}>Tratamiento</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{height: 25}}></View>
      </ScrollView>
    </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerColor:{
    flex: 1,
    backgroundColor: '#407157',
  },
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
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
  calendarArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E7F0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarArrowText: {
    color: '#407157',
    fontSize: 18,
    fontWeight: '700',
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
    borderRadius: 99,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 45,
    marginBottom: 20,
    paddingHorizontal: 20,
    width: 300,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    color: '#151E26',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '15%',
    width: '60%',
  },
  modalButton: {
    backgroundColor: '#407157',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#bdbdbd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
    marginBottom: 20,
    paddingHorizontal: 20,
    width: 300,
    minHeight: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    justifyContent: 'center',
  },
  datePickerLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  datePickerValue: {
    fontSize: 16,
    color: '#151E26',
    fontWeight: '500',
  },
  datePickerContainer: {
    width: 300,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    marginTop: -10,
    marginBottom: 20,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  picker: {
    width: '100%',
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
    width: 300,
  },
  options: {
    width: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  option: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    
  },
  dropdownButtonStyle: {
    width: 300,
    height: 45,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#151E26',
  },
});
