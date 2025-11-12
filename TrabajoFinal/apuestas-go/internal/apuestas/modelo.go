package apuestas

import (
    "time"
)

// Apuesta representa el modelo de datos para una apuesta
type Apuesta struct {
    ID             string    `db:"id" json:"id"`
    UsuarioID      string    `db:"usuario_id" json:"usuario_id"`
    EventoID       string    `db:"evento_id" json:"evento_id"`
    MontoApostado  float64   `db:"monto_apostado" json:"monto_apostado"`
    Cuota          float64   `db:"cuota" json:"cuota"`
    Estado         string    `db:"estado" json:"estado"`
    CreadoEn       time.Time `db:"creado_en" json:"creado_en"`
}

// NuevaApuestaRequest define el JSON que esperamos para crear una apuesta
type NuevaApuestaRequest struct {
    UsuarioID     string  `json:"usuario_id" binding:"required"`
    EventoID      string  `json:"evento_id" binding:"required"`
    MontoApostado float64 `json:"monto_apostado" binding:"required,gt=0"`
}