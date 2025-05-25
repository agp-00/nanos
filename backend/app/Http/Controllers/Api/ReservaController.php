<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reserva;
use App\Models\Semana;
use App\Models\HorarioSemanal;
use Illuminate\Support\Carbon;


class ReservaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $request->validate([
        'nombre_cliente' => 'required|string|max:255',
        'email_cliente' => 'nullable|email|max:255',
        'telefono' => 'required|string|max:20',
        'fecha' => 'required|date',
        'hora_inicio' => 'required|date_format:H:i',
        'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
        'observaciones' => 'nullable|string|max:1000',
    ]);

    $fecha = Carbon::parse($request->fecha);
    $dia = strtolower($fecha->locale('es')->isoFormat('dddd')); // ejemplo: lunes

    // Buscar la semana activa que contiene la fecha
    $semana = Semana::where('fecha_inicio', '<=', $fecha)
                    ->where('fecha_fin', '>=', $fecha)
                    ->first();

    if (!$semana) {
        return response()->json(['error' => 'No hay horario definido para esa semana.'], 400);
    }

    // Buscar horario del día dentro de esa semana
    $horario = HorarioSemanal::where('semana_id', $semana->id)
                              ->where('dia_semana', $dia)
                              ->first();

    if (!$horario) {
        return response()->json(['error' => "No hay horario disponible para el $dia."], 400);
    }

    // Validar que la hora solicitada esté dentro del rango permitido
    if (
        $request->hora_inicio < $horario->hora_inicio ||
        $request->hora_fin > $horario->hora_fin
    ) {
        return response()->json(['error' => 'La reserva está fuera del horario permitido.'], 400);
    }

    // Guardar la reserva
    $reserva = Reserva::create([
        'nombre_cliente' => $request->nombre_cliente,
        'email_cliente' => $request->email_cliente,
        'telefono' => $request->telefono,
        'fecha' => $request->fecha,
        'hora_inicio' => $request->hora_inicio,
        'hora_fin' => $request->hora_fin,
        'estado' => 'pendiente',
        'observaciones' => $request->observaciones,
    ]);

    return response()->json($reserva, 201);
}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
