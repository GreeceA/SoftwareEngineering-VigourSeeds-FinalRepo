<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Seed extends Model
{
    use HasFactory;

    protected $fillable = [
        'seed_variety',
        'status',
        'price_per_unit',
        'growth_cycle',
        'storage_requirements',
        'soil_type',
        'notes',
    ];

    protected $casts = [
        'price_per_unit' => 'decimal:2',
        'growth_cycle' => 'integer',
    ];

    // Filter for active records.
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function contractSeeds()
    {
        return $this->hasMany(ContractSeedCommitment::class);
    }

    public function inventoryTransactions()
    {
        return $this->morphMany(InventoryTransaction::class, 'product');
    }

    public function orderLines()
    {
        return $this->morphMany(PartnerOrderLine::class, 'product');
    }

     public function getCurrentStock()
    {
        $transactions = \App\Models\InventoryTransaction::where('product_type', 'Seed')
            ->where('product_id', $this->id)
            ->get();

        $stock = 0;
        foreach ($transactions as $txn) {
            $qty = $txn->qty;
            // Convert to kg if needed
            if ($txn->unit === 'sack') {
                $qty = $qty * 50;
            } elseif ($txn->unit === 'ton') {
                $qty = $qty * 1000;
            }
            if ($txn->transaction_type === 'inbound') {
                $stock += abs($qty); // Always positive
            } elseif ($txn->transaction_type === 'outbound') {
                $stock -= abs($qty); // Always subtract positive value
            } elseif ($txn->transaction_type === 'adjustment') {
                $stock += $qty; // ✅ Keep the sign - can be positive or negative
            }
        }
        return $stock; // in kg
    }
    
    /**
     * Check if sufficient stock is available
     */
    public function hasStock($qty)
    {
        return $this->getCurrentStock() >= $qty;
    }

    
    // Filter for archived records.
    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }

    // Search across key fields.
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('seed_variety', 'like', '%' . $search . '%')
                ->orWhere('growth_cycle', $search)
                ->orWhere('soil_type', 'like', '%' . $search . '%');
        });
    }

    public function cornProduct(): HasOne
    {
        return $this->hasOne(CornProduct::class);
    }

    public function contractCommitments()
    {
        return $this->hasMany(ContractSeedCommitment::class);
    }
    
    protected static function boot()
    {
        parent::boot();

        static::created(function ($seed) {
            CornProduct::firstOrCreate(
                ['seed_id' => $seed->id],
                [
                    'name' => $seed->seed_variety . ' Corn',
                    'unit' => 'kg',
                    'status' => 'active',
                    'notes' => 'Auto-generated from seed: ' . $seed->seed_variety,
                ]
            );
        });

        // Update corn product when seed is updated
        static::updated(function ($seed) {
            $seed->cornProduct?->update([
                'name' => $seed->seed_variety . ' Corn',
                'status' => $seed->status,
            ]);
        });
    }
}