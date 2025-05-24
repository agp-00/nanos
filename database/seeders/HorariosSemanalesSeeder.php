<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HorariosSemanalesSeeder extends Seeder
{
    public function run()
    {
        // Creamos una semana actual
        $inicio = Carbon::now()->startOfWeek(); // lunes
        $fin = Carbon::now()->endOfWeek(); // domingo

        $semanaId = DB::table('semanas')->insertGetId([
            'fecha_inicio' => $inicio->toDateString(),
            'fecha_fin' => $fin->toDateString(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $dias = [
            ['dia_semana' => 'lunes', 'hora_inicio' => '10:00:00', 'hora_fin' => '18:00:00'],
            ['dia_semana' => 'martes', 'hora_inicio' => '10:00:00', 'hora_fin' => '18:00:00'],
            ['dia_semana' => 'miércoles', 'hora_inicio' => '10:00:00', 'hora_fin' => '18:00:00'],
            ['dia_semana' => 'jueves', 'hora_inicio' => '10:00:00', 'hora_fin' => '18:00:00'],
            ['dia_semana' => 'viernes', 'hora_inicio' => '10:00:00', 'hora_fin' => '21:00:00'],
            ['dia_semana' => 'sábado', 'hora_inicio' => '09:00:00', 'hora_fin' => '21:00:00'],
            ['dia_semana' => 'domingo', 'hora_inicio' => '09:00:00', 'hora_fin' => '14:00:00'],
        ];

        foreach ($dias as $dia) {
            DB::table('horarios_semanales')->insert([
                'semana_id' => $semanaId,
                'dia_semana' => $dia['dia_semana'],
                'hora_inicio' => $dia['hora_inicio'],
                'hora_fin' => $dia['hora_fin'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}

