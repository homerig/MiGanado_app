import React,{useState} from 'react';
import { Pressable, StyleSheet, Platform, Alert, TouchableOpacity, Text,View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useNavigation } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChartColumn, faClipboardCheck, faCow, faFileMedical, faFlask, faMapLocationDot, faSyringe, faUser, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { Calendar } from 'react-native-calendars';

export default function HomeScreen() {  

  const navigation = useNavigation();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate] = useState(today);     

  return (       
    <ScrollView>   
      <ThemedView style={styles.container}>
                    
        <ThemedView style={styles.titleContainer}>
          <ThemedText style={styles.title}>¡Bienvenido, (Nombre)!</ThemedText>
        </ThemedView>

        <ThemedView style={styles.calendarContainer}>
          <Calendar
            style={styles.calendar}            
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#B43A3A' },
            }}
            theme={{
              selectedDayBackgroundColor: '#407157',
              todayTextColor: '#407157',
              arrowColor: '#407157',
            }}
          />
          <View style={styles.eventsContainer}>
            <Text style={styles.eventsTitle}>PRÓXIMOS EVENTOS</Text>
            <View style={styles.eventBox}></View>
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

          <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('lotes')}>                  
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
                <FontAwesomeIcon icon={faUserDoctor} size={32} color="#FFFFFF" style={styles.icon}/>
                <Text style={styles.buttonText}>Tacto</Text>
              </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}onPress={() => navigation.navigate('vistas/tratamientos')}>                  
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

      </ThemedView>
    </ScrollView>    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  link:{
    backgroundColor: '#390040',
  },
  calendarContainer:{
    width: '100%', // Ajusta el tamaño del contenedor del calendario
    //aspectRatio: 1, // Mantén la proporción cuadrada
    backgroundColor: '#fff', // Fondo blanco para el calendario
    borderRadius: 15, // Bordes redondeados
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  calendar: {
    borderRadius: 15,
    marginBottom: 16,
  },
  eventsContainer: {
    width : '100%', 
    padding: 16,   
    marginBottom: 5,
  },
  eventsTitle: {
    marginLeft : 10,
    width :'100%',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventBox: {
    width: '100%',
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  titleContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {    
    fontSize: 20,
    fontWeight: 'bold',
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
    width: '48%', // 48% para que haya margen entre los botones
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent:{
    flexDirection:'row',
    alignItems:'center',
    width:'100%'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    marginRight:10, // Espacio a la derecha del icono
  },
  splitTextContainer: {
    marginLeft: 10,
    textAlign: 'center',
  },
  splitTextTop: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20, // Altura de línea para separar el texto
  },
  splitTextBottom: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20, // Altura de línea para separar el texto
  },
  
});
