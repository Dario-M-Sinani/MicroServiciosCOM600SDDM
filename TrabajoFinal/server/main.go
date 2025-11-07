package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"sync"
	"time"

	// Importa el paquete 'proto' que acabamos de generar
	pb "github.com/Dario-M-Sinani/apuestas/proto"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"  // Para códigos de error de gRPC
	"google.golang.org/grpc/status" // Para crear errores de gRPC
	"google.golang.org/protobuf/types/known/timestamppb"
)

// Constantes de configuración
const (
	betQueueCapacity = 10000 // Cuántas apuestas podemos encolar antes de rechazar
	numBetWorkers    = 20    // Cuántas goroutines procesarán apuestas en paralelo
)

// server implementa la interfaz de gRPC (pb.BettingServiceServer)
type server struct {
	pb.UnimplementedBettingServiceServer

	// Esta es la clave de la concurrencia:
	// Un canal (cola) que recibe las apuestas.
	betQueue chan *pb.PlaceBetRequest

	// En un futuro, aquí pondrías los clientes gRPC
	// para hablar con tus otros microservicios.
	// userClient  pb_user.UserServiceClient
	// eventClient pb_event.EventServiceClient
}

// newServer es nuestro constructor
func newServer() *server {
	s := &server{
		// Creamos un canal con buffer
		betQueue: make(chan *pb.PlaceBetRequest, betQueueCapacity),
	}

	// Inicia el pool de workers
	log.Printf("Iniciando %d workers de apuestas...", numBetWorkers)
	for i := 0; i < numBetWorkers; i++ {
		go s.betWorker(i)
	}

	return s
}

//
// --- Implementación de RPCs ---
//

// PlaceBet es el handler gRPC. Debe ser MUY RÁPIDO.
// Solo valida y encola. NO contacta a la DB ni a otros servicios.
func (s *server) PlaceBet(ctx context.Context, req *pb.PlaceBetRequest) (*pb.PlaceBetResponse, error) {
	log.Printf("[RPC] Recibida apuesta de %s para %s", req.UserId, req.EventId)

	// Validación rápida de entrada
	if req.UserId == "" || req.EventId == "" || req.Amount <= 0 {
		return nil, status.Error(codes.InvalidArgument, "Faltan argumentos (user_id, event_id, amount)")
	}

	// Intentamos encolar la apuesta.
	// Usamos 'select' con 'default' para no bloquearnos.
	select {
	case s.betQueue <- req:
		// Éxito: La apuesta fue encolada
		log.Printf("[RPC] Apuesta de %s encolada. Capacidad restante: %d", req.UserId, betQueueCapacity-len(s.betQueue))
		
		return &pb.PlaceBetResponse{
			BetId:     fmt.Sprintf("bet_%d", time.Now().UnixNano()), // Simulación de ID
			Status:    "PENDING_ACCEPTANCE",
			PlacedAt: timestamppb.Now(),
		}, nil
		
	default:
		// Error: La cola está llena
		log.Printf("[ERROR] Cola de apuestas llena. Rechazando apuesta de %s", req.UserId)
		return nil, status.Error(codes.ResourceExhausted, "Servidor sobrecargado, intente más tarde")
	}
}

// GetEventOdds (Streaming RPC)
func (s *server) GetEventOdds(req *pb.EventOddsRequest, stream pb.BettingService_GetEventOddsServer) error {
	log.Printf("[STREAM] Cliente suscrito a cuotas para %s", req.EventId)
	
	// Simulación: En un sistema real, esto estaría conectado a un
	// Message Bus (NATS/Kafka) que recibe actualizaciones del servicio de Eventos (Python).
	for {
		// Simulación de una actualización de cuota
		time.Sleep(3 * time.Second)

		resp := &pb.EventOddsResponse{
			EventId:     req.EventId,
			Outcome:     "team_a_wins",
			Odds:        1.85, // Simulación
			LastUpdated: timestamppb.Now(),
		}

		// Enviar la actualización al cliente
		if err := stream.Send(resp); err != nil {
			// El cliente se desconectó
			log.Printf("[STREAM] Cliente de %s desconectado: %v", req.EventId, err)
			return err // Termina el stream para esta goroutine
		}
	}
}

//
// --- Lógica de Concurrencia (Workers) ---
//

// betWorker es una goroutine que se ejecuta en segundo plano.
// Consume de la cola `betQueue` y hace el trabajo "lento".
func (s *server) betWorker(workerID int) {
	log.Printf("Worker %d iniciado", workerID)

	// Itera "para siempre" sobre el canal.
	// La goroutine se bloqueará aquí hasta que llegue una apuesta.
	for betReq := range s.betQueue {
		
		log.Printf("[Worker %d] Procesando apuesta de %s...", workerID, betReq.UserId)

		// --- ¡AQUÍ ES DONDE TE COMUNICAS CON OTROS SERVICIOS! ---
		//
		// 1. LLAMAR AL SERVICIO DE USUARIOS (Node)
		//    - ¿El usuario existe?
		//    - ¿Tiene fondos suficientes?
		//    ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		//    userResponse, err := s.userClient.CheckBalance(ctx, &pb_user.BalanceRequest{UserId: betReq.UserId, Amount: betReq.Amount})
		//    cancel()
		//    if err != nil || !userResponse.HasSufficientFunds {
		//      log.Printf("[Worker %d] Apuesta rechazada (fondos) para %s", workerID, betReq.UserId)
		//      // TODO: Publicar en Message Bus (NATS/Kafka) "APUESTA_RECHAZADA"
		//      continue // Ir a la siguiente apuesta
		//    }

		// 2. LLAMAR AL SERVICIO DE EVENTOS (Python)
		//    - ¿El evento sigue abierto?
		//    - ¿Las cuotas son correctas?
		//    ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		//    eventResponse, err := s.eventClient.ValidateBet(ctx, &pb_event.ValidateRequest{...})
		//    cancel()
		//    if err != nil || !eventResponse.IsValid {
		//      log.Printf("[Worker %d] Apuesta rechazada (evento) para %s", workerID, betReq.UserId)
		//      // TODO: Reembolsar al usuario (publicar en Message Bus)
		//      continue // Ir a la siguiente apuesta
		//    }

		// 3. SI TODO ES VÁLIDO: Escribir en la Base de Datos
		//    - Escribir la apuesta en la DB de "Apuestas" (PostgreSQL, CockroachDB).
		//    - (Esta DB solo la maneja este microservicio)
		log.Printf("[Worker %d] Escribiendo apuesta de %s en la DB...", workerID, betReq.UserId)
		time.Sleep(150 * time.Millisecond) // Simulación de escritura en DB

		// 4. PUBLICAR EVENTO (Message Bus)
		//    - Publicar en NATS o Kafka: "APUESTA_ACEPTADA"
		//    - El servicio de Notificaciones (PHP) escuchará esto y enviará el aviso.
		log.Printf("[Worker %d] ¡Apuesta de %s ACEPTADA y procesada!", workerID, betReq.UserId)
	}
}

// --- Función Main (Punto de entrada) ---

func main() {
	// 1. Iniciar listener en el puerto
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("Error al escuchar en puerto: %v", err)
	}

	// 2. Crear una nueva instancia de servidor gRPC
	grpcServer := grpc.NewServer()

	// 3. Registrar nuestra implementación del servidor
	//    (Pasamos nuestro constructor 'newServer')
	pb.RegisterBettingServiceServer(grpcServer, newServer())

	log.Println("✅ Servidor gRPC de Apuestas iniciado en :50051")

	// 4. Servir peticiones
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Error al servir: %v", err)
	}
}