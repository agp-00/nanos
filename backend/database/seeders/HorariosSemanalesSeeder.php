<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HorariosSemanalesSeeder extends Seeder
{
    public function run()
{
    $inicio = Carbon::now()->startOfWeek()->toDateString();
    $fin = Carbon::now()->endOfWeek()->toDateString();

    // Verificar si ya existe una semana con esas fechas
    $semana = \DB::table('semanas')
        ->where('fecha_inicio', $inicio)
        ->where('fecha_fin', $fin)
        ->first();

    if (!$semana) {
        $semanaId = \DB::table('semanas')->insertGetId([
            'fecha_inicio' => $inicio,
            'fecha_fin' => $fin,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $dias = [
            ['dia_semana' => 'lunes', 'hora_inicio' => '10:00', 'hora_fin' => '18:00'],
            ['dia_semana' => 'martes', 'hora_inicio' => '10:00', 'hora_fin' => '18:00'],
            ['dia_semana' => 'miércoles', 'hora_inicio' => '10:00', 'hora_fin' => '18:00'],
            ['dia_semana' => 'jueves', 'hora_inicio' => '10:00', 'hora_fin' => '18:00'],
            ['dia_semana' => 'viernes', 'hora_inicio' => '10:00', 'hora_fin' => '20:00'],
            ['dia_semana' => 'sábado', 'hora_inicio' => '09:00', 'hora_fin' => '21:00'],
            ['dia_semana' => 'domingo', 'hora_inicio' => '09:00', 'hora_fin' => '14:00'],
        ];

        foreach ($dias as $dia) {
            \DB::table('horarios_semanales')->insert([
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


}

