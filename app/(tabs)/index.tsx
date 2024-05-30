import React from 'react';
import { Image, StyleSheet, Platform, Alert, TouchableOpacity, Text,View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChartColumn, faClipboardCheck, faCoffee, faCow, faFileMedical, faFlask, faMapLocationDot, faSyringe, faUser, faUserDoctor } from '@fortawesome/free-solid-svg-icons';

export default function HomeScreen() {
  return (

    

    
    <ThemedView style={styles.container}>
      
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.title}>¡Bienvenido, (Nombre)!</ThemedText>
      </ThemedView>

      <View style={styles.buttonContainer}>

        <TouchableOpacity style={styles.button}onPress={() => Alert.alert('Botón personalizado presionado')}>
          <View style={styles.buttonContent}>
            <FontAwesomeIcon icon={faCow} size={32} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.buttonText}>Mis Animales</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}onPress={() => Alert.alert('Botón personalizado presionado')}>          
          <View style={styles.buttonContent}>
            <FontAwesomeIcon icon={faClipboardCheck} size={32} color="#FFFFFF" style={styles.icon} />
            <View style={styles.splitTextContainer}>
              <Text style={styles.splitTextTop}>Ingresar</Text>
              <Text style={styles.splitTextBottom}>Animales</Text>
            </View>
          </View>
        </TouchableOpacity>
            
        <TouchableOpacity style={styles.button}onPress={() => Alert.alert('Botón personalizado presionado')}>          
          <View style={styles.buttonContent}>
            <FontAwesomeIcon icon={faFlask} size={32} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.buttonText}>Sangrado</Text>
          </View>          
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}onPress={() => Alert.alert('Botón personalizado presionado')}>          
          <View style={styles.buttonContent}>
            <FontAwesomeIcon icon={faMapLocationDot} size={32} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.buttonText}>Lotes</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}onPress={() => Alert.alert('Botón personalizado presionado')}>          
          <View style={styles.buttonContent}>
            <FontAwesomeIcon icon={faSyringe} size={32} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.buttonText}>Vacunacion</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}onPress={() => Alert.alert('Botón personalizado presionado')}>          
          <View style={styles.buttonContent}>
            <FontAwesomeIcon icon={faUserDoctor} size={32} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.buttonText}>Tacto</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}onPress={() => Alert.alert('Botón personalizado presionado')}>                  
          <View style={styles.buttonContent}>
            <FontAwesomeIcon icon={faFileMedical} size={32} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.buttonText}>Tratamiento</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}onPress={() => Alert.alert('Botón personalizado presionado')}>         
          <View style={styles.buttonContent}>
            <FontAwesomeIcon icon={faChartColumn} size={32} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.buttonText}>Estadistica</Text>
          </View>
        </TouchableOpacity>
      
      </View>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    //fontFamily:'./assets/fonts/Jost-ExtraLight.ttf',
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
