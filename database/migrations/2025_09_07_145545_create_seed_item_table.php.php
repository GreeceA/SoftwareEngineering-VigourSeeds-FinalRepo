<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('contract_seed_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained()->onDelete('cascade');
            $table->foreignId('seed_id')->constrained()->onDelete('cascade');
            $table->integer('quantity');
            $table->enum('unit', ['kg', 'sack', 'ton']);
            $table->date('expected_harvest_date');
            $table->integer('cycles');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('contract_seed_items');
    }
};