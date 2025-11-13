<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'partner_id',
        'farm_id',
        'contract_name', 
        'contract_file',
        'original_file_name',
        'signing_date', 
        'effective_date',
        'expiration_date',
        'buyback_price_per_unit',
        'notes',
        'status',
    ];

    protected $casts = [
        'signing_date' => 'date', 
        'effective_date' => 'date',
        'expiration_date' => 'date',
        'buyback_price_per_unit' => 'decimal:4',
    ];

    // Relationships
    public function partner()
    {
        return $this->belongsTo(Partner::class, 'partner_id');
    }

    public function farm(): BelongsTo
    {
        return $this->belongsTo(PartnerFarm::class, 'farm_id');
    }

    public function contractSeedCommitments(): HasMany
    {
        return $this->hasMany(ContractSeedCommitment::class);
    }

    public function seedCommitments(): HasMany
    {
        return $this->hasMany(ContractSeedCommitment::class);
    }

    public function partnerOrders(): HasMany
    {
        return $this->hasMany(PartnerOrder::class);
    }

    public function buybackTransactions(): HasMany
    {
        return $this->hasMany(BuybackTransaction::class);
    }

    // Status Transition Logic
    public function canTransitionTo(string $newStatus): bool
    {
        $transitions = [
            'draft' => ['under_review', 'cancelled'],
            'under_review' => ['draft', 'active', 'cancelled'],
            'active' => ['suspended', 'terminated', 'completed'],
            'suspended' => ['active', 'terminated'], 
            'terminated' => ['completed'],
            'cancelled' => ['completed'],
            'completed' => [], 
        ];

        return in_array($newStatus, $transitions[$this->status] ?? []);
    }

    public function fieldVisits(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(FieldVisit::class, 'contract_ID', 'id');
    }
    
    public function canBeEdited(): bool
    {
        return in_array($this->status, ['draft', 'under_review']);
    }
    
    public function canBePartiallyEdited(): bool
    {
        return in_array($this->status, ['active', 'suspended']);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    // Buyback Tracking Methods
    public function getTotalExpectedBuyback(): float
    {
        return $this->seedCommitments->sum('expected_buyback_amount');
    }

    public function getTotalActualBuyback(): float
    {
        // Sum all buyback transactions in kg
        return $this->buybackTransactions->sum(function ($transaction) {
            return match($transaction->unit) {
                'ton' => $transaction->qty * 1000,
                'sack' => $transaction->qty * 50,
                default => $transaction->qty,
            };
        });
    }

    public function getBuybackFulfillmentPercentage(): float
    {
        $expected = $this->getTotalExpectedBuyback();
        $actual = $this->getTotalActualBuyback();
        
        return $expected > 0 ? round(($actual / $expected) * 100, 2) : 0;
    }

    public function getRemainingBuyback(): float
    {
        return max(0, $this->getTotalExpectedBuyback() - $this->getTotalActualBuyback());
    }

    public function isBuybackComplete(): bool
    {
        return $this->getRemainingBuyback() <= 0;
    }

    // Date Validation Methods
    public function isExpired(): bool
    {
        return $this->expiration_date && $this->expiration_date->isPast();
    }

    public function isEffective(): bool
    {
        return $this->effective_date && 
               $this->effective_date->isPast() && 
               (!$this->expiration_date || $this->expiration_date->isFuture());
    }

    public function getDaysUntilExpiration(): ?int
    {
        if (!$this->expiration_date) {
            return null;
        }
        return max(0, now()->diffInDays($this->expiration_date, false));
    }

    // Query Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', 'draft');
    }

    public function scopeUnderReview(Builder $query): Builder
    {
        return $query->where('status', 'under_review');
    }

    public function scopeExpiringSoon(Builder $query, int $days = 30): Builder
    {
        return $query->where('status', 'active')
            ->whereDate('expiration_date', '<=', now()->addDays($days))
            ->whereDate('expiration_date', '>=', now());
    }

    public function scopeByPartner(Builder $query, int $partnerId): Builder
    {
        return $query->where('partner_id', $partnerId);
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('contract_name', 'like', "%{$search}%")
              ->orWhereHas('partner', function ($q) use ($search) {
                  $q->where('name', 'like', "%{$search}%");
              })
              ->orWhereHas('seedCommitments.seed', function ($q) use ($search) {
                  $q->where('seed_variety', 'like', "%{$search}%");
              });
        });
    }

    // Accessors
    public function getStatusLabelAttribute(): string
    {
        return ucwords(str_replace('_', ' ', $this->status));
    }

    public function getContractDurationAttribute(): ?int
    {
        if (!$this->effective_date || !$this->expiration_date) {
            return null;
        }
        return $this->effective_date->diffInDays($this->expiration_date);
    }

    // Boot Method for Model Events
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($contract) {
            // Ensure draft status if not set
            if (!$contract->status) {
                $contract->status = 'draft';
            }
        });

        static::deleting(function ($contract) {
            // Cascade delete commitments and buyback transactions
            $contract->contractSeedCommitments()->delete();
            $contract->buybackTransactions()->delete();
        });
    }
}