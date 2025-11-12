package database

import (
    "log"
    "os" // Para leer variables de entorno

    _ "github.com/jackc/pgx/v5/stdlib" // Driver PostgreSQL
    "github.com/jmoiron/sqlx"
)

func Conectar() *sqlx.DB {
    // Ejemplo: "postgres://user:password@localhost:5432/db_casigano"
    dbURL := os.Getenv("DATABASE_URL")
    if dbURL == "" {
        log.Fatal("DATABASE_URL no está definida")
    }

    db, err := sqlx.Connect("pgx", dbURL)
    if err != nil {
        log.Fatalf("Error al conectar a la base de datos: %v", err)
    }

    if err = db.Ping(); err != nil {
        log.Fatalf("Error al hacer ping a la base de datos: %v", err)
    }

    log.Println("Conexión a la base de datos exitosa")
    return db
}