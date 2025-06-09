<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Producto;

class ProductSeeder extends Seeder
{
    public function run()
    {
        Producto::create([
            'nombre' => 'Oscar',
            'cantidad' => 1,
            'categoria' => 'otro',
            'descripcion' => 'osquitar uwu follame',
        ]);
    }
}

