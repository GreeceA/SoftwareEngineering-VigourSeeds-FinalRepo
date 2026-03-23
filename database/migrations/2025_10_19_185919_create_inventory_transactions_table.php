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

            // Product Link
            $table->string('product_type');
            $table->unsignedBigInteger('product_id');

            // Transaction Details
            $table->enum('transaction_type', ['inbound', 'outbound', 'adjustment']);
            $table->decimal('qty', 10, 2);
            $table->enum('unit', ['kg', 'liter', 'sack', 'ton']);
            
            // User-Selected Receipt Date (For financial accuracy)
            $table->date('receipt_date')->comment('The actual date the stock was physically received, used for inventory valuation.');
            
            // Quality Control Fields
            $table->date('manufacture_date')->nullable()->comment('Date product was manufactured/processed.');
            $table->date('expiration_date')->nullable()->comment('Date product expires. Conditional for inbound items.');

            // Optional Links
            $table->foreignId('contract_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('partner_order_id')->nullable()->constrained()->onDelete('set null');

            // Audit Fields
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            // The 'created_at' timestamp (system entry time) is provided by $table->timestamps()

            $table->timestamps(); 

            // Indexes for speed and retrieval
            $table->index(['product_type', 'product_id']);
            $table->index(['receipt_date', 'transaction_type']);
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