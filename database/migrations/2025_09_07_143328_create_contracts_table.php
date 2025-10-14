<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            
            // Link to Partner (REQUIRED)
            $table->foreignId('partner_id')->constrained()->onDelete('cascade');
            
            // CRITICAL NEW FIELD: Link to the specific Partner Farm where the contract will be executed
            $table->foreignId('farm_id')->constrained('partner_farms')->onDelete('cascade'); 
            
            $table->string('contract_name'); 
            
            // Contract Files are REQUIRED
            $table->string('contract_file');
            $table->string('original_file_name');
            
            $table->date('signing_date'); 
            $table->date('effective_date')->nullable();
            $table->date('expiration_date')->nullable();
            
            // CRITICAL: Buyback price committed (high precision)
            $table->decimal('buyback_price_per_unit', 10, 4); 

            $table->text('notes')->nullable();
            $table->enum('status', [
                'draft', 
                'under_review', 
                'active', 
                'suspended', 
                'terminated', 
                'cancelled', 
                'completed'
            ])->default('draft');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('contracts');
    }
};