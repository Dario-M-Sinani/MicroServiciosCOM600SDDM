package apuestas

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/jmoiron/sqlx"
)

// Handler agrupa las dependencias (como la BD)
type Handler struct {
    DB *sqlx.DB
}

// CrearApuesta es el manejador para el endpoint POST /apuestas
// @Summary      Crea una nueva apuesta
// @Description  Registra una nueva apuesta de un usuario para un evento.
// @Tags         apuestas
// @Accept       json
// @Produce      json
// @Param        apuesta body NuevaApuestaRequest true "Datos de la nueva apuesta"
// @Success      201 {object} Apuesta
// @Failure      400 {object} map[string]string "Error: Datos inválidos"
// @Failure      500 {object} map[string]string "Error: Interno del servidor"
// @Router       /apuestas [post]
func (h *Handler) CrearApuesta(c *gin.Context) {
    var req NuevaApuestaRequest
    
    // 1. Validar el JSON de entrada
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // --- LÓGICA DE SEMANA 3 (Platzhalter) ---
    // 2. Llamar al servicio de Eventos (gRPC) para obtener la cuota.
    //    cuotaActual := 1.5 // (Valor simulado por ahora)
    // 3. Llamar al servicio de Usuarios (gRPC/REST) para verificar saldo.
    //    if !usuarioTieneSaldoSuficiente { ... }
    // --- FIN LÓGICA SEMANA 3 ---
    
    // Por ahora (Semana 2), simulamos la cuota
    cuotaSimulada := 1.75 

    // 4. Insertar en la Base de Datos
    var nuevaApuesta Apuesta
    query := `
        INSERT INTO apuestas (usuario_id, evento_id, monto_apostado, cuota, estado)
        VALUES ($1, $2, $3, $4, 'pendiente')
        RETURNING id, usuario_id, evento_id, monto_apostado, cuota, estado, creado_en`

    err := h.DB.QueryRowx(
        query, 
        req.UsuarioID, 
        req.EventoID, 
        req.MontoApostado, 
        cuotaSimulada,
    ).StructScan(&nuevaApuesta)

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear la apuesta"})
        return
    }

    // --- LÓGICA DE SEMANA 3 (Platzhalter) ---
    // 5. Publicar evento en RabbitMQ ("apuesta_creada")
    // --- FIN LÓGICA SEMANA 3 ---

    // 6. Devolver la apuesta creada
    c.JSON(http.StatusCreated, nuevaApuesta)
}