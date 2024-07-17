import axios from 'axios';

const baseURL = 'http://192.168.0.182:8000/miGanado'; 

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
const buscarAnimalLote = async (idUsuario, numero_lote) => {
  try {
    const response = await axios.post(`${baseURL}/buscarAnimalLote/`, { idUsuario, numero_lote });
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
const actualizarAnimal = async (idUsuario, numeroCaravana, numero_lote, peso, edad,reciennacida) => {
  try {
    const response = await axios.put(`${baseURL}/actualizarAnimal/`, { idUsuario, numeroCaravana,  numero_lote, peso, edad,reciennacida });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al actualizar animal:', error.response.data);
    } else if (error.request) {
      console.error('Error al actualizar animal - No se recibió respuesta:', error.request);
    } else {
      console.error('Error al actualizar animal:', error.message);
    }
    throw error;
  }
};

const actualizarNombreLote = async (loteId, nombre_lote) => {
  try {
    const response = await axios.put(`${baseURL}/actualizarNombreLote/${loteId}/`, { nombre_lote });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al actualizar el nombre del lote:', error.response.data);
    } else {
      console.error('Error al actualizar el nombre del lote:', error.message);
    }
    throw error;
  }
};
const actualizarSangrado = async (idUsuario, numeroCaravana, numero_tubo) => {
  try {
    const response = await axios.put(`${baseURL}/actualizarSangrado/`, { idUsuario, numeroCaravana, numero_tubo });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al actualizar el sangrado del animal:', error.response.data);
    } else if (error.request) {
      console.error('Error al actualizar el sangrado del animal - No se recibió respuesta:', error.request);
    } else {
      console.error('Error al actualizar el sangrado del animal:', error.message);
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
    const response = await axios.get(`${baseURL}/user_lotes/`, { params: { userId } });
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


const createNotificacion = async(userId, tipo, mensaje, fecha ) => {
  try {
    const response = await axios.post(`${baseURL}/notificaciones/`, {  userId, tipo, mensaje, fecha });
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

const getUserNotificaciones = async (userId) => {
  try {
    const response = await axios.get(`${baseURL}/user_notifications/${userId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    throw error;
  }
};

const deleteNotificacion = async (notificacionId) => {
  try {
    console.log(notificacionId);
    const response = await axios.delete(`${baseURL}/notificaciones/${notificacionId}/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al eliminar la notificaciones:', error.response.data);
    } else {
      console.error('Error al eliminar la notificaciones:', error.message);
    }
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


export const deleteAnimal = async (userId, numeroCaravana) => {
  try {
    const response = await axios.delete(`${baseURL}/animale_delete/`, {
      data: {
        userId: userId,
        numeroCaravana: numeroCaravana
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error al eliminar el animal:', error.response.data);
    } else {
      console.error('Error al eliminar el animal:', error.message);
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
const createTacto = async ({ numero_lote, numeroCaravana, prenada, fecha, userId }) => {
  try {
    const response = await axios.post(`${baseURL}/tactos/`, { numero_lote, numeroCaravana, prenada, fecha, userId });
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
    
    //Creación de notificación
    var tipo = "Tratamiento";
    var animal = await buscarAnimal(userId, numeroCaravana);
    var fecha = fechaInicio;
    var mensaje = tratamiento + " de Caravana Nº"+ numeroCaravana +" en el lote N°" + animal.numero_lote;
    const notificacion = await createNotificacion(userId, tipo, mensaje, fecha);

    // Crear las notificaciones adicionales cada 'cada' días durante 'durante' veces
    for (let i = 1; i < durante / cada; i++) {
      fecha = new Date(fecha.getTime() + (cada * 24 * 60 * 60 * 1000)); 
      fecha.setUTCHours(0, 0, 0, 0); 
      await createNotificacion(userId, tipo, mensaje, fecha);
    } 

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
    
    //Creación de notificación
    var tipo = "Vacunación";
    var fecha = fechaInicio;
    var mensaje = "Vacunación del lote N°" + numero_lote +" con la vacuna "+ nombre_vacuna;
    const notificacion = await createNotificacion(userId, tipo, mensaje, fecha);

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

const getTasaNatalidad = async (loteId) => {
  try {
    const response = await axios.get(`${baseURL}/estadisticas/natalidad`, { params: { loteId } });
    return response.data;
  } catch (error) {
    console.error('Error al obtener la tasa de natalidad:', error.message);
    throw error;
  }
};

const getPesoPromedio = async (loteId) => {
  try {
    const response = await axios.get(`${baseURL}/estadisticas/peso-promedio`, { params: { loteId } });
    return response.data;
  } catch (error) {
    console.error('Error al obtener el peso promedio:', error.message);
    throw error;
  }
};

const getTasaPrenez = async (loteId) => {
  try {
    const response = await axios.get(`${baseURL}/estadisticas/tasa-prenez`, { params: { loteId } });
    return response.data;
  } catch (error) {
    console.error('Error al obtener la tasa de preñez:', error.message);
    throw error;
  }
};











export { baseURL ,actualizarAnimal ,deleteNotificacion,actualizarSangrado,buscarAnimalLote,actualizarPrenies,actualizarNombreLote ,buscarSan ,buscarTratam ,registerUser, loginUser, buscarAnimal, getUserLotes, getUserNotificaciones,createSangrado,createTacto,createVacunacion, createTratamiento, registerAnimal,createLote,deleteLote,getTasaNatalidad,getPesoPromedio,getTasaPrenez};
