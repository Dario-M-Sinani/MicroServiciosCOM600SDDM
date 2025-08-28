const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 4000;

// --- NUEVA CONFIGURACIÓN ---
// 1. Configurar EJS como el motor de plantillas
app.set('view engine', 'ejs');

// 2. Habilitar la lectura de datos de formularios (como los inputs)
app.use(express.urlencoded({ extended: true }));


// --- CÓDIGO EXISTENTE (SIN CAMBIOS) ---
// Conexión a la base de datos
mongoose.connect('mongodb://db:27017/tareas_db', { useNewUrlParser: true, useUnifiedTopology: true });

// Definición del Schema y Modelo de Tarea
const TareaSchema = new mongoose.Schema({
    titulo: String,
    descripcion: String,
    estado: {
        type: String,
        enum: ['pendiente', 'en progreso', 'completado'],
        default: 'pendiente'
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    }
});

const Tarea = mongoose.model('Tarea', TareaSchema);


// --- RUTAS MODIFICADAS ---
// Reemplazamos las rutas de la API con rutas que renderizan la vista

/**
 * RUTA PRINCIPAL (READ): 
 * Muestra la página principal con el formulario y la lista de tareas.
 */
app.get('/', async (req, res) => {
    try {
        const tareas = await Tarea.find(); // Busca todas las tareas en la BD
        res.render('tareas', { tareas: tareas }); // Pinta el archivo tareas.ejs y le pasa los datos
    } catch (error) {
        res.status(500).send({ message: "Error al obtener las tareas." });
    }
});

/**
 * RUTA PARA CREAR TAREAS (CREATE):
 * Recibe los datos del formulario y crea una nueva tarea.
 */
app.post('/tareas', async (req, res) => {
    try {
        const nuevaTarea = new Tarea(req.body);
        await nuevaTarea.save();
        res.redirect('/'); // Redirige a la página principal para ver la lista actualizada
    } catch (error) {
        res.status(500).send({ message: "Error al guardar la tarea." });
    }
});

/**
 * RUTA PARA ELIMINAR TAREAS (DELETE):
 * Recibe el ID de la tarea a eliminar.
 */
app.post('/tareas/delete/:id', async (req, res) => {
    try {
        await Tarea.findByIdAndDelete(req.params.id);
        res.redirect('/'); // Redirige a la página principal
    } catch (error) {
        res.status(500).send({ message: "Error al eliminar la tarea." });
    }
});


// --- CÓDIGO EXISTENTE (SIN CAMBIOS) ---
// Iniciar el servidor
app.listen(port, () => {
    console.log(`La aplicación de tareas está escuchando en http://localhost:${port}`);
});