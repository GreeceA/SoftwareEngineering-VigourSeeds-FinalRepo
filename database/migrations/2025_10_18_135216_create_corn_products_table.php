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
        Schema::create('corn_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seed_id')->constrained('partner_farms')->onDelete('cascade'); 
            $table->string('name'); // e.g., "White Corn", "Yellow Corn"
            $table->enum('unit', ['kg', 'ton'])->default('kg');
            $table->decimal('price_per_unit', 10, 4)->nullable(); // Default buyback price reference
            $table->enum('status', ['active', 'archived'])->default('active');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('corn_products');
    }
};