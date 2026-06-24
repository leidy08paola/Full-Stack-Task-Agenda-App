import API from './api';

// Función para iniciar sesión
export const login = async (credenciales) => {
  const response = await API.post('/auth/login', credenciales);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
  }
  return response.data;
};

// Función para registrar un nuevo usuario
export const registrar = async (datosUsuario) => {
  const response = await API.post('/auth/registro', datosUsuario);
  return response.data;
};

// Función para cerrar sesión
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};