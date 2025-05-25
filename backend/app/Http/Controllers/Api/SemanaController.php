<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Semana;
use App\Models\HorarioSemanal;


class SemanaController extends Controller
{


    public function index()
    {
        $semanas = Semana::with('horarios')->orderBy('fecha_inicio', 'desc')->get();

        return response()->json($semanas, 200);
    }



    public function store(Request $request)
    {
        $request->validate([
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'horarios' => 'required|array|size:7',
            'horarios.*.dia_semana' => 'required|string|in:lunes,martes,miércoles,jueves,viernes,sábado,domingo',
            'horarios.*.hora_inicio' => 'required|date_format:H:i',
            'horarios.*.hora_fin' => 'required|date_format:H:i|after:horarios.*.hora_inicio',
        ]);

        // Verificar que no exista una semana con las mismas fechas
        $existe = Semana::where('fecha_inicio', $request->fecha_inicio)
            ->where('fecha_fin', $request->fecha_fin)
            ->first();

        if ($existe) {
            return response()->json(['error' => 'Ya existe una semana con ese rango.'], 400);
        }

        $semana = Semana::create([
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
        ]);

        foreach ($request->horarios as $dia) {
            HorarioSemanal::create([
                'semana_id' => $semana->id,
                'dia_semana' => $dia['dia_semana'],
                'hora_inicio' => $dia['hora_inicio'],
                'hora_fin' => $dia['hora_fin'],
            ]);
        }

        return response()->json(['semana' => $semana->load('horarios')], 201);
    }

}
