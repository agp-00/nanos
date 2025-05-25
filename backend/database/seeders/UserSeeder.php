<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@nanos.com',
            'password' => Hash::make('12345678'),
            'role' => 'admin',
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

