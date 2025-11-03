<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CornProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'seed_id',
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
     * Get the seed that produces this corn product
     */
    public function seed(): BelongsTo
    {
        return $this->belongsTo(Seed::class);
    }

    /**
     * Get all buyback transactions for this corn product
     */
    public function buybackTransactions(): HasMany
    {
        return $this->hasMany(BuybackTransaction::class);
    }

    /**
     * Get total buyback quantity for this corn product
     */
    public function getTotalBuybackQty(): float
    {
        return $this->buybackTransactions->sum(function ($transaction) {
            return match($transaction->unit) {
                'ton' => $transaction->qty * 1000,
                'sack' => $transaction->qty * 50,
                default => $transaction->qty,
            };
        });
    }

    /**
     * Scope for active products only
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Auto-generate corn product when seed is created
     */
    public static function boot()
    {
        parent::boot();

        // Automatically create corn product when a seed is created
        Seed::created(function ($seed) {
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
    }
}