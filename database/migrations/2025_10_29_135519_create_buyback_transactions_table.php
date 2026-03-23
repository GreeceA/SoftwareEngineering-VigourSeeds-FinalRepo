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
        Schema::create('buyback_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained()->onDelete('cascade');
            $table->foreignId('corn_product_id')->constrained()->onDelete('cascade');
            $table->decimal('qty', 10, 2); // Quantity delivered
            $table->enum('unit', ['kg', 'ton', 'sack'])->default('kg');
            $table->date('delivery_date'); // When the corn was delivered
            $table->decimal('buyback_price', 10, 4)->nullable(); // Price per unit at time of delivery
            $table->decimal('total_value', 12, 2)->nullable(); // Total value of this delivery
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            // Indexes for performance
            $table->index('contract_id');
            $table->index('delivery_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buyback_transactions');
    }
};