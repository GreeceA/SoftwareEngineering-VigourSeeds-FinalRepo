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
        'soil_type_preference',
        'notes'
    ];

    protected $casts = [
        'price_per_unit' => 'decimal:2',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('seed_variety', 'like', '%' . $search . '%')
              ->orWhere('growth_cycle', 'like', '%' . $search . '%')
              ->orWhere('soil_type_preference', 'like', '%' . $search . '%');
        });
    }
}