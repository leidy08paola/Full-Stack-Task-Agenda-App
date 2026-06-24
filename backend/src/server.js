const app = require('./app');
require('dotenv').config();
require('./config/db'); // 👈 Esto activa la conexión a MySQL al arrancar

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando perfectamente en el puerto ${PORT}`);
});