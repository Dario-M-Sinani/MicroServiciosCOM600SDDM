-- Nos aseguramos de que la base de datos exista (aunque docker-compose ya la crea)
-- SELECT 'CREATE DATABASE casigano_apuestas_db'
-- WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'casigano_apuestas_db')\gexec

-- Nos conectamos a nuestra base de datos para ejecutar los siguientes comandos
\c casigano_apuestas_db;

-- Habilitamos la extensión para generar UUIDs (si no existe)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Creamos la tabla de apuestas
CREATE TABLE IF NOT EXISTS apuestas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL,
    evento_id UUID NOT NULL,
    monto_apostado DECIMAL(10, 2) NOT NULL,
    cuota DECIMAL(5, 2) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- (pendiente, ganada, perdida, cancelada)
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- (Opcional) Insertamos datos de prueba para verificar
INSERT INTO apuestas (usuario_id, evento_id, monto_apostado, cuota, estado)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 100.00, 1.75, 'pendiente'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 50.00, 2.50, 'ganada');