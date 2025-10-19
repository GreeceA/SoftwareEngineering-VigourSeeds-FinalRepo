<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartnerOrderLine extends Model
{
    use HasFactory;

    protected $fillable = [
        'partner_order_id',
        'product_type',
        'product_id',
        'qty',
        'unit',
        'delivered_qty',
        'price_per_unit',
    ];

    protected $casts = [
        'qty' => 'decimal:2',
        'delivered_qty' => 'decimal:2',
        'price_per_unit' => 'decimal:4',
    ];

    /**
     * Get the partner order that owns this line
     */
    public function partnerOrder()
    {
        return $this->belongsTo(PartnerOrder::class);
    }

    /**
     * Get the product (Seed, Item, or CornProduct) for this line
     */
    public function product()
    {
        return $this->morphTo();
    }

    /**
     * Calculate remaining quantity to be delivered
     */
    public function getRemainingQty()
    {
        return $this->qty - $this->delivered_qty;
    }

    /**
     * Check if line is fully delivered
     */
    public function isFullyDelivered()
    {
        return $this->delivered_qty >= $this->qty;
    }

    /**
     * Calculate line total value
     */
    public function getLineTotal()
    {
        return $this->qty * $this->price_per_unit;
    }

    /**
     * Calculate delivered value
     */
    public function getDeliveredValue()
    {
        return $this->delivered_qty * $this->price_per_unit;
    }

    /**
     * Update delivered quantity (with validation)
     */
    public function addDelivery($qty)
    {
        $newDeliveredQty = $this->delivered_qty + $qty;
        
        if ($newDeliveredQty > $this->qty) {
            throw new \Exception("Delivered quantity cannot exceed ordered quantity");
        }
        
        $this->delivered_qty = $newDeliveredQty;
        $this->save();
        
        // Update parent order status
        $this->partnerOrder->updateStatus();
        
        return $this;
    }
}