<?php

namespace App\Http\Controllers;

use App\Models\PartnerOrder;
use App\Models\PartnerOrderLine;
use App\Models\Contract;
use App\Models\Partner;
use App\Models\Seed;
use App\Models\Item;
use App\Models\ContractSeedCommitment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PartnerOrderController extends Controller
{
    /**
     * Display all partner orders
     */
    public function index(Request $request)
    {
        $query = PartnerOrder::with(['partner', 'contract', 'lines.product'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by partner
        if ($request->has('partner_id') && $request->partner_id) {
            $query->where('partner_id', $request->partner_id);
        }

        $orders = $query->paginate(20);
        $partners = Partner::all();

        return Inertia::render('PartnerOrders/Index', [
            'partnerOrders' => $orders,
        ]);
    }

    /**
     * Show form for creating new partner order
     */
    public function create()
    {
        $partners = Partner::all();
        $contracts = Contract::active()->with('seedCommitments.seed')->get();
        $seeds = Seed::active()->get();
        $items = Item::active()->get();

        return Inertia::render('PartnerOrders/Create', [
            'partners' => $partners,
            'contracts' => $contracts,
            'seeds' => $seeds,
            'items' => $items,
        ]);    
    }

    /**
     * Store new partner order
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'partner_id' => 'required|exists:partners,id',
            'contract_id' => 'nullable|exists:contracts,id',
            'order_date' => 'required|date',
            'notes' => 'nullable|string',
            'lines' => 'required|array|min:1',
            'lines.*.product_type' => 'required|string',
            'lines.*.product_id' => 'required|integer',
            'lines.*.qty' => 'required|numeric|min:0.01',
            'lines.*.unit' => 'required|in:kg,liter,sack,ton',
            'lines.*.price_per_unit' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            // Create partner order
            $order = PartnerOrder::create([
                'partner_id' => $validated['partner_id'],
                'contract_id' => $validated['contract_id'] ?? null,
                'order_date' => $validated['order_date'],
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
                'created_by' => Auth::id(),
            ]);

            // Create order lines
            foreach ($validated['lines'] as $line) {
                PartnerOrderLine::create([
                    'partner_order_id' => $order->id,
                    'product_type' => $line['product_type'],
                    'product_id' => $line['product_id'],
                    'qty' => $line['qty'],
                    'unit' => $line['unit'],
                    'price_per_unit' => $line['price_per_unit'],
                    'delivered_qty' => 0,
                ]);
            }

            DB::commit();

            return redirect()->route('partner-orders.show', $order)
                ->with('success', 'Partner order created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()
                ->with('error', 'Failed to create order: ' . $e->getMessage());
        }
    }

    /**
     * Auto-generate partner order from contract seed commitments
     */
    public function generateFromContract(Request $request)
    {
        $validated = $request->validate([
            'contract_id' => 'required|exists:contracts,id',
            'commitment_ids' => 'required|array|min:1',
            'commitment_ids.*' => 'exists:contract_seed_commitments,id',
        ]);

        DB::beginTransaction();
        try {
            $contract = Contract::with('seedCommitments.seed')->findOrFail($validated['contract_id']);
            
            // Create partner order
            $order = PartnerOrder::create([
                'partner_id' => $contract->partner_id,
                'contract_id' => $contract->id,
                'order_date' => now(),
                'status' => 'pending',
                'notes' => 'Auto-generated from contract seed commitments',
                'created_by' => Auth::id(),
            ]);

            // Create order lines from selected commitments
            foreach ($validated['commitment_ids'] as $commitmentId) {
                $commitment = $contract->seedCommitments()->findOrFail($commitmentId);
                
                PartnerOrderLine::create([
                    'partner_order_id' => $order->id,
                    'product_type' => 'App\\Models\\Seed',
                    'product_id' => $commitment->seed_id,
                    'qty' => $commitment->seed_quantity,
                    'unit' => $commitment->unit,
                    'price_per_unit' => $commitment->seed_price_at_contract,
                    'delivered_qty' => 0,
                ]);
            }

            DB::commit();

            return redirect()->route('partner-orders.show', $order)
                ->with('success', 'Order generated from contract commitments');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to generate order: ' . $e->getMessage());
        }
    }

    /**
     * Display specific partner order with details
     */
    public function show($id)
    {
        // $partnerOrder->load([
        //     'partner',
        //     'contract',
        //     'lines.product',
        //     'inventoryTransactions.product',
        //     'creator'
        // ]);

        return Inertia::render('PartnerOrders/Show');
    }

    /**
     * Update partner order status
     */
    public function updateStatus(Request $request, PartnerOrder $partnerOrder)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,partially_fulfilled,fulfilled,cancelled',
        ]);

        try {
            $partnerOrder->status = $validated['status'];
            $partnerOrder->save();

            return back()->with('success', 'Order status updated successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update status: ' . $e->getMessage());
        }
    }

    /**
     * Cancel partner order
     */
    public function cancel(PartnerOrder $partnerOrder)
    {
        try {
            if ($partnerOrder->status === 'fulfilled') {
                return back()->with('error', 'Cannot cancel a fulfilled order');
            }

            $partnerOrder->status = 'cancelled';
            $partnerOrder->save();

            return back()->with('success', 'Order cancelled successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to cancel order: ' . $e->getMessage());
        }
    }
}