<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'description',
        'base_unit',
        'price_per_unit',
        'status',
    ];

    protected $casts = [
        'price_per_unit' => 'decimal:2',
    ];

    /**
     * Scope a query to only include active items.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include archived items.
     */
    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }

    /**
     * Archive the item.
     */
    public function archive()
    {
        return $this->update(['status' => 'archived']);
    }

    /**
     * Activate the item.
     */
    public function activate()
    {
        return $this->update(['status' => 'active']);
    }

    /**
     * Check if the item is active.
     */
    public function isActive()
    {
        return $this->status === 'active';
    }

    /**
     * Check if the item is archived.
     */
    public function isArchived()
    {
        return $this->status === 'archived';
    }
}