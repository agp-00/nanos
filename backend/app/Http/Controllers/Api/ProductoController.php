<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;
use Illuminate\Support\Facades\Storage;

class ProductoController extends Controller
{
    public function index()
    {
        return Producto::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
            'cantidad' => 'required|integer|min:0|max:1000',
            'categoria' => 'nullable|string|max:100|in:juguete,material,atracción,otro',
            'imagen' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);


        $producto = Producto::create($request->except('imagen'));

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('productos', 'public');
            $producto->imagen = $path;
            $producto->save();
        }

        return response()->json($producto, 201);
    }

    public function show($id)
    {
        return Producto::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'nullable|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
            'categoria' => 'nullable|string|max:100|in:juguete,material,atracción,otro',
            'cantidad' => 'required|integer|not_in:0',
            'imagen' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $producto = Producto::findOrFail($id);

        // Actualizar campos excepto 'cantidad' e 'imagen'
        $producto->update($request->except(['cantidad', 'imagen']));

        // Sumar o restar la cantidad
        $producto->cantidad += $request->cantidad;

        if ($producto->cantidad < 0) {
            return response()->json([
                'error' => 'No se puede tener inventario negativo.'
            ], 400);
        }

        // Reemplazar imagen si se envía una nueva
        if ($request->hasFile('imagen')) {
            // Eliminar la imagen anterior si existe
            if ($producto->imagen && Storage::disk('public')->exists($producto->imagen)) {
                Storage::disk('public')->delete($producto->imagen);
            }

            // Guardar nueva imagen
            $path = $request->file('imagen')->store('productos', 'public');
            $producto->imagen = $path;
        }

        $producto->save();

        return response()->json($producto, 200);
    }


    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);

        // Eliminar imagen del disco si existe
        if ($producto->imagen && Storage::disk('public')->exists($producto->imagen)) {
            Storage::disk('public')->delete($producto->imagen);
        }

        // Eliminar producto de la base de datos
        $producto->delete();

        return response()->json(null, 204);
    }
}
