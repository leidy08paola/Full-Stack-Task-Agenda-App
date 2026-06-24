const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  // Capturar el token que viene en los Headers (cabeceras) de la petición
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: "Acceso denegado. No se proporcionó un token." });
  }

  try {
    // Verificar si el token es válido usando la clave secreta del .env
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    
    // Guardamos los datos del usuario logueado en la petición (req.usuario)
    req.usuario = verificado; 
    
    next(); // ¡Todo bien! Continuamos a la función del CRUD
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado." });
  }
};

module.exports = { verificarToken };