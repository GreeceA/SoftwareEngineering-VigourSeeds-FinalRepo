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
        return $this->hasMany(InventoryTransaction::class, 'product_id')
            ->where('product_type', 'items');
    }

    /**
     * Get all order lines for this item
     */
    public function orderLines()
    {
        return $this->morphMany(PartnerOrderLine::class, 'product');
    }

    public function partnerOrderLines()
    {
        // Assumes 'product_type' is 'App\Models\Item' or your morphMap name
        return $this->morphMany(PartnerOrderLine::class, 'product');
    }

    /**
     * Calculate current stock balance
     */
    public function getCurrentStock()
    {
        $inbound = InventoryTransaction::where('product_type', 'item')
            ->where('product_id', $this->id)
            ->where('transaction_type', 'inbound')
            ->sum('qty');

        $outbound = InventoryTransaction::where('product_type', 'item')
            ->where('product_id', $this->id)
            ->where('transaction_type', 'outbound')
            ->sum('qty');

        $adjustments = InventoryTransaction::where('product_type', 'item')
            ->where('product_id', $this->id)
            ->where('transaction_type', 'adjustment')
            ->sum('qty');

        return $inbound - $outbound + $adjustments; // Subtract outbound (now positive)
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