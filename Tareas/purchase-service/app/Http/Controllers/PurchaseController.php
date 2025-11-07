<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PurchaseController extends Controller
{
    // --- 1. Consultar Eventos Disponibles (Servicio Cliente) ---
    public function indexEvents()
    {
        // En un microservicio, la validación de JWT ocurre en el middleware.
        
        try {
            // **IMPORTANTE:** Reemplaza esta URL con la URL real de tu Servicio de Eventos
            $events_service_url = env('EVENTS_SERVICE_URL', 'http://localhost:8081/api/events');

            $response = Http::get($events_service_url);

            if ($response->successful()) {
                // Retorna la lista de eventos del otro microservicio
                return response()->json($response->json());
            }

            return response()->json(['message' => 'Error al obtener eventos del servicio de Eventos.'], 503);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Fallo la conexión con el Servicio de Eventos.'], 503);
        }
    }

    // --- 2. Realizar la Compra de Entradas (Registro) ---
    public function store(Request $request)
    {
        // 1. Validación (Asegura que los datos necesarios existan)
        $request->validate([
            'event_id' => 'required|integer',
            'quantity' => 'required|integer|min:1',
        ]);

        // 2. Mock: Obtener User ID del JWT
        // ASUNCIÓN CLAVE: Un middleware ya validó el JWT y colocó el user_id en el header.
        // Reemplazar el valor por defecto (1) por la lógica de extracción real del JWT.
        $user_id_from_jwt = (int)$request->header('X-User-ID', 1); 

        // 3. Registrar la compra
        $purchase = Purchase::create([
            'user_id' => $user_id_from_jwt,
            'event_id' => $request->event_id,
            'quantity' => $request->quantity,
            'status' => 'pending_payment', // Inicia como pendiente
        ]);

        return response()->json([
            'message' => 'Compra registrada exitosamente. Pendiente de confirmación de pago.',
            'purchase' => $purchase
        ], 201);
    }

    // --- 3. Simular la Confirmación del Pago (/pagar) ---
    public function pay(Purchase $purchase)
    {
        // 1. Revisar estado actual
        if ($purchase->status === 'paid') {
            return response()->json(['message' => 'Esta compra ya se encuentra pagada.'], 400);
        }

        // 2. Marcar la compra como pagada
        $purchase->status = 'paid';
        $purchase->save();

        // 3. Notificación (Desacoplamiento)
        // Se debe enviar un mensaje a una cola (RabbitMQ/Redis/etc.) para que el 
        // Servicio de Notificaciones lo procese.
        
        // Aquí se usaría el sistema de Queues de Laravel:
        // dispatch(new \App\Jobs\NotifyPaymentConfirmed($purchase->id, $purchase->user_id)); 

        return response()->json([
            'message' => 'Pago confirmado. El servicio de Notificaciones ha sido alertado.',
            'purchase' => $purchase
        ]);
    }
}