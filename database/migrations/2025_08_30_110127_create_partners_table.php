<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->enum('partner_type', ['individual', 'organization']);
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->text('address');
            $table->string('registration_number')->nullable();
            $table->string('tax_id')->nullable();
            $table->longText('notes')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};