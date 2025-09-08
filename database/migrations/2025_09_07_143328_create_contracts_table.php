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
            $table->foreignId('partner_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('contract_file')->nullable();
            $table->date('contract_date');
            $table->date('effective_date')->nullable();
            $table->date('expiration_date')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', [
                'draft', 
                'active', 
                'suspended', 
                'terminated', 
                'cancelled', 
                'archived'
            ])->default('draft');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('contracts');
    }
};