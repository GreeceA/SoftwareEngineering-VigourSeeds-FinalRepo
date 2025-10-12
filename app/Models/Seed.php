<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seed extends Model
{
    use HasFactory;

    protected $fillable = [
        'seed_variety',
        'status',
        'price_per_unit',
        'growth_cycle',
        'storage_requirements',
        'soil_type',
        'notes',
    ];

    protected $casts = [
        'price_per_unit' => 'decimal:2',
    ];

    // Filter for active records.
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Filter for archived records.
    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }

    // Search across key fields.
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('seed_variety', 'like', '%' . $search . '%')
                ->orWhere('growth_cycle', $search)
                ->orWhere('soil_type', 'like', '%' . $search . '%');
        });
    }
}