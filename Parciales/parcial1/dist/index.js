"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./data-source");
const Medico_1 = require("./entities/Medico");
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Conexión con la base de datos establecida");
    const app = (0, express_1.default)();
    const PORT = 3000;
    app.use(express_1.default.json());
    app.get("/medico", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const medicoRepository = data_source_1.AppDataSource.getRepository(Medico_1.Medico);
        try {
            const medicos = yield medicoRepository.find();
            res.json(medicos);
        }
        catch (error) {
            res.status(500).json({ message: "Error al obtener los médicos" });
        }
    }));
    app.post("/medico", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const medicoRepository = data_source_1.AppDataSource.getRepository(Medico_1.Medico);
        try {
            const nuevoMedico = medicoRepository.create(req.body);
            yield medicoRepository.save(nuevoMedico);
            res.status(201).json(nuevoMedico);
        }
        catch (error) {
            if (error && typeof error === 'object' && 'code' in error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: "La cédula profesional o el correo ya existen." });
                }
            }
            res.status(500).json({ message: "Error al crear el médico" });
        }
    }));
    app.put("/medico/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const medicoRepository = data_source_1.AppDataSource.getRepository(Medico_1.Medico);
        const id = parseInt(req.params.id);
        try {
            let medicoAActualizar = yield medicoRepository.findOneBy({ id });
            if (!medicoAActualizar) {
                return res.status(404).json({ message: "Médico no encontrado" });
            }
            medicoRepository.merge(medicoAActualizar, req.body);
            const medicoActualizado = yield medicoRepository.save(medicoAActualizar);
            res.json(medicoActualizado);
        }
        catch (error) {
            res.status(500).json({ message: "Error al actualizar el médico" });
        }
    }));
    app.delete("/medico/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const medicoRepository = data_source_1.AppDataSource.getRepository(Medico_1.Medico);
        const id = parseInt(req.params.id);
        try {
            const resultado = yield medicoRepository.delete(id);
            if (resultado.affected === 0) {
                return res.status(404).json({ message: "Médico no encontrado" });
            }
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ message: "Error al eliminar el médico" });
        }
    }));
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
})
    .catch((error) => console.log("Error al conectar con la base de datos:", error));
