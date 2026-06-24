const express = require('express');
const router = express.Router();
const { crearTarea, obtenerTareas, actualizarTarea, eliminarTarea ,buscarTareas } = require('../controller/tareaController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Todas estas rutas requieren obligatoriamente el Token en las cabeceras
router.post('/', verificarToken, crearTarea);          // Crear

router.get('/', verificarToken, obtenerTareas);        // Leer todas
router.get('/buscar', verificarToken, buscarTareas);   // 👈 NUEVA: Buscar (Ej: /api/tareas/buscar?q=ADSO)
router.put('/:id', verificarToken, actualizarTarea);   // Actualizar por ID
router.put('/:id', verificarToken, actualizarTarea);   // Actualizar por ID (Ej: /api/tareas/1)
router.delete('/:id', verificarToken, eliminarTarea); // Eliminar por ID (Ej: /api/tareas/1)

module.exports = router;