<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_type',
        'product_id',
        'transaction_type',
        'qty',
        'unit',
        'contract_id',
        'partner_order_id',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'qty' => 'decimal:2',
    ];

    /**
     * Get the product (Seed, Item, or CornProduct) that owns this transaction
     */
    public function product()
    {
        return $this->morphTo();
    }

    /**
     * Get the contract associated with this transaction
     */
    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }

    /**
     * Get the partner order associated with this transaction
     */
    public function partnerOrder()
    {
        return $this->belongsTo(PartnerOrder::class);
    }

    /**
     * Get the user who created this transaction
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope for inbound transactions
     */
    public function scopeInbound($query)
    {
        return $query->where('transaction_type', 'inbound');
    }

    /**
     * Scope for outbound transactions
     */
    public function scopeOutbound($query)
    {
        return $query->where('transaction_type', 'outbound');
    }

    /**
     * Scope for adjustment transactions
     */
    public function scopeAdjustment($query)
    {
        return $query->where('transaction_type', 'adjustment');
    }

    /**
     * Scope for specific product type
     */
    public function scopeForProductType($query, $type)
    {
        return $query->where('product_type', $type);
    }
}