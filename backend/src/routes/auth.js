const express = require('express');
const router = express.Router();
const { registrarUsuario , loginUsuario } = require('../controller/authController');

// Ruta para registrar un usuario: POST http://localhost:5000/api/auth/registro
router.post('/registro', registrarUsuario);

//  RUTA PARA LOGIN: POST http://localhost:5000/api/auth/login
router.post('/login', loginUsuario);

module.exports = router;