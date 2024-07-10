import axios from 'axios';

const baseURL = 'http://192.168.0.71:8000/miGanado'; // Ajusta la URL a la de tu servidor

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




const createSangrado = async ({ numero_lote, numero_animal, numero_tubo, fecha, userId }) => {
  try {
    const response = await axios.post(`${baseURL}/sangrados/`, { numero_lote, numero_animal, numero_tubo, fecha, userId });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al guardar los datos de sangrado:', error.response.data);
    } else {
      console.error('Error al guardar los datos de sangrado:', error.message);
    }
    throw error;
  }
};
const createTacto = async ({ numero_lote, numero_animal, prenada, fecha, userId }) => {
  try {
    const response = await axios.post(`${baseURL}/tactos/`, { numero_lote, numero_animal, prenada, fecha, userId });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al guardar los datos del tacto:', error.response.data);
    } else {
      console.error('Error al guardar los datos del tacto:', error.message);
    }
    throw error;
  }
};

const createTratamiento = async ({ numeroCaravana, tratamiento, medicacion, fechaInicio, cada, userId }) => {
  try {
    const response = await axios.post(`${baseURL}/tratamientos/`, { numeroCaravana, tratamiento, medicacion, fechaInicio, cada, userId });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al guardar los datos de tratamiento:', error.response.data);
    } else {
      console.error('Error al guardar los datos de tratamiento:', error.message);
    }
    throw error;
  }
};


const registerAnimal = async({ numeroCaravana, numero_lote, tipos, peso, edad, preniada, reciennacida, userId }) => {
  try {
    const response = await axios.post(`${baseURL}/animales/`, { numeroCaravana, numero_lote, tipos, peso, edad, preniada, reciennacida, userId });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al registrar el animal:', error.response.data);
    } else {
      console.error('Error al registrar el animal:', error.message);
    }
    throw error;
  }
}









export { baseURL, registerUser, loginUser, getUserLotes, getUserNotificaciones,createSangrado,createTacto, createTratamiento, registerAnimal};
