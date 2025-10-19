<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'description',
        'base_unit',
        'price_per_unit',
        'status',
    ];

    protected $casts = [
        'price_per_unit' => 'decimal:2',
    ];

    /**
     * Get all inventory transactions for this item
     */
    public function inventoryTransactions()
    {
        return $this->morphMany(InventoryTransaction::class, 'product');
    }

    /**
     * Get all order lines for this item
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
     * Check if sufficient stock is available
     */
    public function hasStock($qty)
    {
        return $this->getCurrentStock() >= $qty;
    }

    /**
     * Scope a query to only include active items.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include archived items.
     */
    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }

    /**
     * Archive the item.
     */
    public function archive()
    {
        return $this->update(['status' => 'archived']);
    }

    /**
     * Activate the item.
     */
    public function activate()
    {
        return $this->update(['status' => 'active']);
    }

    /**
     * Check if the item is active.
     */
    public function isActive()
    {
        return $this->status === 'active';
    }

    /**
     * Check if the item is archived.
     */
    public function isArchived()
    {
        return $this->status === 'archived';
    }

    public function scopeFertilizers($query)
    {
        return $query->where('type', 'fertilizer');
    }
    
    public function scopePesticides($query)
    {
        return $query->where('type', 'pesticide');
    }
}