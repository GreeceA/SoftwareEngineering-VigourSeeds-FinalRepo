<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class ContractSeedCommitment extends Model
{
    use HasFactory;

    protected $table = 'contract_seed_commitments'; 

    protected $fillable = [
        'contract_id',
        'seed_id',
        'seed_quantity',
        'unit',
        'seed_price_at_contract',
        'planting_date',
        'agreed_cycles',
        'expected_first_harvest_date',
        'expected_buyback_amount',
        'buyback_unit',
    ];

    protected $casts = [
        'planting_date' => 'date',
        'expected_first_harvest_date' => 'date',
        'seed_quantity' => 'decimal:2',
        'seed_price_at_contract' => 'decimal:2', 
        'expected_buyback_amount' => 'integer',
        'agreed_cycles' => 'integer',
    ];

    // Relationships
    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    public function seed(): BelongsTo
    {
        return $this->belongsTo(Seed::class);
    }

    // Calculation Methods
    public function getTotalSeedCost(): float
    {
        return $this->seed_quantity * $this->seed_price_at_contract;
    }

    public function getExpectedHarvestDates(): array
    {
        if (!$this->planting_date || !$this->seed->growth_cycle || $this->agreed_cycles <= 0) {
            return [];
        }

        $dates = [];
        $harvestDate = $this->expected_first_harvest_date;
        
        for ($i = 0; $i < $this->agreed_cycles; $i++) {
            $dates[] = $harvestDate->copy();
            $harvestDate = $harvestDate->addDays($this->seed->growth_cycle);
        }

        return $dates;
    }

    public function getNextExpectedHarvestDate(): ?Carbon
    {
        $harvestDates = $this->getExpectedHarvestDates();
        
        foreach ($harvestDates as $date) {
            if ($date->isFuture()) {
                return $date;
            }
        }

        return null;
    }

    public function getTotalBuybackValue(): float
    {
        return $this->expected_buyback_amount * $this->contract->buyback_price_per_unit;
    }

    public function getProfitMarginEstimate(): float
    {
        $buybackValue = $this->getTotalBuybackValue();
        $seedCost = $this->getTotalSeedCost();
        
        if ($seedCost <= 0) {
            return 0;
        }

        return (($buybackValue - $seedCost) / $seedCost) * 100;
    }

    // Validation Methods
    public function isPlantingDateValid(): bool
    {
        if (!$this->planting_date || !$this->contract->effective_date || !$this->contract->expiration_date) {
            return false;
        }

        return $this->planting_date->between(
            $this->contract->effective_date,
            $this->contract->expiration_date
        );
    }

    public function isHarvestDateValid(): bool
    {
        if (!$this->expected_first_harvest_date || !$this->contract->expiration_date) {
            return false;
        }

        return $this->expected_first_harvest_date->lessThanOrEqualTo($this->contract->expiration_date);
    }

    public function getMaxPossibleCycles(): int
    {
        if (!$this->planting_date || !$this->contract->expiration_date || !$this->seed->growth_cycle) {
            return 1;
        }

        $totalDays = $this->planting_date->diffInDays($this->contract->expiration_date);
        $maxCycles = floor($totalDays / $this->seed->growth_cycle);

        return max(1, $maxCycles);
    }

    // Accessors
    public function getSeedQuantityFormattedAttribute(): string
    {
        return number_format($this->seed_quantity, 2) . ' ' . strtoupper($this->unit);
    }

    public function getExpectedBuybackFormattedAttribute(): string
    {
        return number_format($this->expected_buyback_amount) . ' ' . strtoupper($this->buyback_unit);
    }

    public function getSeedPriceFormattedAttribute(): string
    {
        return '₱' . number_format($this->seed_price_at_contract, 2);
    }

    // Boot Method
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($commitment) {
            // Ensure cycles don't exceed maximum possible
            $maxCycles = $commitment->getMaxPossibleCycles();
            if ($commitment->agreed_cycles > $maxCycles) {
                $commitment->agreed_cycles = $maxCycles;
            }
        });
    }
}