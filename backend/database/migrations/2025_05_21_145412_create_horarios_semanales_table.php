<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('horarios_semanales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('semana_id')->constrained('semanas')->onDelete('cascade');
            $table->string('dia_semana'); // lunes, martes, etc.
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('horarios_semanales');
    }
};
