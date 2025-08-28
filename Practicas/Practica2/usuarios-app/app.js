const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'db',
    user: 'user',
    password: 'password',
    database: 'usuarios_db'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL');
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.query(createTableQuery, (err, result) => {
        if (err) throw err;
        console.log('Tabla de usuarios creada o ya existente.');
    });
});

app.get('/', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) throw err;
        res.render('index', { usuarios: results });
    });
});

app.post('/agregar', (req, res) => {
    const { nombre, email } = req.body;
    const nuevoUsuario = { nombre, email };
    db.query('INSERT INTO usuarios SET ?', nuevoUsuario, (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.post('/eliminar/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`La aplicación de usuarios está escuchando en http://localhost:${port}`);
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); 