import axios from 'axios';

const baseURL = 'http://192.168.0.182:8000/miGanado'; // Ajusta la URL a la de tu servidor

const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${baseURL}/usuarios/`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al registrar el usuario:', error.response.data);
    } else {
      console.error('Error al registrar el usuario:', error.message);
    }
    throw error;
  }
};

const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${baseURL}/login/`, { email, password });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al iniciar sesión - Respuesta del servidor:', error.response.data);
    } else if (error.request) {
      console.error('Error al iniciar sesión - No se recibió respuesta:', error.request);
    } else {
      console.error('Error al iniciar sesión:', error.message);
    }
    throw error;
  }
};


const getUserLotes = async (userId) => {
  try {
    const response = await axios.get(`${baseURL}/usuarios/${userId}/`);
    return response.data.lotes;
  } catch (error) {
    if (error.response) {
      console.error('Error al obtener los lotes del usuario:', error.response.data);
    } else {
      console.error('Error al obtener los lotes del usuario:', error.message);
    }
    throw error;
  }
};

const getUserNotificaciones = async (userId) => {
  try {
    const response = await axios.get(`${baseURL}/usuarios/${userId}/`); 
    return response.data.notificaciones;
  } catch (error) {
    if (error.response) {
      console.error('Error al obtener los lotes del usuario:', error.response.data);
    } else {
      console.error('Error al obtener los lotes del usuario:', error.message);
    }
    throw error;
  }
};


export { baseURL, registerUser, loginUser, getUserLotes, getUserNotificaciones};
