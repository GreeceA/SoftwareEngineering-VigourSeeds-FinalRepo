<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('field_visits', function (Blueprint $table) {
            $table->id('field_visit_ID');

            // create FK columns but do NOT add the farm foreign key constraint (avoids FK errors)
            $table->foreignId('contract_ID')->constrained('contracts')->onDelete('cascade');
            $table->unsignedBigInteger('farm_ID')->nullable(); // no ->constrained()
            $table->foreignId('user_ID')->nullable()->constrained('users')->nullOnDelete();

            $table->date('date_visit');
            $table->enum('status', ['ongoing', 'completed', 'cancelled'])->default('ongoing');
            $table->text('remarks')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('field_visits');
    }
};