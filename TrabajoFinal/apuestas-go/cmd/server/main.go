package main
import (
    "log"
    
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
    
    // ↓↓↓ ESTAS LÍNEAS ESTÁN CORREGIDAS ↓↓↓
    "github.com/Dario-M-Sinani/apuestas-go/internal/apuestas"
    "github.com/Dario-M-Sinani/apuestas-go/internal/database"
    
    swaggerFiles "github.com/swaggo/files"
    ginSwagger "github.com/swaggo/gin-swagger"
    _ "github.com/Dario-M-Sinani/apuestas-go/docs" // Esta también
)
// @title        API del Microservicio de Apuestas (CasiGano)
// @version      1.0
// @description  Maneja todas las operaciones de apuestas del sistema.
// @host         localhost:8081
// @BasePath     /api/v1
func main() {
    // Cargar .env (solo para desarrollo)
    if err := godotenv.Load(); err != nil {
        log.Println("No se encontró el archivo .env")
    }

    // 1. Conectar a la Base de Datos
    db := database.Conectar()
    
    // 2. Crear instancias del handler
    apuestasHandler := &apuestas.Handler{DB: db}

    // 3. Iniciar el router Gin
    router := gin.Default()
    
    // Agrupar rutas de la API
    api := router.Group("/api/v1")
    {
        // Rutas de Apuestas
        api.POST("/apuestas", apuestasHandler.CrearApuesta)
        // api.GET("/apuestas/:id", apuestasHandler.ObtenerApuesta)
        // api.GET("/usuarios/:id/apuestas", apuestasHandler.ObtenerApuestasPorUsuario)
    }

    // 4. Configurar ruta de Swagger
    router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
    log.Println("Swagger UI disponible en http://localhost:8081/swagger/index.html")

    // Iniciar el servidor
    if err := router.Run(":8081"); err != nil {
        log.Fatalf("Error al iniciar el servidor: %v", err)
    }
}