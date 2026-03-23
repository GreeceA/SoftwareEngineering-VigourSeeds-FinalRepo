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
        Schema::create('partner_orders', function (Blueprint $table) {
            $table->id();
            
            // Optional link to contract (for seed deliveries based on contract commitments)
            $table->foreignId('contract_id')->nullable()->constrained()->onDelete('cascade');
            
            // Link to partner
            $table->foreignId('partner_id')->constrained()->onDelete('cascade');
            
            // Order details
            $table->enum('status', ['pending', 'partially_fulfilled', 'fulfilled', 'cancelled'])->default('pending');
            $table->date('order_date')->default(now());
            $table->text('notes')->nullable();
            
            // Audit
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partner_orders');
    }
};