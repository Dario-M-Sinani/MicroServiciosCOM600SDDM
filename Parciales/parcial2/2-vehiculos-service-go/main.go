package main

import (
	"log"
	"net"
	"os"

	"vehiculos-service-go/config"
	"vehiculos-service-go/grpc_server"
	"vehiculos-service-go/handlers"
	"vehiculos-service-go/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"google.golang.org/grpc"

	pb "vehiculos-service-go/protos"
    
	_ "vehiculos-service-go/docs" 
)

// @title API de Microservicio de Vehículos
// @version 1.0
// @description Gestión de flota de vehículos con REST y gRPC.
// @host localhost:80
// @BasePath /api/vehiculos
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No se encontró el archivo .env, usando variables de entorno")
	}

	config.ConnectDB()

	go startGRPCServer()

	router := gin.Default()
    router.Use(cors.Default()) 

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "OK (Go)"})
	})

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	api := router.Group("/api/v1")
	{
		auth := api.Group("/vehiculos")
		auth.Use(middleware.AuthMiddleware()) 
		{
			auth.POST("/", handlers.CrearVehiculo)
			auth.GET("/", handlers.ListarVehiculos)
			auth.GET("/:id", handlers.ObtenerVehiculo)
			auth.PUT("/:id", handlers.ActualizarVehiculo)
			auth.DELETE("/:id", handlers.EliminarVehiculo)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "3002"
	}
	log.Printf("🚀 Servidor REST (Go) corriendo en el puerto %s", port)
	router.Run(":" + port)
}

func startGRPCServer() {
	port := os.Getenv("GRPC_PORT")
	if port == "" {
		port = "50051"
	}

	lis, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatalf("Error al escuchar en puerto gRPC: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterVehiculoServiceServer(s, &grpc_server.VehiculoGRPCServer{})

	log.Printf("📡 Servidor gRPC (Go) corriendo en el puerto %s", port)
	if err := s.Serve(lis); err != nil {
		log.Fatalf("Error al iniciar servidor gRPC: %v", err)
	}
}