<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BuybackTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'corn_product_id',
        'qty',
        'unit',
        'delivery_date',
        'buyback_price',
        'total_value',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'delivery_date' => 'date',
        'qty' => 'decimal:2',
        'buyback_price' => 'decimal:4',
        'total_value' => 'decimal:2',
    ];

    /**
     * Get the contract this transaction belongs to
     */
    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    /**
     * Get the corn product for this transaction
     */
    public function cornProduct(): BelongsTo
    {
        return $this->belongsTo(CornProduct::class);
    }

    /**
     * Get the user who created this transaction
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Convert quantity to kg
     */
    public function getQtyInKgAttribute(): float
    {
        return match($this->unit) {
            'ton' => $this->qty * 1000,
            'sack' => $this->qty * 50,
            default => $this->qty,
        };
    }
}