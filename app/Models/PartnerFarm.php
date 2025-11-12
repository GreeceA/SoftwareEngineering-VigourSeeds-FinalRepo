<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartnerFarm extends Model
{
    use HasFactory;

    protected $fillable = [
        'partner_id',
        'location_name',
        'address',
        'area_size',
        'soil_type',
    ];

    // Relationship with the partner.
    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    public function contracts()
    {
        return $this->hasMany(\App\Models\Contract::class, 'farm_id');
    }
}