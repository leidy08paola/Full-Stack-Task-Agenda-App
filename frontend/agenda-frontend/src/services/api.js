import axios from 'axios';

// Configuración de la URL base de tu servidor Node.js
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor para agregar automáticamente el token a las cabeceras (Headers)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;