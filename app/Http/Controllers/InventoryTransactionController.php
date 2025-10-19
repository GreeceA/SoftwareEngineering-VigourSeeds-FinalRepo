<?php

namespace App\Http\Controllers;

use App\Models\InventoryTransaction;
use App\Models\Seed;
use App\Models\Item;
use App\Models\CornProduct;
use App\Models\Contract;
use App\Models\PartnerOrder;
use App\Models\PartnerOrderLine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InventoryTransactionController extends Controller
{
    /**
     * Display the inventory ledger
     */
    public function index(Request $request)
    {
        $query = InventoryTransaction::with(['product', 'contract', 'partnerOrder', 'creator'])
            ->orderBy('created_at', 'desc');

        // Filter by product type
        if ($request->has('product_type') && $request->product_type) {
            $query->where('product_type', $request->product_type);
        }

        // Filter by transaction type
        if ($request->has('transaction_type') && $request->transaction_type) {
            $query->where('transaction_type', $request->transaction_type);
        }

        // Filter by date range
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $transactions = $query->paginate(50);

        return Inertia::render('Inventory/Ledger', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Show form for creating inbound transaction
     */
    public function createInbound()
    {
        $seeds = Seed::active()->get(['id', 'seed_variety as name']);
        $seeds = $seeds->map(function ($seed) {
            $seed->unit = 'kg';
            return $seed;
        });

        $items = Item::active()->get(['id', 'name', 'base_unit as unit', 'type']);

        return Inertia::render('Inventory/Inbound', [
            'seeds' => $seeds,
            'items' => $items,
        ]);
    }

    /**
     * Store inbound transaction (stock-in)
     */
    public function storeInbound(Request $request)
    {
        $validated = $request->validate([
            'products' => 'required|array|min:1',
            'products.*.product_type' => 'required|string',
            'products.*.product_id' => 'required|integer',
            'products.*.qty' => 'required|numeric|min:0.01',
            'products.*.unit' => 'required|in:kg,liter,sack,ton',
            'products.*.notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            foreach ($validated['products'] as $product) {
                InventoryTransaction::create([
                    'product_type' => $product['product_type'],
                    'product_id' => $product['product_id'],
                    'transaction_type' => 'inbound',
                    'qty' => $product['qty'],
                    'unit' => $product['unit'],
                    'notes' => $product['notes'] ?? null,
                    'created_by' => Auth::id(),
                ]);
            }
            DB::commit();

            return redirect()->route('inventory.ledger')
                ->with('success', 'Stock received successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()
                ->with('error', 'Failed to record stock: ' . $e->getMessage());
        }
    }

    /**
     * Show form for creating outbound transaction
     */
    public function createOutbound()
    {
        $seeds = Seed::active()->get();
        $items = Item::active()->get();
        $partnerOrders = PartnerOrder::with(['partner', 'lines.product'])
            ->whereIn('status', ['pending', 'partially_fulfilled'])
            ->get();

        // return view('inventory.outbound', compact('seeds', 'items', 'partnerOrders'));
        return Inertia::render('Inventory/Outbound');
    }

    /**
     * Store outbound transaction (stock-out)
     */
    public function storeOutbound(Request $request)
    {
        $validated = $request->validate([
            'partner_order_id' => 'required|exists:partner_orders,id',
            'partner_order_line_id' => 'required|exists:partner_order_lines,id',
            'qty' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $orderLine = PartnerOrderLine::with(['product', 'partnerOrder'])->findOrFail($validated['partner_order_line_id']);
            
            // Validate remaining quantity
            $remainingQty = $orderLine->getRemainingQty();
            if ($validated['qty'] > $remainingQty) {
                throw new \Exception("Delivery quantity ({$validated['qty']}) exceeds remaining quantity ({$remainingQty})");
            }

            // Check stock availability
            $product = $orderLine->product;
            if (!$product->hasStock($validated['qty'])) {
                throw new \Exception("Insufficient stock. Available: {$product->getCurrentStock()} {$orderLine->unit}");
            }

            // Create outbound transaction
            $transaction = InventoryTransaction::create([
                'product_type' => $orderLine->product_type,
                'product_id' => $orderLine->product_id,
                'transaction_type' => 'outbound',
                'qty' => $validated['qty'],
                'unit' => $orderLine->unit,
                'contract_id' => $orderLine->partnerOrder->contract_id,
                'partner_order_id' => $orderLine->partner_order_id,
                'notes' => $validated['notes'] ?? null,
                'created_by' => Auth::id(),
            ]);

            // Update delivered quantity on order line
            $orderLine->addDelivery($validated['qty']);

            DB::commit();

            return redirect()->route('partner-orders.show', $orderLine->partner_order_id)
                ->with('success', 'Stock delivered successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()
                ->with('error', 'Failed to deliver stock: ' . $e->getMessage());
        }
    }

    /**
     * Store adjustment transaction
     */
    public function storeAdjustment(Request $request)
    {
        $validated = $request->validate([
            'product_type' => 'required|string',
            'product_id' => 'required|integer',
            'qty' => 'required|numeric', // Can be positive or negative
            'unit' => 'required|in:kg,liter,sack,ton',
            'notes' => 'required|string', // Adjustment reason must be documented
        ]);

        DB::beginTransaction();
        try {
            $transaction = InventoryTransaction::create([
                'product_type' => $validated['product_type'],
                'product_id' => $validated['product_id'],
                'transaction_type' => 'adjustment',
                'qty' => $validated['qty'],
                'unit' => $validated['unit'],
                'notes' => $validated['notes'],
                'created_by' => Auth::id(),
            ]);

            DB::commit();

            return redirect()->route('inventory.ledger')
                ->with('success', 'Inventory adjusted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withInput()
                ->with('error', 'Failed to adjust inventory: ' . $e->getMessage());
        }
    }

    /**
     * Show inventory dashboard with stock overview
     */
    public function dashboard()
    {
        $seeds = Seed::active()->get()->map(function ($seed) {
            return [
                'id' => $seed->id,
                'name' => $seed->seed_variety,
                'type' => 'Seed',
                'current_stock' => $seed->getCurrentStock(),
                'unit' => 'kg',
                'status' => $seed->getCurrentStock() > 0 ? 'good' : 'critical',
            ];
        });

        $items = Item::active()->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'type' => $item->type,
                'current_stock' => $item->getCurrentStock(),
                'unit' => $item->base_unit,
                'status' => $item->getCurrentStock() > 0 ? 'good' : 'critical',
            ];
        });

        // Only merge seeds and items, NOT cornProducts
        $inventory = collect()
            ->merge($seeds)
            ->merge($items)
            ->values();

        return Inertia::render('Inventory/Dashboard', [
            'inventory' => $inventory,
        ]);
    }


    public function show($productType, $productId)
    {
        // Determine the model based on product type
        $product = null;
        
        if ($productType === 'Seed') {
            $product = Seed::findOrFail($productId);
            $productData = [
                'id' => $product->id,
                'name' => $product->seed_variety,
                'type' => 'Seed',
                'current_stock' => $product->getCurrentStock(),
                'unit' => 'kg',
                'status' => $this->determineStockStatus($product->getCurrentStock(), $product->reorder_level ?? 0),
            ];
        } elseif (in_array($productType, ['fertilizer', 'pesticide'])) {
            $product = Item::where('type', $productType)->findOrFail($productId);
            $productData = [
                'id' => $product->id,
                'name' => $product->name,
                'type' => $product->type,
                'current_stock' => $product->getCurrentStock(),
                'unit' => $product->base_unit,
                'status' => $this->determineStockStatus($product->getCurrentStock(), $product->reorder_level ?? 0),
            ];
        } else {
            abort(404, 'Invalid product type');
        }

        // Get all transactions for this product with running balance
        $transactions = InventoryTransaction::with(['creator', 'contract', 'partnerOrder'])
            ->where('product_type', $productType)
            ->where('product_id', $productId)
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate running balance for each transaction
        $runningBalance = $productData['current_stock'];
        $transactionsWithBalance = $transactions->map(function ($transaction) use (&$runningBalance) {
            $transaction->running_balance = $runningBalance;
            
            // Calculate previous balance (reverse the transaction)
            if ($transaction->transaction_type === 'inbound') {
                $runningBalance -= $transaction->qty;
            } elseif ($transaction->transaction_type === 'outbound') {
                $runningBalance += $transaction->qty;
            } elseif ($transaction->transaction_type === 'adjustment') {
                $runningBalance -= $transaction->qty;
            }
            
            return $transaction;
        });

        return Inertia::render('Inventory/Show', [
            'product' => $productData,
            'transactions' => [
                'data' => $transactionsWithBalance->values()
            ],
        ]);
    }

    public function createAdjustment()
    {
        \Log::info('Adjustment route hit!');
        
        $seeds = Seed::active()->get()->map(function ($seed) {
            return [
                'id' => $seed->id,
                'name' => $seed->seed_variety,
                'seed_variety' => $seed->seed_variety,
                'unit' => 'kg',
                'current_stock' => $seed->getCurrentStock(),
            ];
        });

        $items = Item::active()->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'type' => $item->type,
                'unit' => $item->base_unit,
                'current_stock' => $item->getCurrentStock(),
            ];
        });

        return Inertia::render('Inventory/Adjustment', [
            'seeds' => $seeds,
            'items' => $items,
        ]);
    }

    private function determineStockStatus($currentStock, $reorderLevel = 0)
    {
        if ($currentStock <= 0) {
            return 'critical';
        } elseif ($currentStock <= $reorderLevel) {
            return 'low';
        } else {
            return 'good';
        }
    }
}