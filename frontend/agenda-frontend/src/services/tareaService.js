import API from './api';

// Traer todas las tareas del usuario logueado
export const getTareas = async () => {
  const response = await API.get('/tareas');
  return response.data;
};

// Crear una nueva tarea
export const createTarea = async (datosTarea) => {
  const response = await API.post('/tareas', datosTarea);
  return response.data;
};

// Buscar tareas por título o descripción
export const buscarTareas = async (termino) => {
  const response = await API.get(`/tareas/buscar?q=${termino}`);
  return response.data;
};

// Eliminar una tarea por su ID
export const deleteTarea = async (id) => {
  const response = await API.delete(`/tareas/${id}`);
  return response.data;
};

// ✏️ NUEVO: Actualizar una tarea existente por su ID
export const updateTarea = async (id, datosActualizados) => {
  const response = await API.put(`/tareas/${id}`, datosActualizados);
  return response.data;
};