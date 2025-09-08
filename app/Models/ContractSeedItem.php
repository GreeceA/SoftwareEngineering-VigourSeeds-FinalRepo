<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContractSeedItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'seed_id',
        'quantity',
        'unit',
        'expected_harvest_date',
        'cycles',
    ];

    protected $casts = [
        'expected_harvest_date' => 'date',
        'quantity' => 'integer',
        'cycles' => 'integer',
    ];

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    public function seed(): BelongsTo
    {
        return $this->belongsTo(Seed::class);
    }
}