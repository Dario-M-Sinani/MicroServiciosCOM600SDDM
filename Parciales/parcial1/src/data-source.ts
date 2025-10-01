// src/data-source.ts
import { DataSource } from "typeorm";
import "reflect-metadata";
import { Medico } from "./entities/Medico";
import * as dotenv from 'dotenv';

dotenv.config(); 

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost", 
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "clinica_db",
    synchronize: true,
    logging: false,
    entities: [Medico],
    migrations: [],
    subscribers: [],
});