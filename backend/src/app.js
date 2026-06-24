const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json()); 

// Ruta de prueba inicial
app.get('/', (req, res) => {
  res.json({ mensaje: "Bienvenido a la API de la Agenda ADSO" });
});

// Aquí conectamos tu nueva ruta de autenticación
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tareas', require('./routes/tareas')); //  NUEVA LÍNEA

module.exports = app;