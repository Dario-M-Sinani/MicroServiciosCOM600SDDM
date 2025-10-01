// src/index.ts
import express from "express";
import { AppDataSource } from "./data-source";
import { Medico } from "./entities/Medico";

AppDataSource.initialize()
    .then(() => {
        console.log("Conexión con la base de datos establecida");

        const app = express();
        const PORT = 3000;

        app.use(express.json());

        app.get("/medico", async (req, res) => {
            const medicoRepository = AppDataSource.getRepository(Medico);
            try {
                const medicos = await medicoRepository.find();
                res.json(medicos);
            } catch (error) {
                res.status(500).json({ message: "Error al obtener los médicos" });
            }
        });

        app.post("/medico", async (req, res) => {
            const medicoRepository = AppDataSource.getRepository(Medico);
            try {
                const nuevoMedico = medicoRepository.create(req.body);
                await medicoRepository.save(nuevoMedico);
                res.status(201).json(nuevoMedico);
            } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "La cédula profesional o el correo ya existen." });
        }
    }
    res.status(500).json({ message: "Error al crear el médico" });
}
        });

        app.put("/medico/:id", async (req, res) => {
            const medicoRepository = AppDataSource.getRepository(Medico);
            const id = parseInt(req.params.id);

            try {
                let medicoAActualizar = await medicoRepository.findOneBy({ id });

                if (!medicoAActualizar) {
                    return res.status(404).json({ message: "Médico no encontrado" });
                }

                medicoRepository.merge(medicoAActualizar, req.body);
                const medicoActualizado = await medicoRepository.save(medicoAActualizar);

                res.json(medicoActualizado);
            } catch (error) {
                res.status(500).json({ message: "Error al actualizar el médico" });
            }
        });

        app.delete("/medico/:id", async (req, res) => {
            const medicoRepository = AppDataSource.getRepository(Medico);
            const id = parseInt(req.params.id);

            try {
                const resultado = await medicoRepository.delete(id);

                if (resultado.affected === 0) {
                    return res.status(404).json({ message: "Médico no encontrado" });
                }

                res.status(204).send(); 
            } catch (error) {
                res.status(500).json({ message: "Error al eliminar el médico" });
            }
        });


        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });

    })
    .catch((error) => console.log("Error al conectar con la base de datos:", error));