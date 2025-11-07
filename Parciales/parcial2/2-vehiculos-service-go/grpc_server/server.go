package grpc_server

import (
	"context"
	"log"

	"vehiculos-service-go/config"
	"vehiculos-service-go/models"
	pb "vehiculos-service-go/protos" // Importar protos compilados

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Nuestro struct de servidor que implementa la interfaz generada por gRPC
type VehiculoGRPCServer struct {
	pb.UnimplementedVehiculoServiceServer // Embeber para compatibilidad futura
}

// Implementación del método 'VerificarDisponibilidad' definido en el .proto
func (s *VehiculoGRPCServer) VerificarDisponibilidad(ctx context.Context, req *pb.VehiculoRequest) (*pb.DisponibilidadResponse, error) {

	log.Printf("[gRPC] Recibida solicitud de verificación para ID: %s", req.VehiculoId)

	// Convertir el string ID a un ObjectID de MongoDB
	objID, err := primitive.ObjectIDFromHex(req.VehiculoId)
	if err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "ID de vehículo inválido")
	}

	var vehiculo models.Vehiculo
	filter := bson.M{"_id": objID}

	// Buscar el vehículo en la BD
	err = config.VehiculoCollection.FindOne(context.Background(), filter).Decode(&vehiculo)
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "Vehículo no encontrado")
	}

	// Lógica de disponibilidad
	esDisponible := vehiculo.Estado == "disponible"

	// Devolver la respuesta gRPC
	return &pb.DisponibilidadResponse{
		Disponible:   esDisponible,
		EstadoActual: vehiculo.Estado,
	}, nil
}