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
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Barryvdh\DomPDF\Facade\Pdf;

class InventoryTransactionController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view inventory', only: ['index', 'dashboard', 'show']),
            new Middleware('permission:create inventory', only: ['createInbound', 'storeInbound', 'createOutbound', 'storeOutbound', 'createAdjustment', 'storeAdjustment']),
        ];
    }

    /**
     * Display the inventory ledger
        */
    public function index(Request $request)
    {
        $query = InventoryTransaction::with(['contract', 'partnerOrder', 'creator', 'seed', 'item', 'cornProduct'])
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

            $seedIds = Seed::where('seed_variety', 'LIKE', "%{$searchTerm}%")->pluck('id');
            $itemIds = Item::where('name', 'LIKE', "%{$searchTerm}%")->pluck('id');
            $cornProductIds = CornProduct::where('name', 'LIKE', "%{$searchTerm}%")->pluck('id');

            $query->where(function ($q) use ($seedIds, $itemIds, $cornProductIds) {
                $q->where(function ($subQ) use ($seedIds) {
                    $subQ->where('product_type', 'Seed')
                        ->whereIn('product_id', $seedIds);
                })
                ->orWhere(function ($subQ) use ($itemIds) {
                    $subQ->where('product_type', 'item')
                        ->whereIn('product_id', $itemIds);
                })
                ->orWhere(function ($subQ) use ($cornProductIds) {
                    $subQ->where('product_type', 'CornProduct')
                        ->whereIn('product_id', $cornProductIds);
                });
            });
        }

        $transactions = $query->paginate(10)->withQueryString();

        // Transform transactions to include product names and user names
        $transactions->getCollection()->transform(function ($txn) {
            if ($txn->product_type === 'Seed' || $txn->product_type === 'seed') {
                $seed = $txn->seed;
                $txn->product_name = $seed ? $seed->seed_variety : '-';
            } elseif ($txn->product_type === 'item') {
                $item = $txn->item;
                $txn->product_name = $item ? $item->name : '-';
            } elseif ($txn->product_type === 'CornProduct') {
                $cornProduct = $txn->cornProduct;
                $txn->product_name = $cornProduct ? $cornProduct->name : '-';
            } else {
                $txn->product_name = '-';
            }

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
    public function storeInbound(\App\Http\Requests\StoreInboundRequest $request)
    {
        $validated = $request->validated();

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
                    'receipt_date' => $product['receipt_date'],
                    'manufacture_date' => $product['manufacture_date'],
                    'expiration_date' => $product['expiration_date'],
                    'created_by' => Auth::id(),
                ]);
            }
            DB::commit();

            return redirect()->route('inventory.dashboard')
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
        $partnerOrders = \App\Models\PartnerOrder::with(['partner', 'lines.seed', 'lines.item', 'contract.farm'])
            ->whereIn('status', ['pending', 'partially_fulfilled'])
            ->whereHas('contract', function ($q) {
                $q->where('status', 'active'); // Only contracts with status 'active'
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'contract_name' => $order->contract ? $order->contract->contract_name : '',
                    'partner_name' => $order->partner ? ($order->partner->name ?? $order->partner->partner_name ?? '') : '',
                    'status' => $order->status,
                    'lines' => $order->lines->map(function ($line) {
                        // Get product based on type
                        $product = null;
                        $productName = '-';
                        $availableStockInBaseUnit = 0;
                        $baseUnit = 'kg'; // Default base unit

                        if ($line->product_type === 'seed' || $line->product_type === 'Seed' || $line->product_type === 'App\\Models\\Seed') {
                            $product = $line->seed;
                            $productName = $product ? $product->seed_variety : '-';
                            $baseUnit = 'kg';
                        } else {
                            $product = $line->item;
                            $productName = $product ? $product->name : '-';
                            $baseUnit = $product ? ($product->base_unit ?? 'kg') : 'kg';
                        }

                        if ($product && method_exists($product, 'getCurrentStock')) {
                            $availableStockInBaseUnit = $product->getCurrentStock();
                        }

                        return [
                            'id' => $line->id,
                            'product_name' => $productName,
                            'qty' => $line->qty,
                            'unit' => $line->unit,
                            'delivered_qty' => $line->delivered_qty,
                            'available_stock' => round($availableStockInBaseUnit, 2),
                            'base_unit' => $baseUnit, // Pass base unit to frontend
                        ];
                    }),
                    'farm_name' => $order->contract && $order->contract->farm ? $order->contract->farm->location_name : '',
                    'farm_location' => $order->contract && $order->contract->farm ? $order->contract->farm->address : '',
                    'notes' => $order->notes ?? '',
                ];
            });

        return Inertia::render('Inventory/Outbound', [
            'partnerOrders' => $partnerOrders,
        ]);
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
            $orderLine = PartnerOrderLine::with('partnerOrder.contract')->findOrFail($validated['partner_order_line_id']);

            // Normalize product type for comparison
            $productType = strtolower(str_replace('App\\Models\\', '', $orderLine->product_type));
            $isSeed = in_array($productType, ['seed', 'seeds']);

            // Get product
            if ($isSeed) {
                $product = Seed::findOrFail($orderLine->product_id);
                $baseUnit = 'kg';
            } else {
                $product = Item::findOrFail($orderLine->product_id);
                $baseUnit = $product->base_unit ?? 'kg';
            }

            // Convert qty to base unit
            $qtyInBaseUnit = $validated['qty'];
            if ($orderLine->unit === 'sack') {
                $qtyInBaseUnit = $validated['qty'] * 50;
            } elseif ($orderLine->unit === 'ton') {
                $qtyInBaseUnit = $validated['qty'] * 1000;
            }

            // Check available stock
            $availableStock = $product->getCurrentStock();
            if ($qtyInBaseUnit > $availableStock) {
                DB::rollBack();
                return back()->withErrors(['qty' => "Insufficient stock. Available: {$availableStock} {$baseUnit}, Required: {$qtyInBaseUnit} {$baseUnit}"]);
            }

            // Check if exceeds remaining order
            $remaining = $orderLine->qty - $orderLine->delivered_qty;
            if ($validated['qty'] > $remaining) {
                DB::rollBack();
                return back()->withErrors(['qty' => "Quantity exceeds remaining order. Remaining: {$remaining} {$orderLine->unit}"]);
            }

            // Create outbound transaction (STORE POSITIVE QTY)
            $transaction = InventoryTransaction::create([
                'product_type' => $isSeed ? 'Seed' : 'item',
                'product_id' => $orderLine->product_id,
                'transaction_type' => 'outbound',
                'qty' => $qtyInBaseUnit, // POSITIVE value in base unit
                'unit' => $baseUnit,
                'contract_id' => $orderLine->partnerOrder->contract_id,
                'partner_order_id' => $orderLine->partner_order_id,
                'partner_order_line_id' => $orderLine->id,
                'notes' => $validated['notes'] ?? null,
                'receipt_date' => now()->toDateString(), // Use current date for outbound
                'manufacture_date' => null,
                'expiration_date' => null,
                'created_by' => Auth::id(),
            ]);

            // Update delivered quantity
            $orderLine->delivered_qty += $validated['qty'];
            $orderLine->save();

            // Update order status
            $orderLine->partnerOrder->updateStatus();

            DB::commit();
            return redirect()->route('inventory.dashboard')
                ->with('success', 'Stock delivered successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to deliver stock: ' . $e->getMessage()]);
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
                'receipt_date' => now()->toDateString(), // Use current date for adjustment
                'manufacture_date' => null,
                'expiration_date' => null,
                'created_by' => Auth::id(),
            ]);

            DB::commit();

            return redirect()->route('inventory.dashboard')
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
        // Get all products (Seeds and Items) with active status only
        $seeds = Seed::active()->get();
        $items = Item::active()->get();

        // Get all pending order lines with eager loading
        $pendingOrderLines = \App\Models\PartnerOrderLine::with(['partnerOrder.contract'])
            ->whereHas('partnerOrder', function ($q) {
                $q->whereIn('status', ['pending', 'partially_fulfilled'])
                    ->whereHas('contract', function ($qc) {
                        $qc->where('status', 'active');
                    });
            })->get();

        // Build shortfall list
        $shortfalls = [];

        // Helper function to convert to kg
        $convertToKg = function ($qty, $unit) {
            if ($unit === 'ton') return $qty * 1000;
            if ($unit === 'sack') return $qty * 50;
            return $qty; // kg, liter
        };

        // For Seeds
        foreach ($seeds as $seed) {
            $committedKg = $pendingOrderLines
                ->where('product_type', 'seed')
                ->where('product_id', $seed->id)
                ->sum(function ($line) use ($convertToKg) {
                    return $convertToKg($line->qty - $line->delivered_qty, $line->unit);
                });

            $availableKg = $seed->getCurrentStock(); // Already in kg
            $shortfallKg = $committedKg - $availableKg;

            if ($shortfallKg > 0) {
                $shortfalls[] = [
                    'type' => 'Seed',
                    'id' => $seed->id,
                    'name' => $seed->seed_variety,
                    'unit' => 'kg',
                    'on_hand' => round($availableKg, 2),
                    'committed' => round($committedKg, 2),
                    'shortfall' => round($shortfallKg, 2),
                ];
            }
        }

        // For Items (fertilizer, pesticide, etc.)
        foreach ($items as $item) {
            $committedInBaseUnit = $pendingOrderLines
                ->where('product_type', 'App\\Models\\Item')
                ->where('product_id', $item->id)
                ->sum(function ($line) use ($convertToKg) {
                    return $convertToKg($line->qty - $line->delivered_qty, $line->unit);
                });

            $availableInBaseUnit = $item->getCurrentStock(); // Already in base unit (kg/liter)
            $shortfallInBaseUnit = $committedInBaseUnit - $availableInBaseUnit;

            if ($shortfallInBaseUnit > 0) {
                $shortfalls[] = [
                    'type' => $item->type,
                    'id' => $item->id,
                    'name' => $item->name,
                    'unit' => $item->base_unit ?? 'kg',
                    'on_hand' => round($availableInBaseUnit, 2),
                    'committed' => round($committedInBaseUnit, 2),
                    'shortfall' => round($shortfallInBaseUnit, 2),
                ];
            }
        }

        // Build inventory list for dashboard table
        // Pre-fetch which products have transactions to avoid N+1 queries
        $seedsWithTransactions = InventoryTransaction::where('product_type', 'Seed')
            ->pluck('product_id')
            ->unique()
            ->flip();
        
        $itemsWithTransactions = InventoryTransaction::where('product_type', 'item')
            ->pluck('product_id')
            ->unique()
            ->flip();

        $seedsList = $seeds->map(function ($seed) use ($seedsWithTransactions) {
            $hasTransaction = isset($seedsWithTransactions[$seed->id]);
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

        $itemsList = $items->map(function ($item) use ($itemsWithTransactions) {
            $hasTransaction = isset($itemsWithTransactions[$item->id]);
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
            ->merge($seedsList)
            ->merge($itemsList)
            ->unique(function ($item) {
                return $item['type'] . '-' . $item['id'];
            })
            ->values();

        return Inertia::render('Inventory/Dashboard', [
            'inventory' => $inventory,
            'shortfalls' => $shortfalls,
        ]);
    }

    public function show($productType, $productId)
    {
        $product = null;
        $unit = 'kg';

        if ($productType === 'seed') {
            $product = Seed::findOrFail($productId);
            $productData = [
                'id' => $product->id,
                'name' => $product->seed_variety,
                'type' => 'Seed',
                'current_stock' => $product->getCurrentStock(),
                'unit' => $unit,
                'status' => $this->determineStockStatus($product->getCurrentStock()),
            ];
        } elseif ($productType === 'item') {
            $product = Item::findOrFail($productId);
            $productData = [
                'id' => $product->id,
                'name' => $product->name,
                'type' => $product->type,
                'current_stock' => $product->getCurrentStock(),
                'unit' => $product->base_unit ?? $unit,
                'status' => $this->determineStockStatus($product->getCurrentStock()),
            ];
        } else {
            abort(404, 'Invalid product type');
        }

        // Fetch transactions
        $transactions = InventoryTransaction::with(['creator', 'contract', 'partnerOrder'])
            ->where('product_type', $productType)
            ->where('product_id', $productId)
            ->orderBy('created_at', 'desc')
            ->get();

        // Convert all transaction quantities to kg if needed
        $convertToKg = function ($qty, $unit) {
            if ($unit === 'ton') return $qty * 1000;
            if ($unit === 'sack') return $qty * 50;
            return $qty; // kg, liter, etc.
        };

        // Calculate running balance in kg/liter
        $runningBalance = $productData['current_stock'];
        $transactionsWithBalance = $transactions->map(function ($transaction) use (&$runningBalance, $convertToKg, $productData) {
            $qtyKg = abs($convertToKg(floatval($transaction->qty), $transaction->unit)); // Always positive for display

            $transaction->qty_converted = $qtyKg;
            $transaction->unit_converted = $productData['unit'];
            $transaction->running_balance = $runningBalance;

            if ($transaction->transaction_type === 'inbound') {
                $runningBalance -= $qtyKg;
            } elseif ($transaction->transaction_type === 'outbound') {
                $runningBalance -= $qtyKg; // FIX: always subtract for outbound
            } elseif ($transaction->transaction_type === 'adjustment') {
                // For adjustments, add if positive, subtract if negative
                if ($transaction->qty >= 0) {
                    $runningBalance -= $qtyKg;
                } else {
                    $runningBalance += $qtyKg;
                }
            }

            $transaction->user_name = $transaction->creator
                ? trim(($transaction->creator->first_name ?? '') . ' ' . ($transaction->creator->last_name ?? ''))
                : '-';

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

    public function exportDashboard()
    {
        // Get all products (Seeds and Items) - exclude Corn
        $seeds = Seed::all();
        $items = Item::all();

        // Get all pending order lines
        $pendingOrderLines = \App\Models\PartnerOrderLine::whereHas('partnerOrder', function ($q) {
            $q->whereIn('status', ['pending', 'partially_fulfilled'])
                ->whereHas('contract', function ($qc) {
                    $qc->where('status', 'active');
                });
        })->get();

        // Build shortfall list
        $shortfalls = [];

        // Helper function to convert to kg
        $convertToKg = function ($qty, $unit) {
            if ($unit === 'ton') return $qty * 1000;
            if ($unit === 'sack') return $qty * 50;
            return $qty; // kg, liter
        };

        // For Seeds
        foreach ($seeds as $seed) {
            $committedKg = $pendingOrderLines
                ->where('product_type', 'seed')
                ->where('product_id', $seed->id)
                ->sum(function ($line) use ($convertToKg) {
                    return $convertToKg($line->qty - $line->delivered_qty, $line->unit);
                });

            $availableKg = $seed->getCurrentStock();
            $shortfallKg = $committedKg - $availableKg;

            if ($shortfallKg > 0) {
                $shortfalls[] = [
                    'type' => 'Seed',
                    'id' => $seed->id,
                    'name' => $seed->seed_variety,
                    'unit' => 'kg',
                    'on_hand' => round($availableKg, 2),
                    'committed' => round($committedKg, 2),
                    'shortfall' => round($shortfallKg, 2),
                ];
            }
        }

        // For Items
        foreach ($items as $item) {
            $committedInBaseUnit = $pendingOrderLines
                ->where('product_type', 'App\\Models\\Item')
                ->where('product_id', $item->id)
                ->sum(function ($line) use ($convertToKg) {
                    return $convertToKg($line->qty - $line->delivered_qty, $line->unit);
                });

            $availableInBaseUnit = $item->getCurrentStock();
            $shortfallInBaseUnit = $committedInBaseUnit - $availableInBaseUnit;

            if ($shortfallInBaseUnit > 0) {
                $shortfalls[] = [
                    'type' => $item->type,
                    'id' => $item->id,
                    'name' => $item->name,
                    'unit' => $item->base_unit ?? 'kg',
                    'on_hand' => round($availableInBaseUnit, 2),
                    'committed' => round($committedInBaseUnit, 2),
                    'shortfall' => round($shortfallInBaseUnit, 2),
                ];
            }
        }

        // Build inventory list
        $seedsList = Seed::active()->get()->map(function ($seed) {
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

        $itemsList = Item::active()->get()->map(function ($item) {
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
            ->merge($seedsList)
            ->merge($itemsList)
            ->filter(function ($item) {
                return strtolower($item['type']) !== 'corn';
            })
            ->values();

        $pdf = Pdf::loadView('exports.inventory_dashboard_pdf', [
            'inventory' => $inventory,
            'shortfalls' => collect($shortfalls),
            'user' => Auth::user(),
            'generationDate' => now()->format('F d, Y - h:i A')
        ])->setPaper('A4', 'landscape');

        return $pdf->download('VigourSeed_InventoryDashboard_' . now()->format('Y-m-d') . '.pdf');
    }

    public function exportLedger(Request $request)
    {
        $query = InventoryTransaction::with(['contract', 'partnerOrder', 'creator'])
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->filled('product_type')) {
            $query->where('product_type', $request->product_type);
        }

        if ($request->filled('transaction_type')) {
            $query->where('transaction_type', $request->transaction_type);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $seedIds = Seed::where('seed_variety', 'LIKE', "%{$searchTerm}%")->pluck('id');
            $itemIds = Item::where('name', 'LIKE', "%{$searchTerm}%")->pluck('id');

            $query->where(function ($q) use ($seedIds, $itemIds) {
                $q->where(function ($subQ) use ($seedIds) {
                    $subQ->where('product_type', 'Seed')->whereIn('product_id', $seedIds);
                })
                ->orWhere(function ($subQ) use ($itemIds) {
                    $subQ->where('product_type', 'item')->whereIn('product_id', $itemIds);
                });
            });
        }

        $transactions = $query->get();

        // Transform transactions to include product names and user names
        $transactions->transform(function ($txn) {
            if ($txn->product_type === 'Seed' || $txn->product_type === 'seed') {
                $seed = $txn->seed;
                $txn->product_name = $seed ? $seed->seed_variety : '-';
            } elseif ($txn->product_type === 'item') {
                $item = $txn->item;
                $txn->product_name = $item ? $item->name : '-';
            } else {
                $txn->product_name = '-';
            }

            $txn->user_name = $txn->creator
                ? trim(($txn->creator->first_name ?? '') . ' ' . ($txn->creator->last_name ?? ''))
                : '-';

            return $txn;
        });

        $hasFilters = $request->filled('product_type') ||
                      $request->filled('transaction_type') ||
                      $request->filled('date_from') ||
                      $request->filled('date_to') ||
                      $request->filled('search');

        $pdf = Pdf::loadView('exports.inventory_ledger_pdf', [
            'transactions' => $transactions,
            'filters' => $request->only(['product_type', 'transaction_type', 'date_from', 'date_to', 'search']),
            'hasFilters' => $hasFilters,
            'user' => Auth::user(),
            'generationDate' => now()->format('F d, Y - h:i A')
        ])->setPaper('A4', 'landscape');

        return $pdf->download('VigourSeed_InventoryLedger_' . now()->format('Y-m-d') . '.pdf');
    }
}