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

// Base de datos en memoria
const estudiantes = [];
const cursos = [];
const inscripciones = [];

// Implementación de los métodos
const serviceImpl = {
    AgregarEstudiante: (call, callback) => {
        const nuevo = call.request;
        // Verificar si ya existe
        const existe = estudiantes.find(e => e.ci === nuevo.ci);
        if (existe) {
            callback({
                code: grpc.status.ALREADY_EXISTS,
                message: "Estudiante ya existe"
            });
            return;
        }
        estudiantes.push(nuevo);
        callback(null, { estudiante: nuevo });
    },

    AgregarCurso: (call, callback) => {
        const nuevo = call.request;
        // Verificar si ya existe
        const existe = cursos.find(c => c.codigo === nuevo.codigo);
        if (existe) {
            callback({
                code: grpc.status.ALREADY_EXISTS,
                message: "Curso ya existe"
            });
            return;
        }
        cursos.push(nuevo);
        callback(null, { curso: nuevo });
    },

    InscribirEstudiante: (call, callback) => {
        const { ci_estudiante, codigo_curso } = call.request;
        
        // Verificar estudiante
        const est = estudiantes.find(e => e.ci === ci_estudiante);
        if (!est) {
            callback({
                code: grpc.status.NOT_FOUND,
                message: "Estudiante no encontrado"
            });
            return;
        }
        
        // Verificar curso
        const cur = cursos.find(c => c.codigo === codigo_curso);
        if (!cur) {
            callback({
                code: grpc.status.NOT_FOUND,
                message: "Curso no encontrado"
            });
            return;
        }
        
        // Verificar inscripción existente
        const inscExistente = inscripciones.find(
            i => i.ci_estudiante === ci_estudiante && i.codigo_curso === codigo_curso
        );
        if (inscExistente) {
            callback({
                code: grpc.status.ALREADY_EXISTS,
                message: "Estudiante ya inscrito en este curso"
            });
            return;
        }
        
        inscripciones.push({ ci_estudiante, codigo_curso });
        callback(null, { success: true, message: "Inscripción exitosa" });
    },

    ListarCursosDeEstudiante: (call, callback) => {
        const { ci } = call.request;
        const cursosEst = inscripciones
            .filter(i => i.ci_estudiante === ci)
            .map(i => cursos.find(c => c.codigo === i.codigo_curso))
            .filter(c => c !== undefined);
        callback(null, { cursos: cursosEst });
    },

    ListarEstudiantesDeCurso: (call, callback) => {
        const { codigo } = call.request;
        const estsCurso = inscripciones
            .filter(i => i.codigo_curso === codigo)
            .map(i => estudiantes.find(e => e.ci === i.ci_estudiante))
            .filter(e => e !== undefined);
        callback(null, { estudiantes: estsCurso });
    },

    ListarTodosLosEstudiantes: (call, callback) => {
        callback(null, { estudiantes });
    },

    ListarTodosLosCursos: (call, callback) => {
        callback(null, { cursos });
    }
};

// Crear servidor
const server = new grpc.Server();

server.addService(proto.EstudianteService.service, serviceImpl);

const PORT = "50051";
server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, bindPort) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Servidor gRPC escuchando en ${bindPort}`);
        server.start();
    }
);