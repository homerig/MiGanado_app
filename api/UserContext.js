import React, { createContext, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import { baseURL } from '../api/api'; // Asegúrate de poner la ruta correcta

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userId, setUserIdState] = useState(null);
  const [userName, setUserName] = useState('');

  // Función para obtener el nombre del usuario
  const fetchUserName = async (id) => {
    try {
      const response = await axios.get(`${baseURL}/usuarios/${id}/`);
      setUserName(response.data.nombre);
    } catch (error) {
      console.error('Error fetching user name:', error.message);
    }
  };

  // Función para guardar el userId en AsyncStorage y en el estado
  const saveUserId = async (id) => {
    try {
      await AsyncStorage.setItem('userId', id.toString()); // Guarda el userId en AsyncStorage
      setUserIdState(id); // Actualiza el estado local con el userId
      await fetchUserName(id); // Opcional: Cargar el nombre del usuario después de guardar el ID
    } catch (error) {
      console.error('Error saving userId to AsyncStorage:', error.message);
    }
  };

  return (
    <UserContext.Provider value={{ userId, setUserId: saveUserId, userName, fetchUserName }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
