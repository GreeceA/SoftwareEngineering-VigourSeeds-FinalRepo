<?php

namespace App\Helpers;

use App\Models\Contract;
use Carbon\Carbon;

class ContractHelper
{
    /**
     * Contract status color mappings for UI
     */
    public static function getStatusColor(string $status): string
    {
        return match($status) {
            'draft' => 'gray',
            'under_review' => 'blue',
            'active' => 'green',
            'suspended' => 'yellow',
            'terminated' => 'red',
            'cancelled' => 'pink',
            'completed' => 'teal',
            default => 'gray',
        };
    }

    /**
     * Get human-readable status label
     */
    public static function getStatusLabel(string $status): string
    {
        return ucwords(str_replace('_', ' ', $status));
    }

    /**
     * Calculate contract health score (0-100)
     */
    public static function calculateHealthScore(Contract $contract): int
    {
        $score = 100;

        // Deduct for expired contracts
        if ($contract->isExpired()) {
            $score -= 50;
        }

        // Deduct for expiring soon (within 30 days)
        $daysUntilExpiration = $contract->getDaysUntilExpiration();
        if ($daysUntilExpiration !== null && $daysUntilExpiration < 30) {
            $score -= (30 - $daysUntilExpiration);
        }

        // Deduct for low buyback fulfillment
        $fulfillment = $contract->getBuybackFulfillmentPercentage();
        if ($fulfillment < 50) {
            $score -= (50 - $fulfillment) / 2;
        }

        // Deduct for suspended/terminated status
        if (in_array($contract->status, ['suspended', 'terminated'])) {
            $score -= 30;
        }

        return max(0, min(100, (int)$score));
    }

    /**
     * Get contract risk level
     */
    public static function getRiskLevel(Contract $contract): string
    {
        $score = self::calculateHealthScore($contract);

        return match(true) {
            $score >= 80 => 'low',
            $score >= 60 => 'medium',
            $score >= 40 => 'high',
            default => 'critical',
        };
    }

    /**
     * Format currency for display
     */
    public static function formatCurrency(float $amount, int $decimals = 2): string
    {
        return '₱' . number_format($amount, $decimals);
    }

    /**
     * Calculate expected harvest schedule
     */
    public static function getHarvestSchedule(Contract $contract): array
    {
        $schedule = [];

        foreach ($contract->contractSeedCommitments as $commitment) {
            $harvestDates = [];
            $currentDate = $commitment->expected_first_harvest_date;
            $growthCycle = $commitment->seed->growth_cycle;

            for ($i = 0; $i < $commitment->agreed_cycles; $i++) {
                if ($currentDate->lessThanOrEqualTo($contract->expiration_date)) {
                    $harvestDates[] = [
                        'cycle' => $i + 1,
                        'date' => $currentDate->format('Y-m-d'),
                        'is_past' => $currentDate->isPast(),
                        'days_from_now' => $currentDate->diffInDays(now(), false),
                    ];
                    $currentDate = $currentDate->copy()->addDays($growthCycle);
                }
            }

            $schedule[] = [
                'seed_variety' => $commitment->seed->seed_variety,
                'harvests' => $harvestDates,
            ];
        }

        return $schedule;
    }

    /**
     * Validate if contract can transition to new status
     */
    public static function validateStatusTransition(Contract $contract, string $newStatus): array
    {
        $errors = [];

        // Check if transition is allowed
        if (!$contract->canTransitionTo($newStatus)) {
            $errors[] = "Cannot transition from {$contract->status} to {$newStatus}";
        }

        // Check file requirement
        if (in_array($newStatus, ['active', 'under_review']) && !$contract->contract_file) {
            $errors[] = 'Contract file is required';
        }

        // Check expiration date
        if ($newStatus === 'active' && $contract->isExpired()) {
            $errors[] = 'Cannot activate an expired contract';
        }

        // Check if all required fields are filled
        if ($newStatus === 'active') {
            if (!$contract->effective_date) {
                $errors[] = 'Effective date is required';
            }
            if (!$contract->expiration_date) {
                $errors[] = 'Expiration date is required';
            }
            if ($contract->contractSeedCommitments->isEmpty()) {
                $errors[] = 'At least one seed commitment is required';
            }
        }

        return $errors;
    }

    /**
     * Generate contract reference number
     */
    public static function generateReferenceNumber(Contract $contract): string
    {
        $year = $contract->signing_date->format('Y');
        $month = $contract->signing_date->format('m');
        $partnerId = str_pad($contract->partner_id, 4, '0', STR_PAD_LEFT);
        $contractId = str_pad($contract->id, 5, '0', STR_PAD_LEFT);
        
        return "CT-{$year}{$month}-{$partnerId}-{$contractId}";
    }

