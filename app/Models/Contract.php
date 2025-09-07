<?php
// app/Models/Contract.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_title',
        'partner_id',
        'contract_file',
        'contract_date',
        'effective_date',
        'expiration_date',
        'seed',
        'seed_quantity',
        'unit_of_measurement',
        'expected_harvest_date',
        'notes',
        'status'
    ];

    protected $casts = [
        'contract_date' => 'date',
        'effective_date' => 'date',
        'expiration_date' => 'date',
        'expected_harvest_date' => 'date'
    ];

    // Relationship to Partner (assuming you have a Partner model)
    public function partner()
    {
        return $this->belongsTo(Partner::class);
    }

    // Placeholder relationship for future MonitoringLog model
    public function monitoringLogs()
    {
        return $this->hasMany(MonitoringLog::class);
    }

    // Define seed options for forms
    public static function getSeedOptions()
    {
        return [
            'MAIZE D30',
            'MAISWERTE',
            'MAIS-TISA',
            'KK168',
            'TEOSINTE 200'
        ];
    }

    // Define status options
    public static function getStatusOptions()
    {
        return [
            'draft' => 'Draft',
            'active' => 'Active',
            'archived' => 'Archived'
        ];
    }
}