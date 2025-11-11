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

    // Relationship with contact persons.
    public function contactPersons() 
    {
        return $this->hasMany(PartnerContact::class);
    }
    
    // Relationship with farms.
    public function farms()
    {
        return $this->hasMany(PartnerFarm::class);
    }

    public function contracts()
    {
        return $this->hasMany(\App\Models\Contract::class, 'partner_id');
    }
}