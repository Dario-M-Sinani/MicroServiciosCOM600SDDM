<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtAuthMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        // 1. Verificar si existe el token
        if (!$token) {
            return response()->json(['message' => 'Acceso denegado. Token no proporcionado.'], 401);
        }

        // 2. Simulación de Validación y Extracción (Reemplazar con lógica JWT real)
        // En una aplicación real, se usaría un paquete JWT para decodificar y validar.
        // Si el token es válido, extraemos el ID del usuario y lo pasamos al controlador
        // a través de un Header personalizado o un atributo del Request.

        // Mock: Si el token existe, asumimos que es válido y usamos un ID fijo o lo extraemos de forma simulada.
        // Para pruebas, asumimos que el user ID es 1.
        $user_id = 1; 

        // Colocar el ID en un header para que el controlador pueda usarlo
        $request->headers->set('X-User-ID', $user_id); 
        
        return $next($request);
    }
}