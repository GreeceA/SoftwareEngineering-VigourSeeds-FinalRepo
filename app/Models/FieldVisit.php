<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FieldVisit extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'field_visits';
    protected $primaryKey = 'field_visit_ID';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'contract_ID',
        'farm_ID',
        'user_ID',
        'date_visit',
        'status',
        'remarks',
    ];

    protected $casts = [
        'date_visit' => 'date',
    ];

    /**
     * Get the contract associated with the field visit.
     */
    public function contract()
    {
        return $this->belongsTo(Contract::class, 'contract_ID', 'id');
    }

    /**
     * Get the farm associated with the field visit.
     */
    public function farm()
    {
        return $this->belongsTo(PartnerFarm::class, 'farm_ID', 'id');
    }

    /**
     * Get the user assigned to the field visit.
     */
    public function assignee()
    {
        return $this->belongsTo(User::class, 'user_ID', 'id');
    }

    /**
     * Get all growth reports for the field visit.
     */
    public function growthReports()
    {
        return $this->hasMany(GrowthReport::class, 'field_visit_ID', 'field_visit_ID');
    }

    /**
     * Get all damage reports for the field visit.
     */
    public function damageReports()
    {
        return $this->hasMany(DamageReport::class, 'field_visit_ID', 'field_visit_ID');
    }

    /**
     * Scope for filtering by status.
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for filtering by date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date_visit', [$startDate, $endDate]);
    }

    /**
     * Check if the field visit can be edited.
     */
    public function canBeEdited(): bool
    {
        return $this->status !== 'completed';
    }

    /**
     * Check if reports can be added.
     */
    public function canAddReports(): bool
    {
        return $this->status === 'ongoing';
    }
}