<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class CustomAuthenticate extends Middleware
{
    protected function redirectTo($request)
    {
        return null; // 👈 Evita la redirección al login en APIs
    }
}
