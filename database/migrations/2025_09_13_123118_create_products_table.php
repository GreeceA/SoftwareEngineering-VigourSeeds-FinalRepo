<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('seeds', function (Blueprint $table) {
            $table->id();
            $table->string('product_name');
            $table->enum('category', ['Fertilizers', 'Pesticides']);
            $table->enum('status', ['active', 'archived'])->default('active');
            $table->decimal('price_per_unit', 10, 2);
            $table->integer('growth_cycle');
            $table->string('storage_requirements');
            $table->string('soil_type_preference');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seeds');
    }
};