<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemRequest;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\InventoryTransaction; // <-- ADD THIS LINE
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Barryvdh\DomPDF\Facade\Pdf;

class ItemController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view items', only: ['index', 'show']),
            new Middleware('permission:create items', only: ['create', 'store']),
            new Middleware('permission:edit items', only: ['edit', 'update']),
            new Middleware('permission:archive items', only: ['archive', 'activate', 'destroy']),
        ];
    }

    // Display a listing of the resource.
public function index(Request $request)
{
    $perPage = $request->get('per_page', 10);
    
    $sortable = ['id', 'name', 'price_per_unit'];
    $sortBy = in_array($request->get('sort_by'), $sortable) ? $request->get('sort_by') : 'id';
    $sortDir = $request->get('sort_dir') === 'asc' ? 'asc' : 'desc';

    $query = Item::query()
        ->when($request->has('status') && in_array($request->status, ['active', 'archived']), function ($query) use ($request) {
            $query->where('status', $request->status);
        })
        ->when($request->has('search') && $request->search, function ($query) use ($request) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        })
        ->orderBy($sortBy, $sortDir);

    $items = $query->paginate($perPage)->withQueryString();

    // Transform data to include contract/order information and current stock
    $items->getCollection()->transform(function ($item) {
        // Get partner orders for this item
        $partnerOrders = \App\Models\PartnerOrderLine::where('product_type', 'App\Models\Item')
            ->where('product_id', $item->id)
            ->with('partnerOrder.contract')
            ->get()
            ->map(function($line) {
                return [
                    'id' => $line->partner_order_id,
                    'status' => $line->partnerOrder->status,
                    'contract_status' => $line->partnerOrder->contract?->status,
                ];
            });

        // Add orders array for frontend modal
        $item->partner_orders = $partnerOrders;
        
        // Add current stock
        $item->current_stock = $item->getCurrentStock();
        
        return $item;
    });

    return Inertia::render('Items/Index', [
        'items' => $items,
        'filters' => $request->only(['search', 'status', 'sort_by', 'sort_dir', 'per_page']),
    ]);
}

    // Show the form for creating a new resource.
    public function create()
    {
        return Inertia::render('Items/Create');
    }

    // Store a newly created resource in storage.
    public function store(ItemRequest $request)
    {
        Item::create($request->validated());

        return redirect()->route('items.index')
            ->with('success', 'Item created successfully.');
    }

    // Display the specified resource.
