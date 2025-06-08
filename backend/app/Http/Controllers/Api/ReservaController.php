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
        return Reserva::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_cliente' => 'required|string|max:255',
            'email_cliente' => 'nullable|email:rfc,dns|max:255',
            'telefono' => ['required', 'string', 'max:20', 'regex:/^[0-9+\s()-]{7,20}$/'],
            'fecha' => 'required|date',
            'hora_inicio' => 'required|date_format:H:i:s',
            'hora_fin' => 'required|date_format:H:i:s|after:hora_inicio',
            'observaciones' => 'nullable|string|max:1000',
        ]);

        try {
            $fecha = Carbon::parse($request->fecha);
            $dia = strtolower($fecha->locale('es')->isoFormat('dddd')); // ejemplo: lunes

            $semana = Semana::where('fecha_inicio', '<=', $fecha)
                ->where('fecha_fin', '>=', $fecha)
                ->first();

            if (!$semana) {
                return response()->json([
                    'error' => 'No hay semana activa para la fecha seleccionada.'
                ], 400);
            }

            $horario = HorarioSemanal::where('semana_id', $semana->id)
                ->where('dia_semana', $dia)
                ->first();

            if (!$horario) {
                return response()->json([
                    'error' => "No hay horario disponible para el día: $dia."
                ], 400);
            }

            // Convertir horas con Carbon
            $inicio = Carbon::createFromFormat('H:i:s', $request->hora_inicio);
            $fin = Carbon::createFromFormat('H:i:s', $request->hora_fin);
            $inicioHorario = Carbon::createFromFormat('H:i:s', $horario->hora_inicio);
            $finHorario = Carbon::createFromFormat('H:i:s', $horario->hora_fin);

            \Log::info('Comparando horas', [
                'inicio' => $inicio->format('H:i:s'),
                'fin' => $fin->format('H:i:s'),
                'inicioHorario' => $inicioHorario->format('H:i:s'),
                'finHorario' => $finHorario->format('H:i:s'),
            ]);


            // Verificar rango horario
            if ($inicio->lt($inicioHorario) || $fin->gt($finHorario)) {
                return response()->json([
                    'error' => "Las horas deben estar dentro del horario permitido: {$inicioHorario->format('H:i')} - {$finHorario->format('H:i')}"
                ], 400);
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

            return response()->json([
                'message' => 'Reserva registrada correctamente.',
                'reserva' => $reserva
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error interno al procesar la reserva.',
                'detalle' => $e->getMessage()
            ], 500);
        }
    }


    public function porSemana($id)
    {
        $semana = Semana::findOrFail($id);
        $reservas = Reserva::whereBetween('fecha', [$semana->fecha_inicio, $semana->fecha_fin])->get();
        return response()->json($reservas);
    }
    public function updateEstado(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:pendiente,aceptada,rechazada',
        ]);

        $reserva = Reserva::findOrFail($id);
        $reserva->estado = $request->estado;
        $reserva->save();

        return response()->json(['message' => 'Estado actualizado correctamente']);
    }



}
