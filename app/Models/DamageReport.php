<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DamageReport extends Model
{
    use HasFactory;

    protected $table = 'damage_reports';
    protected $primaryKey = 'damage_ID';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'field_visit_ID',
        'stage',
        'type_damage',
        'severity_damage',
        'notes',
    ];

    /**
     * Get the field visit that owns the damage report.
     */
    public function fieldVisit()
    {
        return $this->belongsTo(FieldVisit::class, 'field_visit_ID', 'field_visit_ID');
    }
}