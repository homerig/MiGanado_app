import React, { createContext, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import { baseURL } from '../api/api'; // Asegúrate de poner la ruta correcta

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userId, setUserIdState] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Función para obtener el nombre del usuario
  const fetchUserName = async (id) => {
    try {
      const response = await axios.get(`${baseURL}/usuarios/${id}/`);
      setUserName(response.data.nombre);
    } catch (error) {
      console.error('Error fetching user name:', error.message);
    }
  };

  // Función para obtener el correo electrónico del usuario
  const fetchUserEmail = async (id) => {
    try {
      const response = await axios.get(`${baseURL}/usuarios/${id}/`);
      setUserEmail(response.data.correo_electronico);
    } catch (error) {
      console.error('Error fetching user email:', error.message);
    }
  };

  // Función para guardar el userId en AsyncStorage y en el estado
  const saveUserId = async (id) => {
    try {
      await AsyncStorage.setItem('userId', id.toString()); // Guarda el userId en AsyncStorage
      setUserIdState(id); // Actualiza el estado local con el userId
      await fetchUserName(id); // Opcional: Cargar el nombre del usuario después de guardar el ID
      await fetchUserEmail(id); // Cargar el correo electrónico del usuario después de guardar el ID
    } catch (error) {
      console.error('Error saving userId to AsyncStorage:', error.message);
    }
  };

  return (
    <UserContext.Provider value={{ userId, setUserId: saveUserId, userName, userEmail, fetchUserName, fetchUserEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
