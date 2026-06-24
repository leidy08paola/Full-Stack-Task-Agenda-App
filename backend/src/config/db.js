const mysql = require('mysql2');
require('dotenv').config();

// Crear el pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'agenda_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Verificar si la conexión con XAMPP funciona
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL en XAMPP:', err.message);
  } else {
    console.log('✅ ¡Conexión exitosa a la base de datos de XAMPP!');
    connection.release(); // Liberar la conexión
  }
});

module.exports = pool.promise();