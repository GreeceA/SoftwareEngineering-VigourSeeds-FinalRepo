<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('contract_seed_commitments', function (Blueprint $table) { 
            $table->id();
            
            $table->foreignId('contract_id')->constrained()->onDelete('cascade');
            $table->foreignId('seed_id')->constrained()->onDelete('cascade');
            
            // --- Seed Sale Details (Revenue Tracking) ---
            $table->decimal('seed_quantity', 10, 2); 
            $table->enum('unit', ['kg', 'sack', 'ton']);
            
            // CRITICAL: The actual price partner paid for the seed (for auditing/discount tracking)
            $table->decimal('seed_price_at_contract', 10, 2); 

            
            // --- Buyback Forecast (Liability & Inventory Planning) ---

            // Number of cycles guaranteed or agreed upon
            $table->date('planting_date');
            $table->integer('agreed_cycles'); 
            
            // Calculated date (e.g., Planting Date + Growth Cycle) for the first harvest
            $table->date('expected_first_harvest_date');
            
            // CRITICAL: Total estimated quantity of corn the company is liable to buy back 
            // Amount expected ilan ang mabuyback 
            $table->integer('expected_buyback_amount'); 
            
            // The physical unit used for the harvested corn buyback
            $table->enum('buyback_unit', ['kg', 'ton']); 

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('contract_seed_commitments'); 
    }
};