// src/entities/Medico.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Medico {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    nombre!: string;

    @Column({ length: 100 })
    apellido!: string;

    @Column({ unique: true, length: 50 })
    cedulaProfesional!: string;

    @Column({ length: 100 })
    especialidad!: string;

    @Column("int")
    aniosExperiencia!: number;

    @Column({ unique: true, length: 100 })
    correoElectronico!: string;
}