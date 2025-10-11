<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
    use HasFactory;

    protected $fillable = [
        'partner_type',
        'name',
        'email',
        'phone',
        'address',
        'registration_number',
        'tax_id',
        'notes',
        'status',
    ];

    protected $casts = [
        'partner_type' => 'string',
        'status' => 'string',
    ];

    public function contactPersons() 
    {
    return $this->hasMany(PartnerContact::class);
    }
    
    public function farms()
    {
        return $this->hasMany(PartnerFarm::class);
    }

}