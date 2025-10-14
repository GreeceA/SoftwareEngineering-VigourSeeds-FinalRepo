<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// Use the Seed model in this file
use App\Models\Seed; 
// Use the Contract model in this file
use App\Models\Contract; 


class ContractSeedCommitment extends Model
{
    use HasFactory;

    // Renamed table (was contract_seed_items)
    protected $table = 'contract_seed_commitments'; 

    protected $fillable = [
        'contract_id',
        'seed_id',
        
        // --- Seed Sale Details ---
        'seed_quantity',            // Renamed from 'quantity'
        'unit',
        'seed_price_at_contract',   // CRITICAL: Locked price for the seed sale
        
        // --- Buyback Forecast Details ---
        'planting_date',            // NEW: Used for all harvest calculations
        'agreed_cycles',            // Renamed from 'cycles'
        'expected_first_harvest_date',
        'expected_buyback_amount',  // CRITICAL: Forecasted corn inventory
        'buyback_unit',
    ];

    protected $casts = [
        // Cast dates for easier use in PHP/JS
        'planting_date' => 'date',
        'expected_first_harvest_date' => 'date',
        
        // Cast prices/quantities for accuracy
        'seed_quantity' => 'decimal:2',
        'seed_price_at_contract' => 'decimal:2', 
        'expected_buyback_amount' => 'integer',
        'agreed_cycles' => 'integer',
    ];

    /**
     * Get the Contract associated with this commitment.
     */
    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    /**
     * Get the unique Seed associated with this commitment.
     */
    public function seed(): BelongsTo
    {
        return $this->belongsTo(Seed::class);
    }
}