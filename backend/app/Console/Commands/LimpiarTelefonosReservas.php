<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Reserva;

class LimpiarTelefonosReservas extends Command
{
    protected $signature = 'reservas:limpiar-telefonos';
    protected $description = 'Borra los teléfonos de reservas aceptadas o rechazadas después de 24h.';

    public function handle()
    {
        $limite = now()->subDay();

        $afectadas = Reserva::whereIn('estado', ['aceptada', 'rechazada'])
            ->whereNotNull('telefono')
            ->where('updated_at', '<=', $limite)
            ->update(['telefono' => null]);

        $this->info("Teléfonos borrados en $afectadas reservas.");
    }
}
