import axios from 'axios';

const baseURL = 'http://192.168.0.10:8000/miGanado'; // Ajusta la URL a la de tu servidor

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

const buscarAnimal = async (idUsuario, numeroCaravana) => {
  try {
    const response = await axios.post(`${baseURL}/buscarAnimal/`, { idUsuario, numeroCaravana });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al buscar el animal:', error.response.data);
    } else if (error.request) {
      console.error('Error al buscar el animal - No se recibió respuesta:', error.request);
    } else {
      console.error('Error al buscar el animal:', error.message);
    }
    throw error;
  }
};
const actualizarPrenies = async (idUsuario, numeroCaravana, preniada) => {
  try {
    const response = await axios.put(`${baseURL}/actualizarPrenies/`, { idUsuario, numeroCaravana, preniada });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al actualizar la preñez del animal:', error.response.data);
    } else if (error.request) {
      console.error('Error al actualizar la preñez del animal - No se recibió respuesta:', error.request);
    } else {
      console.error('Error al actualizar la preñez del animal:', error.message);
    }
    throw error;
  }
};




const buscarTratam = async (idUsuario, numeroCaravana) => {
  try {
    const response = await axios.post(`${baseURL}/buscarTratam/`, { idUsuario, numeroCaravana });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al buscar tratamiento:', error.response.data);
    } else if (error.request) {
      console.error('Error al buscar el tratamiento - No se recibió respuesta:', error.request);
    } else {
      console.error('Error al buscar tratamiento:', error.message);
    }
    throw error;
  }
};
const buscarSan = async (idUsuario, numeroCaravana) => {
  try {
    const response = await axios.post(`${baseURL}/buscarSan/`, { idUsuario, numeroCaravana });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al buscar sangrado:', error.response.data);
    } else if (error.request) {
      console.error('Error al buscar sangrado - No se recibió respuesta:', error.request);
    } else {
      console.error('Error al buscar sangrado:', error.message);
    }
    throw error;
  }
};

const getUserLotes = async (userId) => {
  try {
    const response = await axios.get(`${baseURL}/lotes/?userId=${userId}`);
    return response.data;
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
    const response = await axios.get(`${baseURL}/user_notifications/${userId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    throw error;
  }
};


const createLote = async (loteData, userId) => {
  try {
    const response = await axios.post(`${baseURL}/lotes/`, { ...loteData, usuario: userId });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al crear el lote:', error.response.data);
    } else {
      console.error('Error al crear el lote:', error.message);
    }
    throw error;
  }
};

const deleteLote = async (loteId) => {
  try {
    const response = await axios.delete(`${baseURL}/lotes/${loteId}/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al eliminar el lote:', error.response.data);
    } else {
      console.error('Error al eliminar el lote:', error.message);
    }
    throw error;
  }
};


const createSangrado = async ({ numero_lote, numeroCaravana, numero_tubo, fecha, userId }) => {
  try {
    const response = await axios.post(`${baseURL}/sangrados/`, { numero_lote, numeroCaravana, numero_tubo, fecha, userId });
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

const createTratamiento = async ({ numeroCaravana, tratamiento, medicacion, fechaInicio, cada, durante, userId }) => {
  try {
    const response = await axios.post(`${baseURL}/tratamientos/`, { numeroCaravana, tratamiento, medicacion, fechaInicio, cada, durante, userId });
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


const createVacunacion = async ({ numero_lote, nombre_vacuna, fechaInicio, durante,cada, userId }) => {
  try {
    const response = await axios.post(`${baseURL}/vacunaciones/`, { numero_lote, nombre_vacuna, fechaInicio,durante,cada, userId });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al guardar los datos de vacunacion:', error.response.data);
    } else {
      console.error('Error al guardar los datos de vacunacion:', error.message);
    }
    throw error;
  }
};










export { baseURL ,actualizarPrenies ,buscarSan ,buscarTratam ,registerUser, loginUser, buscarAnimal, getUserLotes, getUserNotificaciones,createSangrado,createTacto,createVacunacion, createTratamiento, registerAnimal,createLote,deleteLote};
