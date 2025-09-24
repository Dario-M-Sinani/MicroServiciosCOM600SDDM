import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "./proto/estudiantes.proto");

// Cargar el proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDefinition).estudiantes;

// Crear cliente
const client = new proto.EstudianteService(
    "localhost:50051",
    grpc.credentials.createInsecure()
);

// 1. Agregar estudiantes
console.log("1. Agregando estudiantes...");
const estudiantes = [
    {
        ci: "9876543",
        nombres: "Ana",
        apellidos: "Rodriguez",
        carrera: "Medicina"
    },
    {
        ci: "1234567", 
        nombres: "Luis",
        apellidos: "Martinez",
        carrera: "Derecho"
    },
    {
        ci: "5558882",
        nombres: "Carlos",
        apellidos: "Gutierrez",
        carrera: "Ingeniería Civil"
    }
];

let estudiantesAgregados = 0;
estudiantes.forEach(est => {
    client.AgregarEstudiante(est, (err, response) => {
        if (err) return console.error("Error agregando estudiante:", err.message);
        console.log("Estudiante agregado:", response.estudiante.nombres, response.estudiante.apellidos);
        estudiantesAgregados++;
        
        if (estudiantesAgregados === estudiantes.length) {
            agregarCursos();
        }
    });
});

function agregarCursos() {
    // 2. Agregar cursos
    console.log("\n2. Agregando cursos...");
    const cursos = [
        {
            codigo: "MAT101",
            nombre: "Matemáticas Avanzadas",
            docente: "Dr. Fernando Lima"
        },
        {
            codigo: "FIS201",
            nombre: "Física Moderna", 
            docente: "Dra. Sofia Rojas"
        },
        {
            codigo: "QUI150",
            nombre: "Química Orgánica",
            docente: "Dr. Roberto Vargas"
        },
        {
            codigo: "BIO300",
            nombre: "Biología Molecular",
            docente: "Dra. Patricia Núñez"
        }
    ];

    let cursosAgregados = 0;
    cursos.forEach(cur => {
        client.AgregarCurso(cur, (err, response) => {
            if (err) return console.error("Error agregando curso:", err.message);
            console.log("Curso agregado:", response.curso.nombre);
            cursosAgregados++;
            
            if (cursosAgregados === cursos.length) {
                inscribirEstudiantes();
            }
        });
    });
}

function inscribirEstudiantes() {
    // 3. Inscribir estudiantes en cursos
    console.log("\n3. Inscribiendo estudiantes en cursos...");
    const inscripciones = [
        { ci_estudiante: "9876543", codigo_curso: "MAT101" },
        { ci_estudiante: "9876543", codigo_curso: "FIS201" },
        { ci_estudiante: "1234567", codigo_curso: "QUI150" },
        { ci_estudiante: "1234567", codigo_curso: "BIO300" },
        { ci_estudiante: "5558882", codigo_curso: "MAT101" },
        { ci_estudiante: "5558882", codigo_curso: "QUI150" },
        { ci_estudiante: "5558882", codigo_curso: "BIO300" }
    ];

    let inscripcionesRealizadas = 0;
    inscripciones.forEach(insc => {
        client.InscribirEstudiante(insc, (err, response) => {
            if (err) {
                console.error("Error en inscripción:", err.message);
            } else {
                console.log("Inscripción exitosa:", insc.ci_estudiante, "en", insc.codigo_curso);
            }
            inscripcionesRealizadas++;
            
            if (inscripcionesRealizadas === inscripciones.length) {
                consultarDatos();
            }
        });
    });
}

function consultarDatos() {
    // 4. Listar cursos de cada estudiante
    console.log("\n4. Listando cursos de cada estudiante:");
    
    estudiantes.forEach(est => {
        client.ListarCursosDeEstudiante({ ci: est.ci }, (err, response) => {
            if (err) return console.error("Error:", err.message);
            console.log(`\nCursos de ${est.nombres} ${est.apellidos}:`);
            response.cursos.forEach(cur => {
                console.log(`  - ${cur.codigo}: ${cur.nombre}`);
            });
            
            // Después de listar cursos de todos, listar estudiantes por curso
            if (est.ci === estudiantes[estudiantes.length-1].ci) {
                listarEstudiantesPorCurso();
            }
        });
    });
}

function listarEstudiantesPorCurso() {
    // 5. Listar estudiantes por curso
    console.log("\n5. Listando estudiantes por curso:");
    
    const cursos = ["MAT101", "FIS201", "QUI150", "BIO300"];
    let cursosConsultados = 0;
    
    cursos.forEach(codigo => {
        client.ListarEstudiantesDeCurso({ codigo }, (err, response) => {
            if (err) return console.error("Error:", err.message);
            console.log(`\nEstudiantes en ${codigo}:`);
            response.estudiantes.forEach(est => {
                console.log(`  - ${est.nombres} ${est.apellidos} (${est.carrera})`);
            });
            
            cursosConsultados++;
            if (cursosConsultados === cursos.length) {
                listarTodo();
            }
        });
    });
}

function listarTodo() {
    // 6. Listar todos los estudiantes
    console.log("\n6. Listando todos los estudiantes:");
    client.ListarTodosLosEstudiantes({}, (err, response) => {
        if (err) return console.error("Error:", err.message);
        console.log("Lista de estudiantes:");
        response.estudiantes.forEach(est => {
            console.log(`  ${est.ci}: ${est.nombres} ${est.apellidos} - ${est.carrera}`);
        });
        
        // 7. Listar todos los cursos
        console.log("\n7. Listando todos los cursos:");
        client.ListarTodosLosCursos({}, (err, response) => {
            if (err) return console.error("Error:", err.message);
            console.log("Lista de cursos:");
            response.cursos.forEach(cur => {
                console.log(`  ${cur.codigo}: ${cur.nombre} - ${cur.docente}`);
            });
            
            console.log("\n=== Práctica completada ===");
        });
    });
}