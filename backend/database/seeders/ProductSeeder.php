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
            'nombre' => 'Castillo hinchable',
            'cantidad' => 1,
            'categoria' => 'atracción',
            'descripcion' => 'Atracción de castillo hinchable',
            'imagen' => 'productos/castillohinchable.jpg',
        ]);

        Producto::create([
            'nombre' => 'Platos',
            'cantidad' => 1,
            'categoria' => 'material',
            'descripcion' => 'Plato de comida',
            'imagen' => 'productos/plato.jpg',
        ]);

        Producto::create([
            'nombre' => 'Saltador de goma',
            'cantidad' => 1,
            'categoria' => 'juguete',
            'descripcion' => 'Saltimbanquis',
            'imagen' => 'productos/saltador.webp',

        ]);

        Producto::create([
            'nombre' => 'Globos',
            'cantidad' => 1,
            'categoria' => 'otro',
            'descripcion' => 'globos hinchables',
            'imagen' => 'productos/globos.jpg',

        ]);
    }
}

