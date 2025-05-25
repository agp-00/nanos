<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HorarioSemanal extends Model
{
    use HasFactory;
    protected $table = 'horarios_semanales';

    protected $fillable = [
        'semana_id',
        'dia_semana',
        'hora_inicio',
        'hora_fin',
    ];

    public function semana()
    {
        return $this->belongsTo(Semana::class);
    }
}
