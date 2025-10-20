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
        $query = InventoryTransaction::with(['contract', 'partnerOrder', 'creator'])          
            ->orderBy('created_at', 'desc');

        // Filter by product type
        if ($request->filled('product_type')) {
            $query->where('product_type', $request->product_type);
        }

        // Filter by transaction type
        if ($request->filled('transaction_type')) {
            $query->where('transaction_type', $request->transaction_type);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search filter - search by product name
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            
            // Get seed IDs that match the search
            $seedIds = Seed::where('seed_variety', 'LIKE', "%{$searchTerm}%")->pluck('id');
            
            // Get item IDs that match the search
            $itemIds = Item::where('name', 'LIKE', "%{$searchTerm}%")->pluck('id');
            
            // Filter transactions by matching product IDs
            $query->where(function($q) use ($seedIds, $itemIds) {
                $q->where(function($subQ) use ($seedIds) {
                    $subQ->where('product_type', 'Seed')
                         ->whereIn('product_id', $seedIds);
                })
                ->orWhere(function($subQ) use ($itemIds) {
                    $subQ->where('product_type', 'item')
                         ->whereIn('product_id', $itemIds);
                });
            });
        }

        $transactions = $query->paginate(10)->withQueryString();

        // Transform transactions to include product names and user names
        $transactions->getCollection()->transform(function ($txn) {
            if ($txn->product_type === 'Seed' || $txn->product_type === 'seed') {
                $seed = Seed::find($txn->product_id);
                $txn->product_name = $seed ? $seed->seed_variety : '-';
            } elseif ($txn->product_type === 'item') {
                $item = Item::find($txn->product_id);
                $txn->product_name = $item ? $item->name : '-';
            } else {
                $txn->product_name = '-';
            }
            
            // Attach user name
            $txn->user_name = $txn->creator
                ? trim(($txn->creator->first_name ?? '') . ' ' . ($txn->creator->last_name ?? ''))
                : '-';

            return $txn;
        });

        return Inertia::render('Inventory/Ledger', [
            'transactions' => $transactions,
            'filters' => [
                'product_type' => $request->product_type,
                'transaction_type' => $request->transaction_type,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'search' => $request->search,
            ],
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
            'products.*.receipt_date' => 'required|date', // <-- ADD THIS
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
                    'receipt_date' => $product['receipt_date'], // <-- ADD THIS
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
            'qty' => 'required|numeric',
            'unit' => 'required|in:kg,liter,sack,ton',
            'notes' => 'required|string',
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
            $hasTransaction = InventoryTransaction::where('product_type', 'Seed')
                ->where('product_id', $seed->id)
                ->exists();
            $currentStock = $hasTransaction ? $seed->getCurrentStock() : null;

            return [
                'id' => $seed->id,
                'name' => $seed->seed_variety,
                'type' => 'Seed',
                'current_stock' => $currentStock,
                'unit' => 'kg',
                'status' => $hasTransaction ? $this->determineStockStatus($currentStock) : null,
            ];
        });

        $items = Item::active()->get()->map(function ($item) {
            $hasTransaction = InventoryTransaction::where('product_type', 'item')
                ->where('product_id', $item->id)
                ->exists();
            $currentStock = $hasTransaction ? $item->getCurrentStock() : null;

            return [
                'id' => $item->id,
                'name' => $item->name,
                'type' => $item->type,
                'current_stock' => $currentStock,
                'unit' => $item->base_unit,
                'status' => $hasTransaction ? $this->determineStockStatus($currentStock) : null,
            ];
        });

        $inventory = collect()
            ->merge($seeds)
            ->merge($items)
            ->unique(function ($item) {
                return $item['type'] . '-' . $item['id'];
            })
            ->values();

        return Inertia::render('Inventory/Dashboard', [
            'inventory' => $inventory,
        ]);
    }

    public function show($productType, $productId)
    {
        $product = null;
        
        if ($productType === 'Seed') {
            $product = Seed::findOrFail($productId);
            $productData = [
                'id' => $product->id,
                'name' => $product->seed_variety,
                'type' => 'Seed',
                'current_stock' => $product->getCurrentStock(),
                'unit' => 'kg',
                'status' => $this->determineStockStatus($product->getCurrentStock()),
            ];
        } elseif (in_array($productType, ['fertilizer', 'pesticide'])) {
            $product = Item::where('type', $productType)->findOrFail($productId);
            $productData = [
                'id' => $product->id,
                'name' => $product->name,
                'type' => $product->type,
                'current_stock' => $product->getCurrentStock(),
                'unit' => $product->base_unit,
                'status' => $this->determineStockStatus($product->getCurrentStock()),
            ];
        } else {
            abort(404, 'Invalid product type');
        }

        $transactions = InventoryTransaction::with(['creator', 'contract', 'partnerOrder'])
            ->where('product_type', $productType)
            ->where('product_id', $productId)
            ->orderBy('created_at', 'desc')
            ->get();

        $runningBalance = $productData['current_stock'];
        $transactionsWithBalance = $transactions->map(function ($transaction) use (&$runningBalance) {
            $transaction->running_balance = $runningBalance;
            
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

    private function determineStockStatus($currentStock)
    {
        if ($currentStock < 200) {
            return 'critical';
        } elseif ($currentStock < 700) {
            return 'low';
        } else {
            return 'good';
        }
    }
}