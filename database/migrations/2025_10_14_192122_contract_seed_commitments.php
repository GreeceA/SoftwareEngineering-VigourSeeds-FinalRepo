<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Create Contract Seed Commitments Table
 */
return new class extends Migration
{
    public function up()
    {
        Schema::create('contract_seed_commitments', function (Blueprint $table) {
            $table->id();
            
            // Foreign keys
            $table->foreignId('contract_id')
                ->constrained()
                ->onDelete('cascade');
            
            $table->foreignId('seed_id')
                ->constrained()
                ->onDelete('cascade');
            
            // Seed sale details (what farmer buys from company)
            $table->decimal('seed_quantity', 10, 2);
            $table->enum('unit', ['kg', 'sack', 'ton']);
            $table->decimal('seed_price_at_contract', 10, 2);
            
            // Planting and harvest planning
            $table->date('planting_date');
            $table->integer('agreed_cycles')->unsigned();
            $table->date('expected_first_harvest_date');
            
            // Buyback forecast (what company expects to buy back)
            $table->integer('expected_buyback_amount')->unsigned();
            $table->enum('buyback_unit', ['kg', 'sack', 'ton']);
            
            $table->timestamps();
            
            // Indexes for performance
            $table->index('contract_id');
            $table->index('seed_id');
            $table->index('planting_date');
            $table->index('expected_first_harvest_date');
        });
    }

    public function down()
    {
        Schema::dropIfExists('contract_seed_commitments');
    }
};