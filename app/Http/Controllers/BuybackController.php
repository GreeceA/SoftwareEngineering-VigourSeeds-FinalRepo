<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\CornProduct;
use App\Models\BuybackTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class BuybackController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view inventory', only: ['index', 'show']),
            new Middleware('permission:create inventory', only: ['createInbound', 'storeInbound']),
        ];
    }

    /**
     * Convert amount to kg for standardization
     */
    private function toKg($amount, $unit)
    {
        if ($unit === 'kg') return $amount;
        if ($unit === 'sack') return $amount * 50;
        if ($unit === 'ton') return $amount * 1000;
        return $amount;
    }

    /**
     * Display buyback overview page
     */
    public function index()
    {
        $contracts = Contract::active()
            ->with(['partner', 'farm', 'contractSeedCommitments', 'buybackTransactions'])
            ->get()
            ->map(function ($contract) {
                $commitment = $contract->contractSeedCommitments->first();
                $expected_buyback_amount = $commitment?->expected_buyback_amount ?? 0;
                $buyback_unit = $commitment?->buyback_unit ?? 'kg';

                // Convert expected to kg
                $expected_kg = $this->toKg($expected_buyback_amount, $buyback_unit);

                // Get actual delivered in kg
                $actual_kg = $contract->buybackTransactions->sum(function ($transaction) {
                    return $this->toKg($transaction->qty, $transaction->unit);
                });

                return [
                    'id' => $contract->id,
                    'contract_number' => $contract->contract_name,
                    'partner_name' => $contract->partner->name,
                    'farm_name' => $contract->farm?->location_name ?? '',
                    'expected_buyback_amount' => $expected_buyback_amount,
                    'buyback_unit' => $buyback_unit,
                    'expected_kg' => $expected_kg,
                    'actual_kg' => $actual_kg,
                    'remaining_kg' => max($expected_kg - $actual_kg, 0),
                    'fulfillment_percentage' => $expected_kg > 0 ? round(($actual_kg / $expected_kg) * 100, 2) : 0,
                    'buyback_price' => $contract->buyback_price_per_unit,
                    'status' => $contract->status,
                    'planting_date' => $commitment?->planting_date?->format('Y-m-d'),
                    'expected_harvest' => $commitment?->expected_first_harvest_date?->format('Y-m-d'),
                ];
            });

        return Inertia::render('Buybacks/Index', [
            'contracts' => $contracts,
        ]);
    }

    /**
     * Show form for recording buyback delivery
     */
    public function createInbound()
    {
        
        $contracts = Contract::active()
            ->with(['partner', 'contractSeedCommitments.seed', 'buybackTransactions'])
            ->whereHas('contractSeedCommitments')
            ->get()
            ->map(function ($contract) {
                $commitment = $contract->contractSeedCommitments->first();
                $expected_buyback_amount = $commitment?->expected_buyback_amount ?? 0;
                $buyback_unit = $commitment?->buyback_unit ?? 'kg';

                // Convert expected to kg
                $expected_kg = $this->toKg($expected_buyback_amount, $buyback_unit);

                // Get actual delivered in kg
                $actual_kg = $contract->buybackTransactions->sum(function ($transaction) {
                    return $this->toKg($transaction->qty, $transaction->unit);
                });

                $remaining_kg = max($expected_kg - $actual_kg, 0);
                $buyback_price = $contract->buyback_price_per_unit ?? 0;

                // Get corn product from seed
                $cornProduct = $commitment?->seed?->cornProduct;

                return [
                    'id' => $contract->id,
                    'contract_name' => $contract->contract_name ?? 'Contract #' . $contract->id,
                    'partner_name' => $contract->partner->name,
                    'expected_kg' => $expected_kg,
                    'actual_kg' => round($actual_kg, 2),
                    'remaining_kg' => round($remaining_kg, 2),
                    'unit' => 'kg',
                    'buyback_price' => $buyback_price,
                    'corn_product_id' => $cornProduct?->id,
                    'corn_product_name' => $cornProduct?->name ?? 'Corn Product',
                ];
            })
            ->values();

        // Get all corn products (auto-generated from seeds)
        $cornProducts = CornProduct::active()->get();

        return Inertia::render('Buybacks/Inbound', [
            'contracts' => $contracts,
            'cornProducts' => $cornProducts,
        ]);
    }

    /**
     * Store inbound buyback transaction
     */
    public function storeInbound(Request $request)
    {
        $validated = $request->validate([
            'contract_id' => 'required|exists:contracts,id',
            'corn_product_id' => 'required|exists:corn_products,id',
            'qty' => 'required|numeric|min:0.01',
            'unit' => 'required|in:kg,ton,sack',
            'delivery_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $contract = Contract::with('contractSeedCommitments')->findOrFail($validated['contract_id']);
            $cornProduct = CornProduct::findOrFail($validated['corn_product_id']);

            // Get expected buyback info
            $commitment = $contract->contractSeedCommitments->first();
            $expected_amount = $commitment?->expected_buyback_amount ?? 0;
            $expected_unit = $commitment?->buyback_unit ?? 'kg';

            // Calculate remaining buyback
            $delivered_so_far = $contract->buybackTransactions->sum(function ($transaction) use ($expected_unit) {
                $qty_in_kg = $this->toKg($transaction->qty, $transaction->unit);
                return $expected_unit === 'kg' ? $qty_in_kg : ($expected_unit === 'ton' ? $qty_in_kg / 1000 : $qty_in_kg / 50);
            });

            $remaining = max($expected_amount - $delivered_so_far, 0);

            // Check if delivery exceeds remaining
            $warning = null;
            if ($validated['qty'] > $remaining) {
                $warning = "Warning: Delivery quantity ({$validated['qty']} {$validated['unit']}) exceeds remaining expected buyback ({$remaining} {$expected_unit}).";
            }

            // Create buyback transaction
            $transaction = BuybackTransaction::create([
                'contract_id' => $validated['contract_id'],
                'corn_product_id' => $validated['corn_product_id'],
                'qty' => $validated['qty'],
                'unit' => $validated['unit'],
                'delivery_date' => $validated['delivery_date'],
                'buyback_price' => $contract->buyback_price_per_unit,
                'total_value' => $validated['qty'] * $contract->buyback_price_per_unit,
                'notes' => $validated['notes'] ?? "Buyback delivery from {$contract->partner->name}",
                'created_by' => Auth::id(),
            ]);

            // ADD THIS BLOCK:
            \App\Models\InventoryTransaction::create([
                'product_type' => 'CornProduct', // or 'CornProduct' if you want to distinguish
                'product_id' => $validated['corn_product_id'],
                'product_name' => $cornProduct->name, 
                'transaction_type' => 'inbound',
                'qty' => $validated['qty'],
                'unit' => $validated['unit'],
                'contract_id' => $validated['contract_id'],
                'notes' => 'Buyback delivery recorded',
                'receipt_date' => $validated['delivery_date'],
                'created_by' => Auth::id(),
            ]);

            DB::commit();

            return redirect()->route('buybacks.index')
                ->with('success', 'Buyback delivery recorded successfully' . ($warning ? '. ' . $warning : ''));
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()
                ->with('error', 'Failed to record buyback: ' . $e->getMessage());
        }
    }

    /**
     * Show buyback details for specific contract
     */
    public function show($id)
    {
        $contract = Contract::with([
            'partner',
            'farm',
            'contractSeedCommitments.seed.cornProduct',
            'buybackTransactions' => function ($query) {
                $query->with('cornProduct', 'creator')
                    ->orderBy('delivery_date', 'desc');
            }
        ])->findOrFail($id);

        $commitment = $contract->contractSeedCommitments->first();
        $expected_amount = $commitment?->expected_buyback_amount ?? 0;
        $expected_unit = $commitment?->buyback_unit ?? 'kg';

        // Calculate totals
        $actual_total_kg = $contract->buybackTransactions->sum(function ($transaction) {
            return $this->toKg($transaction->qty, $transaction->unit);
        });

        $expected_total_kg = $this->toKg($expected_amount, $expected_unit);
        $remaining_kg = max($expected_total_kg - $actual_total_kg, 0);
        $fulfillment_percentage = $expected_total_kg > 0 ? round(($actual_total_kg / $expected_total_kg) * 100, 2) : 0;

        // Always pass seed_commitments as an array
        $seedCommitments = $contract->contractSeedCommitments
            ? $contract->contractSeedCommitments->map(function ($sc) {
                return [
                    'id' => $sc->id,
                    'seed_variety' => $sc->seed?->seed_variety ?? '-',
                    'seed_quantity' => $sc->seed_quantity,
                    // Prefer the related seed's unit/price if available, fallback to commitment
                    'seed_unit' => $sc->unit,
                    'seed_price' => $sc->seed_price_at_contract,
                    'planting_date' => $sc->planting_date ? $sc->planting_date->format('Y-m-d') : null,
                    'expected_first_harvest' => $sc->expected_first_harvest_date ? $sc->expected_first_harvest_date->format('Y-m-d') : null,
                    'agreed_cycles' => $sc->agreed_cycles,
                    'expected_buyback_amount' => $sc->expected_buyback_amount,
                    'buyback_unit' => $sc->buyback_unit,
                ];
            })->toArray()
            : [];

        $buybackData = [
            'expected_total' => $expected_total_kg,
            'expected_unit' => $expected_unit,
            'actual_total_kg' => round($actual_total_kg, 2),
            'remaining_kg' => round($remaining_kg, 2),
            'fulfillment_percentage' => $fulfillment_percentage,
            'is_fulfilled' => $remaining_kg <= 0,
            'transactions' => $contract->buybackTransactions->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'delivery_date' => $transaction->delivery_date,
                    'corn_product_name' => $transaction->cornProduct->name ?? '-',
                    'qty' => $transaction->qty,
                    'unit' => $transaction->unit,
                    'buyback_price' => $transaction->buyback_price,
                    'total_value' => $transaction->total_value,
                    'notes' => $transaction->notes,
                    'created_by' => $transaction->creator ? 
                        trim(($transaction->creator->first_name ?? '') . ' ' . ($transaction->creator->last_name ?? '')) : 
                        '-',
                    'created_at' => $transaction->created_at->format('Y-m-d H:i:s'),
                ];
            })->toArray(),
        ];

        // Pass all needed fields, including seed_commitments as an array
        return Inertia::render('Buybacks/Show', [
            'contract' => [
                'id' => $contract->id,
                'contract_number' => $contract->contract_name,
                'partner_name' => $contract->partner->name ?? '-',
                'farm_name' => $contract->farm?->location_name ?? '-',
                'farm_location' => $contract->farm?->address ?? '-',
                'partner_contact' => $contract->partner?->phone ?? '-',
                'status' => $contract->status,
                'effective_date' => $contract->effective_date ? $contract->effective_date->format('Y-m-d') : null,
                'expiration_date' => $contract->expiration_date ? $contract->expiration_date->format('Y-m-d') : null,
                'buyback_price' => $contract->buyback_price_per_unit,
                'seed_commitments' => $seedCommitments,
            ],
            'buybackData' => $buybackData,
        ]);
    }

    /**
     * Get buyback history for a contract (AJAX)
     */
    public function getContractHistory($contractId)
    {
        try {
            $contract = Contract::with([
                'contractSeedCommitments',
                'buybackTransactions' => function ($query) {
                    $query->with('cornProduct', 'creator')
                        ->orderBy('delivery_date', 'desc');
                }
            ])->findOrFail($contractId);

            $commitment = $contract->contractSeedCommitments->first();
            $expected_amount = $commitment?->expected_buyback_amount ?? 0;
            $expected_unit = $commitment?->buyback_unit ?? 'kg';

            $actual_total_kg = $contract->buybackTransactions->sum(function ($transaction) {
                return $this->toKg($transaction->qty, $transaction->unit);
            });

            $expected_total_kg = $this->toKg($expected_amount, $expected_unit);
            $remaining_kg = max($expected_total_kg - $actual_total_kg, 0);

            return response()->json([
                'success' => true,
                'expected_buyback' => $expected_amount,
                'expected_unit' => $expected_unit,
                'actual_buyback_kg' => round($actual_total_kg, 2),
                'remaining_buyback_kg' => round($remaining_kg, 2),
                'fulfillment_percentage' => $expected_total_kg > 0 ? round(($actual_total_kg / $expected_total_kg) * 100, 2) : 0,
                'transactions' => $contract->buybackTransactions,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch contract history: ' . $e->getMessage(),
            ], 500);
        }
    }
}