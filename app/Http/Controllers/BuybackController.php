<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\CornProduct;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BuybackController extends Controller
{
    /**
     * Display buyback overview page
     */
    public function index()
    {
        $contracts = Contract::active()
            ->with(['partner', 'seedCommitments', 'inventoryTransactions' => function ($query) {
                $query->where('transaction_type', 'inbound')
                    ->where('product_type', 'App\\Models\\CornProduct');
            }])
            ->get()
            ->map(function ($contract) {
                return [
                    'contract' => $contract,
                    'expected_buyback' => $contract->getTotalExpectedBuyback(),
                    'actual_buyback' => $contract->getTotalActualBuyback(),
                    'remaining_buyback' => $contract->getRemainingBuyback(),
                    'fulfillment_percentage' => $contract->getBuybackFulfillmentPercentage(),
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
            ->with(['partner', 'seedCommitments'])
            ->whereHas('seedCommitments')
            ->get();
        
        $cornProducts = CornProduct::active()->get();

        // Use Inertia instead of view()
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
            'unit' => 'required|in:kg,ton',
            'delivery_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $contract = Contract::findOrFail($validated['contract_id']);
            $cornProduct = CornProduct::findOrFail($validated['corn_product_id']);

            // Check if delivery exceeds expected buyback
            $remainingBuyback = $contract->getRemainingBuyback();
            if ($validated['qty'] > $remainingBuyback) {
                return back()->withInput()
                    ->with('warning', "Warning: Delivery quantity ({$validated['qty']} {$validated['unit']}) exceeds remaining expected buyback ({$remainingBuyback} {$validated['unit']}). Proceeding anyway.")
                    ->with('confirm_override', true);
            }

            // Create inbound transaction for buyback
            $transaction = InventoryTransaction::create([
                'product_type' => 'App\\Models\\CornProduct',
                'product_id' => $validated['corn_product_id'],
                'transaction_type' => 'inbound',
                'qty' => $validated['qty'],
                'unit' => $validated['unit'],
                'contract_id' => $validated['contract_id'],
                'notes' => $validated['notes'] ?? "Buyback delivery from {$contract->partner->name}",
                'created_by' => Auth::id(),
            ]);

            // Update contract created_at to delivery_date for accurate tracking
            $transaction->created_at = $validated['delivery_date'];
            $transaction->save();

            DB::commit();

            return redirect()->route('buybacks.index')
                ->with('success', 'Buyback corn received successfully');
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
        // $contract->load([
        //     'partner',
        //     'farm',
        //     'seedCommitments.seed',
        //     'inventoryTransactions' => function ($query) {
        //         $query->where('transaction_type', 'inbound')
        //             ->where('product_type', 'App\\Models\\CornProduct')
        //             ->with('product', 'creator')
        //             ->orderBy('created_at', 'desc');
        //     }
        // ]);

        // $buybackData = [
        //     'expected_total' => $contract->getTotalExpectedBuyback(),
        //     'actual_total' => $contract->getTotalActualBuyback(),
        //     'remaining' => $contract->getRemainingBuyback(),
        //     'fulfillment_percentage' => $contract->getBuybackFulfillmentPercentage(),
        //     'transactions' => $contract->inventoryTransactions,
        // ];

        // Use Inertia instead of view
        return Inertia::render('Buybacks/Show', [
            // 'contract' => $contract,
            // 'buybackData' => $buybackData,
        ]);
    }

    /**
     * Get buyback history for a contract (AJAX)
     */
    public function getContractHistory($contractId)
    {
        try {
            $contract = Contract::with([
                'inventoryTransactions' => function ($query) {
                    $query->where('transaction_type', 'inbound')
                        ->where('product_type', 'App\\Models\\CornProduct')
                        ->with('product', 'creator')
                        ->orderBy('created_at', 'desc');
                }
            ])->findOrFail($contractId);

            return response()->json([
                'success' => true,
                'expected_buyback' => $contract->getTotalExpectedBuyback(),
                'actual_buyback' => $contract->getTotalActualBuyback(),
                'remaining_buyback' => $contract->getRemainingBuyback(),
                'fulfillment_percentage' => $contract->getBuybackFulfillmentPercentage(),
                'transactions' => $contract->inventoryTransactions,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch contract history: ' . $e->getMessage(),
            ], 500);
        }
    }
}