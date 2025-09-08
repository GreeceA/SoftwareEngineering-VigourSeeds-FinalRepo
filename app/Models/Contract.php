<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'partner_id',
        'title',
        'contract_file',
        'contract_date',
        'effective_date',
        'expiration_date',
        'notes',
        'status',
    ];

    protected $casts = [
        'contract_date' => 'date',
        'effective_date' => 'date',
        'expiration_date' => 'date',
    ];

    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class);
    }

    public function contractSeedItems(): HasMany
    {
        return $this->hasMany(ContractSeedItem::class);
    }

    public function canTransitionTo(string $newStatus): bool
    {
        $transitions = [
            'draft' => ['active', 'cancelled'],
            'active' => ['suspended', 'terminated', 'archived'],
            'suspended' => ['active', 'terminated'],
            'terminated' => [],
            'cancelled' => [],
            'archived' => [],
        ];

        return in_array($newStatus, $transitions[$this->status] ?? []);
    }

    public function canBeEdited(): bool
    {
        return in_array($this->status, ['draft']);
    }

    public function canBePartiallyEdited(): bool
    {
        return in_array($this->status, ['active', 'suspended']);
    }
}