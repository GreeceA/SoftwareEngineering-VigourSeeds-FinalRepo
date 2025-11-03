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
        'receipt_date',
        'manufacture_date',
        'expiration_date',
        'contract_id',
        'partner_order_id',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'qty' => 'decimal:2',
        'receipt_date' => 'date',
        'manufacture_date' => 'date',
        'expiration_date' => 'date',
    ];

    /**
     * Get the product (Seed, Item, or CornProduct) that owns this transaction
     */
    public function product()
    {
        return $this->morphTo();
    }

    public function cornProduct()
    {
        return $this->belongsTo(\App\Models\CornProduct::class, 'product_id');
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

    public function seed() {
        return $this->belongsTo(Seed::class, 'product_id');
    }
    public function item() {
        return $this->belongsTo(Item::class, 'product_id');
    }
    public function partnerOrderLine() {
        return $this->belongsTo(PartnerOrderLine::class, 'partner_order_line_id');
    }
    
}