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
        Schema::create('partner_order_lines', function (Blueprint $table) {
            $table->id();
            
            // Link to parent order
            $table->foreignId('partner_order_id')->constrained()->onDelete('cascade');
            
            // Polymorphic relationship to product (Seed, Item, or CornProduct)
            $table->string('product_type'); // e.g., 'App\Models\Seed'
            $table->unsignedBigInteger('product_id');
            
            // Line details
            $table->decimal('qty', 10, 2); // Committed quantity for this line
            $table->enum('unit', ['kg', 'liter', 'sack', 'ton']);
            $table->decimal('delivered_qty', 10, 2)->default(0); // Track partial deliveries
            $table->decimal('price_per_unit', 10, 4); // Price at time of order
            
            $table->timestamps();
            
            // Index for polymorphic relationship
            $table->index(['product_type', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partner_order_lines');
    }
};