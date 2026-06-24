const db = require('../config/db');

// 1. CREAR TAREA
const crearTarea = async (req, res) => {
  const { titulo, descripcion, fecha_vencimiento } = req.body;
  const usuario_id = req.usuario.id;

  if (!titulo) {
    return res.status(400).json({ error: "El título de la tarea es obligatorio" });
  }

  try {
    await db.query(
      'INSERT INTO tareas (titulo, descripcion, fecha_vencimiento, usuario_id) VALUES (?, ?, ?, ?)',
      [titulo, descripcion, fecha_vencimiento || null, usuario_id]
    );
    res.status(201).json({ mensaje: "📝 Tarea guardada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor al crear la tarea" });
  }
};

// 2. OBTENER TAREAS
const obtenerTareas = async (req, res) => {
  const usuario_id = req.usuario.id;
  try {
    const [tareas] = await db.query('SELECT * FROM tareas WHERE usuario_id = ?', [usuario_id]);
    res.json(tareas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor al obtener las tareas" });
  }
};

// 3. ACTUALIZAR UNA TAREA
const actualizarTarea = async (req, res) => {
  const { id } = req.params; 
  const { titulo, descripcion, estado, fecha_vencimiento } = req.body;
  const usuario_id = req.usuario.id;

  try {
    const [verificar] = await db.query('SELECT * FROM tareas WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
    if (verificar.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada o no tienes permisos" });
    }

    await db.query(
      'UPDATE tareas SET titulo = ?, descripcion = ?, estado = ?, fecha_vencimiento = ? WHERE id = ?',
      [
        titulo || verificar[0].titulo, 
        descripcion || verificar[0].descripcion, 
        estado || verificar[0].estado, 
        fecha_vencimiento || verificar[0].fecha_vencimiento, 
        id
      ]
    );

    res.json({ mensaje: "🔄 Tarea actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor al actualizar la tarea" });
  }
};

// 4. ELIMINAR UNA TAREA
const eliminarTarea = async (req, res) => {
  const { id } = req.params; 
  const usuario_id = req.usuario.id;

  try {
    const [verificar] = await db.query('SELECT * FROM tareas WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
    if (verificar.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada o no tienes permisos" });
    }

    await db.query('DELETE FROM tareas WHERE id = ?', [id]);
    res.json({ mensaje: "🗑️ Tareapipe eliminada permanentemente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor al eliminar la tarea" });
  }
};

// 5. BUSCAR TAREAS
const buscarTareas = async (req, res) => {
  const { q } = req.query; 
  const usuario_id = req.usuario.id;

  if (!q) {
    return res.status(400).json({ error: "Debes proporcionar un término de búsqueda" });
  }

  try {
    const termino = `%${q}%`;
    const [tareas] = await db.query(
      'SELECT * FROM tareas WHERE usuario_id = ? AND (titulo LIKE ? OR descripcion LIKE ?)',
      [usuario_id, termino, termino]
    );

    res.json(tareas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor al buscar las tareas" });
  }
};

module.exports = {
  crearTarea,
  obtenerTareas,
  actualizarTarea,
  eliminarTarea,
  buscarTareas
};