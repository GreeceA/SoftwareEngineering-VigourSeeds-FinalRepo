<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

// Ensure PartnerFarm model is imported
use App\Models\PartnerFarm; 

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'partner_id',
        'farm_id', // <-- ADDED: Essential link to the planting location
        'contract_name', 
        'contract_file',
        'original_file_name',
        'signing_date', 
        'effective_date',
        'expiration_date',
        'buyback_price_per_unit',
        'notes',
        'status',
    ];

    protected $casts = [
        'signing_date' => 'date', 
        'effective_date' => 'date',
        'expiration_date' => 'date',
        'buyback_price_per_unit' => 'decimal:4', 
    ];

    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class);
    }

    /**
     * Get the Farm associated with this contract.
     */
    public function farm(): BelongsTo // <-- ADDED: Farm relationship
    {
        return $this->belongsTo(PartnerFarm::class, 'farm_id'); // Specify foreign key if model name is different
    }

    public function contractSeedCommitments(): HasMany
    {
        // Assumes ContractSeedCommitment model name is correct
        return $this->hasMany(ContractSeedCommitment::class);
    }

    // ------------------------------------------------------------------
    // STATUS LOGIC (No changes needed here, logic is correct)
    // ------------------------------------------------------------------

    public function canTransitionTo(string $newStatus): bool
    {
        $transitions = [
            'draft' => ['under_review', 'cancelled'],
            'under_review' => ['draft', 'active', 'cancelled'],
            'active' => ['suspended', 'terminated', 'completed'],
            'suspended' => ['active', 'terminated'], 
            'terminated' => ['completed'],
            'cancelled' => ['completed'],
            'completed' => [], 
        ];

        return in_array($newStatus, $transitions[$this->status] ?? []);
    }

    public function canBeEdited(): bool
    {
        return in_array($this->status, ['draft', 'under_review']);
    }
    
    public function canBePartiallyEdited(): bool
    {
        return in_array($this->status, ['active', 'suspended']);
    }

    /**
     * Get all partner orders linked to this contract
     */
    public function partnerOrders()
    {
        return $this->hasMany(PartnerOrder::class);
    }

    /**
     * Get all inventory transactions linked to this contract
     */
    public function inventoryTransactions()
    {
        return $this->hasMany(InventoryTransaction::class);
    }

    /**
     * Get total expected buyback amount across all seed commitments
     */
    public function getTotalExpectedBuyback()
    {
        return $this->seedCommitments->sum('expected_buyback_amount');
    }

    /**
     * Get total actual buyback received (corn inbound transactions)
     */
    public function getTotalActualBuyback()
    {
        return $this->inventoryTransactions()
            ->where('transaction_type', 'inbound')
            ->where('product_type', 'App\\Models\\CornProduct')
            ->sum('qty');
    }

    /**
     * Calculate buyback fulfillment percentage
     */
    public function getBuybackFulfillmentPercentage()
    {
        $expected = $this->getTotalExpectedBuyback();
        $actual = $this->getTotalActualBuyback();
        
        return $expected > 0 ? ($actual / $expected) * 100 : 0;
    }

    /**
     * Get remaining buyback quantity needed
     */
    public function getRemainingBuyback()
    {
        return $this->getTotalExpectedBuyback() - $this->getTotalActualBuyback();
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
    
    public function seedCommitments()
    {
        return $this->hasMany(ContractSeedCommitment::class);
    }
}