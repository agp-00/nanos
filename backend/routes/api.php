<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\SemanaController;
use App\Http\Controllers\Api\ReservaController;
use App\Services\ReservaService;


// Ruta para login
Route::post(
    '/login',
    function (Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciales incorrectas.'],
            ]);
        }

        ReservaService::limpiarTelefonos();

        return response()->json([
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => $user,
        ]);
    }
);

// Ruta para logout (requiere autenticación)
Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Sesión cerrada']);
});

// Ruta protegida: obtener datos del usuario logueado
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('productos', ProductoController::class);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('reservas', ReservaController::class);
    Route::put('/reservas/{id}/estado', [ReservaController::class, 'updateEstado']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/semanas', [SemanaController::class, 'store']);
    Route::get('/semanas', [SemanaController::class, 'index']);
});

// Ruta pública
Route::get('/semanas', [SemanaController::class, 'index']);

// routes/api.php
Route::get('/reservas/semana/{id}', [ReservaController::class, 'porSemana']);
Route::post('/reservas', [ReservaController::class, 'store']);