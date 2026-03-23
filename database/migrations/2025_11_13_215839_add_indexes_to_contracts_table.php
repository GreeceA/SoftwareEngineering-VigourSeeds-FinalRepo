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
        Schema::table('contracts', function (Blueprint $table) {
            // Add indexes for frequently queried columns
            $table->index('status');
            $table->index('contract_name');
            $table->index('signing_date');
            $table->index('effective_date');
            $table->index('expiration_date');
            $table->index(['partner_id', 'status']); // Composite index
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['contract_name']);
            $table->dropIndex(['signing_date']);
            $table->dropIndex(['effective_date']);
            $table->dropIndex(['expiration_date']);
            $table->dropIndex(['partner_id', 'status']);
        });
    }
};
