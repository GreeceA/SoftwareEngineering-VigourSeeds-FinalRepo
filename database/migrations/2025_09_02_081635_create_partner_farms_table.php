<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partner_farms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partner_id')->constrained('partners')->onDelete('cascade');
            $table->string('location_name');
            $table->text('address');
            $table->decimal('area_size', 10, 2)->nullable();
            $table->enum('soil_type', ['clay', 'sandy', 'loam', 'silty']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partner_farms');
    }
};
