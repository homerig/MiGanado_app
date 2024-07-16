import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

const baseURL = 'http://192.168.0.226:8000/miGanado'; // Ajusta la URL a la de tu servidor

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userCampo, setUserCampo] = useState('');

  // Función para obtener el nombre del usuario
  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`${baseURL}/usuarios/${id}/`);
      setUserName(response.data.nombre);
      setUserEmail(response.data.correo_electronico);
      setUserCampo(response.data.nombre_campo);
      let data = response.data;
      console.log(data);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  };

  

  // Función para guardar el userId en AsyncStorage
  const saveUserId = async (id) => {
    try {
      await AsyncStorage.setItem('userId', id.toString());
      setUserId(id);
      fetchUserData(id);
    } catch (error) {
      console.error('Error al guardar el userId:', error);
    }
  };

  // Cargar userId desde AsyncStorage al iniciar
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(Number(id));
          fetchUserData(Number(id));
        }
      } catch (error) {
        console.error('Error al cargar el userId:', error);
      }
    };

    loadUserId();
  }, []);

  // Proporcionar los datos del usuario y las funciones a los componentes hijos
  return (
    <UserContext.Provider
      value={{
        userId,
        userName,
        userEmail,
        userCampo,
        fetchUserData,
        saveUserId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
