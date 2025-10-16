<?php

// database/migrations/YYYY_MM_DD_HHMMSS_create_damage_reports_table.php

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
        Schema::create('damage_reports', function (Blueprint $table) {
            $table->id('damage_ID'); // Primary Key
            $table->unsignedBigInteger('field_visit_ID'); // Foreign key to FieldVisit

            // Corn Stages
            $table->enum('stage', ['Emergence', 'Vegetative', 'Tasseling', 'Silking', 'Maturity', 'Harvest'])->nullable(); 
            
            // Damage Details
            $table->enum('type_damage', ['pest', 'disease', 'weather', 'mechanical', 'other'])->nullable();
            $table->enum('severity_damage', ['low', 'medium', 'high', 'critical'])->nullable();
            
            $table->text('notes')->nullable(); // Additional details / remarks
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('field_visit_ID')->references('field_visit_ID')->on('field_visits')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('damage_reports');
    }
};