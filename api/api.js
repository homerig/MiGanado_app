import axios from 'axios';

// const baseURL = 'http://192.168.0.226:8000/miGanado'; // Ajusta la URL a la de tu servidor
const baseURL = 'http://10.100.84.24:8000/miGanado'; //uade

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
      console.error('Error al iniciar sesión:', error.response.data);
    } else {
      console.error('Error al iniciar sesión:', error.message);
    }
    throw error;
  }
};

export { registerUser, loginUser };
