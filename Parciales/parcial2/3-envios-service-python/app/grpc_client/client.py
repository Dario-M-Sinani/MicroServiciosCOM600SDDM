import os
import grpc
from . import vehiculos_pb2
from . import vehiculos_pb2_grpc

# Dirección del servidor gRPC (desde .env)
GRPC_URL = os.getenv("VEHICULO_GRPC_URL", "localhost:50051")

async def verificar_disponibilidad_vehiculo(vehiculo_id: str):
    print(f"[gRPC Client] Verificando disponibilidad para ID: {vehiculo_id} en {GRPC_URL}")
    
    # Crear un canal asíncrono
    async with grpc.aio.insecure_channel(GRPC_URL) as channel:
        try:
            # Crear el "stub" (cliente)
            stub = vehiculos_pb2_grpc.VehiculoServiceStub(channel)
            
            # Crear la solicitud
            request = vehiculos_pb2.VehiculoRequest(vehiculo_id=vehiculo_id)
            
            # Llamar al método del servidor gRPC
            response = await stub.VerificarDisponibilidad(request)
            
            print(f"[gRPC Client] Respuesta recibida: {response.disponible}, {response.estado_actual}")
            return response
        except grpc.aio.AioRpcError as e:
            print(f"[gRPC Client] Error: {e.details()} (Code: {e.code()})")
            if e.code() == grpc.StatusCode.NOT_FOUND:
                raise Exception(f"Vehículo con ID {vehiculo_id} no fue encontrado")
            if e.code() == grpc.StatusCode.UNAVAILABLE:
                raise Exception(f"Servicio de vehículos no disponible en {GRPC_URL}")
            raise Exception(f"Error en gRPC: {e.details()}")