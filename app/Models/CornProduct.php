<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CornProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'unit',
        'price_per_unit',
        'status',
        'notes',
    ];

    protected $casts = [
        'price_per_unit' => 'decimal:4',
    ];

    /**
     * Get all inventory transactions for this corn product
     */
    public function inventoryTransactions()
    {
        return $this->morphMany(InventoryTransaction::class, 'product');
    }

    /**
     * Get all order lines for this corn product
     */
    public function orderLines()
    {
        return $this->morphMany(PartnerOrderLine::class, 'product');
    }

    /**
     * Calculate current stock balance
     */
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
     * Scope for active products only
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}