public function show(Item $item)
{
    // Calculate stock on hand
    $stockOnHand = $item->getCurrentStock();
    
    // Calculate total stock value
    $totalStockValue = $stockOnHand * $item->price_per_unit;
    
    // Get recent inventory transactions (last 10)
    $recentInventoryLogs = InventoryTransaction::where('product_type', 'item')
        ->where('product_id', $item->id)
        ->with('creator')
        ->orderBy('created_at', 'desc')
        ->limit(10)
        ->get()
        ->map(function($txn) {
            return [
                'id' => $txn->id,
                'date' => $txn->created_at->format('Y-m-d'),
                'transaction_type' => $txn->transaction_type,
                'quantity' => abs($txn->qty), // Always positive for display
                'unit' => $txn->unit,
                'user' => $txn->creator 
                    ? trim("{$txn->creator->first_name} {$txn->creator->last_name}")
                    : 'System User',
                'notes' => $txn->notes,
            ];
        });
    
    // Get partner orders containing this item
    $partnerOrders = \App\Models\PartnerOrderLine::where('product_type', 'App\Models\Item')
        ->where('product_id', $item->id)
        ->with(['partnerOrder.partner', 'partnerOrder.contract.farm'])
        ->get()
        ->map(function($line) use ($item) {
            return [
                'id' => $line->partner_order_id,
                'partner_name' => $line->partnerOrder->partner->name ?? 'N/A',
                'farm_name' => $line->partnerOrder->contract?->farm?->location_name ?? 'N/A',
                'order_date' => $line->partnerOrder->order_date,
                'status' => $line->partnerOrder->status,
                'qty_ordered' => $line->qty,
                'qty_delivered' => $line->delivered_qty ?? 0,
                'unit' => $line->unit,
                'price' => $line->price_per_unit,
                'total_value' => $line->qty * $line->price_per_unit,
            ];
        })
        ->sortByDesc('order_date')
        ->values();
    
    return Inertia::render('Items/Show', [
        'item' => array_merge($item->toArray(), [
            'stock_on_hand' => $stockOnHand,
            'total_stock_value' => $totalStockValue,
        ]),
        'recentInventoryLogs' => $recentInventoryLogs,
        'partnerOrders' => $partnerOrders,
    ]);
}


    // Show the form for editing the specified resource.
    public function edit(Item $item)
    {
        return Inertia::render('Items/Edit', [
            'item' => $item,
        ]);
    }

    // Update the specified resource in storage.
    public function update(ItemRequest $request, Item $item)
    {
        $item->update($request->validated());

        return redirect()->route('items.index')
            ->with('success', 'Item updated successfully.');
    }

    // Remove the specified resource from storage (archives the item).
    public function destroy(Item $item)
    {
        $item->archive();

        return redirect()->route('items.index')
            ->with('success', 'Item archived successfully.');
    }

    // Archive the specified item.
    public function archive(Item $item)
    {
        // Check if item has stock on hand
        $currentStock = $item->getCurrentStock();
        if ($currentStock > 0) {
            return back()->withErrors([
                'error' => "Cannot archive this item. It currently has {$currentStock} {$item->base_unit} of stock on hand. Please remove or transfer all stock before archiving."
            ]);
        }

        // Check if item is used in any active/pending partner orders
        $hasActiveOrders = \App\Models\PartnerOrderLine::where('product_type', 'App\Models\Item')
            ->where('product_id', $item->id)
            ->whereHas('partnerOrder', function($query) {
                $query->whereIn('status', ['pending', 'confirmed', 'partially_fulfilled']);
            })
            ->exists();

        if ($hasActiveOrders) {
            return back()->withErrors([
                'error' => 'Cannot archive this item. It is currently used in active partner orders (pending, confirmed, or partially fulfilled). Please complete, cancel, or terminate all orders before archiving.'
            ]);
        }

        // Check if item is used in any ongoing contracts
        $ongoingStatuses = ['draft', 'under_review', 'active', 'suspended'];
        
        $hasOngoingContracts = \App\Models\PartnerOrderLine::where('product_type', 'App\Models\Item')
            ->where('product_id', $item->id)
            ->whereHas('partnerOrder.contract', function($query) use ($ongoingStatuses) {
                $query->whereIn('status', $ongoingStatuses);
            })
            ->exists();

        if ($hasOngoingContracts) {
            return back()->withErrors([
                'error' => 'Cannot archive this item. It is currently used in contracts that are draft, under review, active, or suspended. Please terminate, cancel, or complete all contracts before archiving.'
            ]);
        }

        $item->archive();
        return back()->with('success', 'Item archived successfully!');
    }

    // Activate the specified item.
    public function activate(Item $item)
    {
        $item->activate();

        return redirect()->back()
            ->with('success', 'Item activated successfully.');
    }

    // AJAX Uniqueness Check for Item Name.
    public function checkName(Request $request)
    {
        $exists = Item::where('name', $request->name)
            ->when($request->itemId, function ($query) use ($request) {
                $query->where('id', '!=', $request->itemId);
            })
            ->exists();

        if ($exists) {
            return response()->json([
                'errors' => [
                    'name' => ['An item with this name already exists. Please enter a different item name.'],
                ],
            ], 422);
        }
        
        return response()->json(['success' => true]);
    }

    public function export(Request $request)
    {
        $format = $request->query('format', 'pdf');
        
        // Load items with relationships and calculated stock
        $items = Item::query()
            ->select('id', 'name', 'type', 'status', 'price_per_unit', 'base_unit', 'created_at')
            ->orderBy('id', 'asc')
            ->get()
            ->map(function ($item) {
                // Calculate current stock from inventory transactions
                $item->stock_on_hand = $item->getCurrentStock();
                
                // Count pending orders using the correct relationship
                $item->pending_orders_count = \App\Models\PartnerOrderLine::where('product_type', 'App\Models\Item')
                    ->where('product_id', $item->id)
                    ->whereHas('partnerOrder', function($q) {
                        $q->whereIn('status', ['pending', 'confirmed', 'partially_fulfilled']);
                    })
                    ->count();
                
                return $item;
            });

        // Calculate total stock value
        $totalStockValue = $items->sum(function($item) {
            return $item->stock_on_hand * $item->price_per_unit;
        });

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('exports.items_pdf', [
                'items' => $items,
                'totalStockValue' => $totalStockValue,
            ])->setPaper('a4', 'landscape');
            
            return $pdf->download('VigourSeed_ItemList_' . now()->format('Y-m-d') . '.pdf');
        }
    }
    
    public function exportProfile(Item $item)
    {
        // Load transactions with proper filter
        $transactions = InventoryTransaction::where('product_type', 'item')
            ->where('product_id', $item->id)
            ->with('creator')
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate stock on hand
        $stockOnHand = $item->getCurrentStock();

        // Calculate committed stock (pending/partially fulfilled orders)
        $committedStock = \App\Models\PartnerOrderLine::where('product_type', 'App\Models\Item')
            ->where('product_id', $item->id)
            ->whereHas('partnerOrder', function($q) {
                $q->whereIn('status', ['pending', 'confirmed', 'partially_fulfilled'])
                ->whereHas('contract', function($qc) {
                    $qc->where('status', 'active');
                });
            })
            ->sum(\DB::raw('qty - COALESCE(delivered_qty, 0)'));

        // Calculate lifetime units sold (outbound transactions)
        $lifetimeUnitsSold = abs(InventoryTransaction::where('product_type', 'item')
            ->where('product_id', $item->id)
            ->where('transaction_type', 'outbound')
            ->sum('qty'));

        // Get order history
        $orderHistory = \App\Models\PartnerOrderLine::where('product_type', 'App\Models\Item')
            ->where('product_id', $item->id)
            ->with(['partnerOrder.partner', 'partnerOrder.contract'])
            ->get()
            ->map(function($line) {
                return [
                    'order_id' => $line->partner_order_id,
                    'partner_name' => $line->partnerOrder->partner->name ?? 'N/A',
                    'order_status' => $line->partnerOrder->status,
                    'qty_ordered' => $line->qty,
                    'qty_delivered' => $line->delivered_qty ?? 0,
                    'price_at_order' => $line->price_per_unit,
                    'order_date' => $line->partnerOrder->order_date,
                ];
            });

        $pdf = Pdf::loadView('exports.item_profile_pdf', [
            'item' => $item,
            'stockOnHand' => $stockOnHand,
            'committedStock' => $committedStock,
            'lifetimeUnitsSold' => $lifetimeUnitsSold,
            'transactions' => $transactions,
            'orderHistory' => $orderHistory,
            'user' => auth()->user(),
        ])->setPaper('a4', 'landscape');

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="VigourSeed_Item_' . $item->id . '_' . now()->format('Y-m-d') . '.pdf"');
    }
}