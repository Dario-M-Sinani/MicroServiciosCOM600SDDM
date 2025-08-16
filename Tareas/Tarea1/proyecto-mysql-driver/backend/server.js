const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de MySQL (XAMPP)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'agenda_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Crear tabla (ejecutar una vez)
async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contactos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombres VARCHAR(50) NOT NULL,
        apellidos VARCHAR(50) NOT NULL,
        fecha_nacimiento DATE,
        direccion VARCHAR(100),
        celular VARCHAR(20),
        correo VARCHAR(50)
      )
    `);
    console.log('Tabla creada o ya existente');
  } catch (err) {
    console.error('Error al crear tabla:', err);
  }
}

// Endpoints CRUD
app.get('/api/contactos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contactos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Implementar POST, PUT, DELETE similares...

createTable().then(() => {
  app.listen(3001, () => console.log('Backend SQL en http://localhost:3001'));
});