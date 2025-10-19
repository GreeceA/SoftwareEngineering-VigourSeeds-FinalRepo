<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartnerOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'partner_id',
        'status',
        'order_date',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'order_date' => 'date',
    ];

    /**
     * Get the contract associated with this order
     */
    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }

    /**
     * Get the partner associated with this order
     */
    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    /**
     * Get all order lines for this order
     */
    public function lines()
    {
        return $this->hasMany(PartnerOrderLine::class);
    }

    /**
     * Get all inventory transactions linked to this order
     */
    public function inventoryTransactions()
    {
        return $this->hasMany(InventoryTransaction::class);
    }

    /**
     * Get the user who created this order
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Calculate total order value
     */
    public function getTotalValue()
    {
        return $this->lines->sum(function ($line) {
            return $line->qty * $line->price_per_unit;
        });
    }

    /**
     * Check if order is fully fulfilled
     */
    public function isFullyFulfilled()
    {
        return $this->lines->every(function ($line) {
            return $line->delivered_qty >= $line->qty;
        });
    }

    /**
     * Calculate fulfillment percentage
     */
    public function getFulfillmentPercentage()
    {
        $totalQty = $this->lines->sum('qty');
        $deliveredQty = $this->lines->sum('delivered_qty');
        
        return $totalQty > 0 ? ($deliveredQty / $totalQty) * 100 : 0;
    }

    /**
     * Update order status based on fulfillment
     */
    public function updateStatus()
    {
        if ($this->status === 'cancelled') {
            return;
        }

        if ($this->isFullyFulfilled()) {
            $this->status = 'fulfilled';
        } elseif ($this->lines->sum('delivered_qty') > 0) {
            $this->status = 'partially_fulfilled';
        } else {
            $this->status = 'pending';
        }
        
        $this->save();
    }

    /**
     * Scope for pending orders
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for fulfilled orders
     */
    public function scopeFulfilled($query)
    {
        return $query->where('status', 'fulfilled');
    }
}