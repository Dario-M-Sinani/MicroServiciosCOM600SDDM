require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const PORT = process.env.PORT || 3001;

db.getConnection()
  .then(connection => {
    console.log('Conectado a la base de datos MySQL');
    connection.release();
    app.listen(PORT, () => {
      console.log(` Servicio de Autenticación corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('[ERROR DE BD]: No se pudo conectar a MySQL.', err.message);
    process.exit(1);
  });