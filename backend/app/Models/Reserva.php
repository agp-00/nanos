<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre_cliente',
        'email_cliente',
        'telefono',
        'fecha',
        'hora_inicio',
        'hora_fin',
        'estado',
        'observaciones',
    ];
}
