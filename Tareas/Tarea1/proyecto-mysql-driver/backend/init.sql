-- Crear usuario y permisos
CREATE USER IF NOT EXISTS 'agenda_user'@'%' IDENTIFIED BY 'agenda_pass';
GRANT ALL PRIVILEGES ON agenda_db.* TO 'agenda_user'@'%';
FLUSH PRIVILEGES;

-- Usar la base de datos
USE agenda_db;

-- Insertar datos de ejemplo
INSERT IGNORE INTO contactos (nombres, apellidos, fecha_nacimiento, direccion, celular, correo) VALUES
('Juan', 'Pérez', '1990-05-15', 'Calle Principal 123', '5551234567', 'juan@example.com'),
('María', 'Gómez', '1985-11-22', 'Avenida Central 456', '5557654321', 'maria@example.com'),
('Carlos', 'Rodríguez', '1988-03-30', 'Plaza Mayor 789', '5559876543', 'carlos@example.com');   