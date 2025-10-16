<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GrowthReport extends Model
{
    use HasFactory;

    protected $table = 'growth_reports';
    protected $primaryKey = 'growth_ID';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'field_visit_ID',
        'stage',
        'status',
        'notes',
    ];

    /**
     * Get the field visit that owns the growth report.
     */
    public function fieldVisit()
    {
        return $this->belongsTo(FieldVisit::class, 'field_visit_ID', 'field_visit_ID');
    }
}