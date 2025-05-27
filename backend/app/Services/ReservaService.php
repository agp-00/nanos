<?php

namespace App\Services;

use App\Models\Reserva;
use Illuminate\Support\Facades\Log;

class ReservaService
{
    public static function limpiarTelefonos()
    {
        $limite = now()->subDay();

        $afectadas = Reserva::whereIn('estado', ['aceptada', 'rechazada'])
            ->whereNotNull('telefono')
            ->where('updated_at', '<=', $limite)
            ->update(['telefono' => null]);

        Log::info("Teléfonos borrados automáticamente: $afectadas");
    }
}
