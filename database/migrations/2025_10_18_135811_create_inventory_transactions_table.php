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
        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();
            
            // Polymorphic relationship to product (Seed, Item, or CornProduct)
            $table->string('product_type'); // e.g., 'App\Models\Seed'
            $table->unsignedBigInteger('product_id');
            
            // Transaction details
            $table->enum('transaction_type', ['inbound', 'outbound', 'adjustment']);
            $table->decimal('qty', 10, 2);
            $table->enum('unit', ['kg', 'liter', 'sack', 'ton']);
            
            // Optional links to contract and partner orders
            $table->foreignId('contract_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('partner_order_id')->nullable()->constrained()->onDelete('set null');
            
            // Audit fields
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            
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
        Schema::dropIfExists('inventory_transactions');
    }
};