    /**
     * Get contract summary statistics
     */
    public static function getContractSummary(Contract $contract): array
    {
        return [
            'total_seed_cost' => $contract->contractSeedCommitments->sum(fn($c) => $c->getTotalSeedCost()),
            'total_expected_buyback' => $contract->getTotalExpectedBuyback(),
            'total_buyback_value' => $contract->contractSeedCommitments->sum(fn($c) => $c->getTotalBuybackValue()),
            'fulfillment_percentage' => $contract->getBuybackFulfillmentPercentage(),
            'remaining_buyback' => $contract->getRemainingBuyback(),
            'days_remaining' => $contract->getDaysUntilExpiration(),
            'health_score' => self::calculateHealthScore($contract),
            'risk_level' => self::getRiskLevel($contract),
            'reference_number' => self::generateReferenceNumber($contract),
        ];
    }

    /**
     * Check if contract needs attention
     */
    public static function needsAttention(Contract $contract): array
    {
        $alerts = [];

        // Expiring soon
        $daysUntilExpiration = $contract->getDaysUntilExpiration();
        if ($daysUntilExpiration !== null && $daysUntilExpiration <= 30 && $daysUntilExpiration > 0) {
            $alerts[] = [
                'type' => 'warning',
                'message' => "Contract expires in {$daysUntilExpiration} days",
            ];
        }

        // Expired
        if ($contract->isExpired()) {
            $alerts[] = [
                'type' => 'danger',
                'message' => 'Contract has expired',
            ];
        }

        // Low buyback fulfillment
        $fulfillment = $contract->getBuybackFulfillmentPercentage();
        if ($contract->status === 'active' && $fulfillment < 50) {
            $alerts[] = [
                'type' => 'warning',
                'message' => "Buyback fulfillment is only {$fulfillment}%",
            ];
        }

        // Missing file
        if (!$contract->contract_file) {
            $alerts[] = [
                'type' => 'danger',
                'message' => 'Contract file is missing',
            ];
        }

        // Suspended status
        if ($contract->status === 'suspended') {
            $alerts[] = [
                'type' => 'warning',
                'message' => 'Contract is currently suspended',
            ];
        }

        return $alerts;
    }

    /**
     * Get next recommended action
     */
    public static function getNextAction(Contract $contract): ?array
    {
        return match($contract->status) {
            'draft' => [
                'action' => 'submit_for_review',
                'label' => 'Submit for Review',
                'description' => 'Submit this contract for internal review',
                'color' => 'blue',
            ],
            'under_review' => [
                'action' => 'activate',
                'label' => 'Activate Contract',
                'description' => 'Activate this contract to make it effective',
                'color' => 'green',
            ],
            'active' => $contract->isExpired() ? [
                'action' => 'complete',
                'label' => 'Mark as Completed',
                'description' => 'Mark this expired contract as completed',
                'color' => 'teal',
            ] : null,
            'suspended' => [
                'action' => 'reactivate',
                'label' => 'Reactivate Contract',
                'description' => 'Resume this suspended contract',
                'color' => 'yellow',
            ],
            'terminated' => [
                'action' => 'complete',
                'label' => 'Mark as Completed',
                'description' => 'Finalize this terminated contract',
                'color' => 'teal',
            ],
            default => null,
        };
    }

    /**
     * Export contract data to array
     */
    public static function toExportArray(Contract $contract): array
    {
        return [
            'Contract ID' => $contract->id,
            'Reference Number' => self::generateReferenceNumber($contract),
            'Contract Name' => $contract->contract_name,
            'Partner Name' => $contract->partner->name,
            'Farm Location' => $contract->farm->location_name ?? 'N/A',
            'Status' => self::getStatusLabel($contract->status),
            'Signing Date' => $contract->signing_date->format('Y-m-d'),
            'Effective Date' => $contract->effective_date?->format('Y-m-d') ?? 'N/A',
            'Expiration Date' => $contract->expiration_date?->format('Y-m-d') ?? 'N/A',
            'Buyback Price (₱/kg)' => $contract->buyback_price_per_unit,
            'Total Expected Buyback (kg)' => $contract->getTotalExpectedBuyback(),
            'Buyback Fulfillment (%)' => $contract->getBuybackFulfillmentPercentage(),
            'Days Remaining' => $contract->getDaysUntilExpiration() ?? 'N/A',
            'Health Score' => self::calculateHealthScore($contract),
            'Risk Level' => strtoupper(self::getRiskLevel($contract)),
        ];
    }
}