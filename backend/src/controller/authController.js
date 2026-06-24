const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. FUNCIÓN DE REGISTRO (La que ya probaste)
const registrarUsuario = async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  try {
    const [existe] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (existe.length > 0) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const elRol = rol || 'usuario';
    await db.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, passwordHash, elRol]
    );
    res.status(201).json({ mensaje: "🎉 ¡Usuario registrado con éxito!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error en el servidor al registrar" });
  }
};

// 2. NUEVA FUNCIÓN: LOGIN DE USUARIOS
const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
  }

  try {
    // Verificar si el usuario existe
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ error: "Credenciales incorrectas" });
    }

    const usuario = rows[0];

    // Comparar la contraseña ingresada con la encriptada en XAMPP
    const passwordCorrecto = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecto) {
      return res.status(400).json({ error: "Credenciales incorrectas" });
    }

    // Crear el Token de seguridad (JWT) incluyendo el ID y el ROL
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' } // El token expira en 2 horas
    );

    res.json({
      mensaje: "👋 ¡Bienvenido de nuevo!",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error en el servidor al iniciar sesión" });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario
};