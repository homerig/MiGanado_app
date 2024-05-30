import { Image, StyleSheet, Platform } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPen, faEnvelope, faKey, faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>

      <ThemedView style={styles.titleContainer}>

        <ThemedView style={styles.container}>

          <Image source={require('@/assets/images/sinFotoPerfil.png')} style={styles.imagen}/>

          <ThemedView style={styles.icon}>
            <FontAwesomeIcon icon={faPen} size={22} color="#605856"/>
          </ThemedView>
          
        </ThemedView>

        <ThemedText type="title" style={styles.container}>Nombre y Apellido</ThemedText>
        
      </ThemedView>
      <ThemedView style={styles.section}>
        
        <ThemedText type="subtitle">Datos Personales</ThemedText>
        <ThemedText type="default"><FontAwesomeIcon icon={faEnvelope}  color="#605856"/>  ejemplo123@gmail.com</ThemedText>
        

      </ThemedView>
      <ThemedView style={styles.item}>
      <ThemedText type="default"><FontAwesomeIcon icon={faKey}  color="#605856"/>  Cambiar Contraseña</ThemedText>
        <ThemedText type="default"><FontAwesomeIcon icon={faArrowRightFromBracket}  color="#605856"/>  Cerrar Sesión</ThemedText>
      </ThemedView>
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  section: {
    // alignItems: 'center',
    justifyContent: 'space-between',
    margin: 16,
    padding: 20,
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
  imagen:{
    width: '100%',
    height: 150
  },
  icon:{
    backgroundColor: 'white',
    borderRadius: 99,
    padding: 12,
    margin: 14,
    shadowColor: '#00000026', // Color de la sombra
    shadowOpacity: 1, // Opacidad de la sombra (valor entre 0 y 1)
    shadowRadius: 5, // Radio de la sombra
    shadowOffset: {
      width: 0, // Desplazamiento horizontal
      height: 0, // Desplazamiento vertical
    },
    elevation: 4, // Solo para Android
    position:'absolute',
    bottom: 0,
    right: 0
  },
  item:{
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  }
});
