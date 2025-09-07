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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('contract_title');
            $table->foreignId('partner_id')->constrained('partners')->onDelete('cascade');
            $table->string('contract_file'); // Path to uploaded file
            $table->date('contract_date');
            $table->date('effective_date');
            $table->date('expiration_date');
            $table->enum('seed', ['MAIZE D30', 'MAISWERTE', 'MAIS-TISA', 'KK168', 'TEOSINTE 200']);
            $table->integer('seed_quantity');
            $table->string('unit_of_measurement');
            $table->date('expected_harvest_date');
            $table->longText('notes')->nullable();
            $table->string('status')->default('draft'); // draft, active, archived
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};