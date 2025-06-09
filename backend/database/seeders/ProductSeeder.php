<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Producto;

class ProductSeeder extends Seeder
{
    public function run()
    {
        // Admin
        Producto::create([
            'name' => 'Oscar',
            'cantidad' => 1,
            'categoria' => 'otro',
            'descripcion' => 'osquitar uwu follame',
        ]);

        // Visitante
        User::create([
            'name' => 'Visitante',
            'email' => 'visitante@nanos.com',
            'password' => Hash::make('12345678'),
            'role' => 'visitante',
        ]);
    }
}

