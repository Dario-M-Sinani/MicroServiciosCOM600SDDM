const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Configuración de conexión a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Crear tabla si no existe
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contactos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombres VARCHAR(50) NOT NULL,
        apellidos VARCHAR(50) NOT NULL,
        fecha_nacimiento DATE,
        direccion VARCHAR(100),
        celular VARCHAR(20),
        correo VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ Tabla de contactos verificada/creada');
  } catch (error) {
    console.error('❌ Error al crear tabla:', error);
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando' });
});

// GET todos los contactos
app.get('/api/contactos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contactos ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET contacto por ID
app.get('/api/contactos/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contactos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST crear contacto
app.post('/api/contactos', async (req, res) => {
  try {
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO contactos (nombres, apellidos, fecha_nacimiento, direccion, celular, correo) VALUES (?, ?, ?, ?, ?, ?)',
      [nombres, apellidos, fecha_nacimiento, direccion, celular, correo]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      message: 'Contacto creado exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT actualizar contacto
app.put('/api/contactos/:id', async (req, res) => {
  try {
    const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
    
    const [result] = await pool.query(
      'UPDATE contactos SET nombres = ?, apellidos = ?, fecha_nacimiento = ?, direccion = ?, celular = ?, correo = ? WHERE id = ?',
      [nombres, apellidos, fecha_nacimiento, direccion, celular, correo, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    
    res.json({ message: 'Contacto actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE eliminar contacto
app.delete('/api/contactos/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM contactos WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    
    res.json({ message: 'Contacto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inicializar y iniciar servidor
async function startServer() {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend ejecutándose en http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);