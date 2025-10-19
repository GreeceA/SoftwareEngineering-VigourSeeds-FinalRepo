<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        $inbound = $this->inventoryTransactions()
            ->where('transaction_type', 'inbound')
            ->sum('qty');
        
        $outbound = $this->inventoryTransactions()
            ->where('transaction_type', 'outbound')
            ->sum('qty');
        
        $adjustments = $this->inventoryTransactions()
            ->where('transaction_type', 'adjustment')
            ->sum('qty');
        
        return $inbound - $outbound + $adjustments;
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
}