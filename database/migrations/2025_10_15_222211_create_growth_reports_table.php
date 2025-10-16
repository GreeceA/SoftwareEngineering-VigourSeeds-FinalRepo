<?php

// database/migrations/YYYY_MM_DD_HHMMSS_create_growth_reports_table.php

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
        Schema::create('growth_reports', function (Blueprint $table) {
            $table->id('growth_ID'); // Primary Key
            $table->unsignedBigInteger('field_visit_ID'); // Foreign key to FieldVisit

            // Corn Stages
            $table->enum('stage', ['Emergence', 'Vegetative', 'Tasseling', 'Silking', 'Maturity', 'Harvest'])->nullable(); 
            
            // Growth Status
            $table->enum('status', ['excellent', 'good', 'average', 'poor'])->nullable();
            
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
        Schema::dropIfExists('growth_reports');
    }
};
