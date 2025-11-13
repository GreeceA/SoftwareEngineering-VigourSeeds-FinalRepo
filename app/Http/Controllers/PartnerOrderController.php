<?php

namespace App\Http\Controllers;

use App\Models\PartnerOrder;
use App\Models\PartnerOrderLine;
use App\Models\Contract;
use App\Models\Partner;
use App\Models\Seed;
use App\Models\Item;
use App\Models\ContractSeedCommitment;
use App\Http\Requests\StorePartnerOrderRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Barryvdh\DomPDF\Facade\Pdf;

class PartnerOrderController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view inventory', only: ['index', 'show']),
            new Middleware('permission:create inventory', only: ['create', 'store', 'cancel']),
        ];
    }

    /**
     * Display all partner orders
     */
    public function index(Request $request)
    {
        $query = PartnerOrder::with([
            'partner',
            'contract',
            'lines.product',
            'buyback_transactions'
        ])->orderBy('created_at', 'desc');

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

        // Map paginated items for frontend
        $orders->getCollection()->transform(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'order_date' => $order->order_date,
                'status' => $order->status,
                'partner' => $order->partner,
                'contract' => $order->contract,
                'notes' => $order->notes,
                'fulfillment_percentage' => $order->getFulfillmentPercentage(),
                'lines' => $order->lines->map(function ($line) {
                    $availableStock = 0;
                    if ($line->product) {
                        if (method_exists($line->product, 'getCurrentStock')) {
                            $availableStock = $line->product->getCurrentStock();
                        } elseif (property_exists($line->product, 'available_stock')) {
                            $availableStock = $line->product->available_stock;
                        }
                    }
                    return [
                        'id' => $line->id,
                        'product_id' => $line->product_id,
                        'product_type' => $line->product_type,
                        'qty' => $line->qty,
                        'unit' => $line->unit,
                        'price_per_unit' => $line->price_per_unit,
                        'product' => [
                            'id' => $line->product?->id,
                            'name' => $line->product?->name ?? $line->product?->seed_variety ?? '',
                            'available_stock' => $availableStock,
                        ],
                    ];
                }),
            ];
        });

        return Inertia::render('PartnerOrders/Index', [
            'orders' => $orders,
            'partnerOrders' => $orders,
            'partners' => $partners,
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

        $fertilizers = Item::where('type', 'fertilizer')
            ->where('status', 'active')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'unit' => $item->base_unit,
                    'price' => $item->price_per_unit,
                    'available_stock' => $item->getCurrentStock(),
                ];
            })
            ->filter(function ($item) {
                return $item['available_stock'] > 0;
            })
            ->values();

        $pesticides = Item::where('type', 'pesticide')
            ->where('status', 'active')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'unit' => $item->base_unit,
                    'price' => $item->price_per_unit,
                    'available_stock' => $item->getCurrentStock(),
                ];
            })
            ->filter(function ($item) {
                return $item['available_stock'] > 0;
            })
            ->values();

        return Inertia::render('PartnerOrders/Create', [
            'partners' => $partners,
            'contracts' => $contracts,
            'fertilizers' => $fertilizers,
            'pesticides' => $pesticides,
        ]);
    }

    /**
     * Store new partner order
     */
    public function store(StorePartnerOrderRequest $request)
    {
        $validated = $request->validated();

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
                    'product_type' => Item::class,
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
                    'product_name' => $line->product?->name ?? '',
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
        $partnerOrder = PartnerOrder::with([
            'partner',
            'contract',
            'lines.product',
            'inventoryTransactions.product',
            'creator'
        ])->findOrFail($id);

        $deliveryTransactions = \App\Models\InventoryTransaction::with(['creator', 'seed', 'item'])
            ->where('partner_order_id', $partnerOrder->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($tx) use ($partnerOrder) {
                // Get product name
                $productName = '-';
                if ($tx->product_type === 'seed' || $tx->product_type === 'App\\Models\\Seed') {
                    $productName = $tx->seed?->seed_variety ?? '-';
                } elseif ($tx->product_type === 'item' || $tx->product_type === 'App\\Models\\Item') {
                    $productName = $tx->item?->name ?? '-';
                }

                // Normalize transaction product type
                $txTypeNormalized = $tx->product_type;
                if ($txTypeNormalized === 'App\\Models\\Seed') {
                    $txTypeNormalized = 'seed';
                } elseif ($txTypeNormalized === 'App\\Models\\Item') {
                    $txTypeNormalized = 'item';
                }

                // Find the matching order line
                $orderLine = $partnerOrder->lines->first(function ($line) use ($tx, $txTypeNormalized) {
                    // Normalize line product type
                    $lineTypeNormalized = $line->product_type;
                    if ($lineTypeNormalized === 'App\\Models\\Seed') {
                        $lineTypeNormalized = 'seed';
                    } elseif ($lineTypeNormalized === 'App\\Models\\Item') {
                        $lineTypeNormalized = 'item';
                    }

                    // Match both product_id and normalized product_type
                    return $line->product_id == $tx->product_id
                        && $lineTypeNormalized === $txTypeNormalized;
                });

                $pricePerUnit = $orderLine ? $orderLine->price_per_unit : 0;

                // Convert quantity to base unit (kg/liter) for value calculation
                $qtyBase = abs($tx->qty);
                if ($tx->unit === 'sack') {
                    $qtyBase = $qtyBase * 50;
                } elseif ($tx->unit === 'ton') {
                    $qtyBase = $qtyBase * 1000;
                }

                // Calculate value
                $value = $qtyBase * $pricePerUnit;

                return [
                    'id' => $tx->id,
                    'product_name' => $productName,
                    'transaction_type' => $tx->transaction_type,
                    'quantity' => abs($tx->qty),
                    'unit' => $tx->unit,
                    'date' => $tx->created_at->format('Y-m-d H:i'),
                    'notes' => $tx->notes,
                    'delivered_by' => $tx->creator
                        ? trim(($tx->creator->first_name ?? '') . ' ' . ($tx->creator->last_name ?? ''))
                        : '-',
                    'value' => $value,
                ];
            });

        return Inertia::render('PartnerOrders/Show', [
            'auth' => ['user' => auth()->user()],
            'partnerOrder' => [
                'id' => $partnerOrder->id,
                'order_number' => $partnerOrder->order_number ?? 'PO-' . $partnerOrder->id,
                'order_date' => $partnerOrder->order_date->format('Y-m-d'),
                'status' => $partnerOrder->status,
                'notes' => $partnerOrder->notes,
                'partner' => [
                    'id' => $partnerOrder->partner->id,
                    'name' => $partnerOrder->partner->name,
                    'contact' => $partnerOrder->partner->phone,
                ],
                'contract' => $partnerOrder->contract ? [
                    'id' => $partnerOrder->contract->id,
                    'contract_name' => $partnerOrder->contract->contract_name,
                    'contract_number' => $partnerOrder->contract->contract_number,
                    'buyback_price_per_unit' => $partnerOrder->contract->buyback_price_per_unit,
                    'farm_name' => $partnerOrder->contract->farm?->location_name,
                    'farm_location' => $partnerOrder->contract->farm?->address,
                    'effective_date' => $partnerOrder->contract->effective_date?->format('Y-m-d'),
                    'expiration_date' => $partnerOrder->contract->expiration_date?->format('Y-m-d'),
                ] : null,
                'lines' => $partnerOrder->lines->map(function ($line) {
                    // Get available stock from product
                    $availableStock = 0;
                    if ($line->product) {
                        if (method_exists($line->product, 'getCurrentStock')) {
                            $availableStock = $line->product->getCurrentStock();
                        } elseif (property_exists($line->product, 'available_stock')) {
                            $availableStock = $line->product->available_stock;
                        }
                    }
                    return [
                        'id' => $line->id,
                        'product_type' => $line->product_type === 'App\\Models\\Item'
                            ? (Item::find($line->product_id)?->type ?? 'item')
                            : $line->product_type,
                        'product_name' => ($line->product_type === 'seed' || $line->product_type === 'App\\Models\\Seed')
                            ? ($line->product?->seed_variety ?? '')
                            : ($line->product?->name ?? ''),
                        'qty' => $line->qty,
                        'unit' => $line->unit,
                        'delivered_qty' => $line->delivered_qty,
                        'price_per_unit' => $line->price_per_unit,
                        'total_value' => $line->getTotalValue(),
                        'available_stock' => $availableStock, // <-- Pass available stock!
                    ];
                }),
                'fulfillment_percentage' => $partnerOrder->getFulfillmentPercentage(),
                'total_value' => $partnerOrder->getTotalValue(),
                'buyback_transactions' => $deliveryTransactions,
            ],
        ]);
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

    public function export(Request $request)
    {
        $query = PartnerOrder::with(['partner', 'contract', 'lines.product'])
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('partner_id')) {
            $query->where('partner_id', $request->partner_id);
        }

        if ($request->filled('contract_status')) {
            $query->whereHas('contract', function ($q) use ($request) {
                $q->where('status', $request->contract_status);
            });
        }

        $orders = $query->get();

        // Calculate total value and add fulfillment percentage
        $orders->transform(function ($order) {
            $totalValue = $order->lines->sum(function ($line) {
                $qty = $line->qty;
                // Convert to base unit (kg)
                if ($line->unit === 'sack') {
                    $qty = $qty * 50;
                } elseif ($line->unit === 'ton') {
                    $qty = $qty * 1000;
                }
                return $qty * $line->price_per_unit;
            });

            $order->total_value = $totalValue;
            $order->fulfillment_percentage = $order->getFulfillmentPercentage();

            return $order;
        });

        $totalValue = $orders->sum('total_value');

        $hasFilters = $request->filled('status') ||
                      $request->filled('partner_id') ||
                      $request->filled('contract_status');

        $partnerName = '';
        if ($request->filled('partner_id')) {
            $partner = Partner::find($request->partner_id);
            $partnerName = $partner ? $partner->name : '';
        }

        $pdf = Pdf::loadView('exports.partner_orders_pdf', [
            'orders' => $orders,
            'totalValue' => $totalValue,
            'filters' => $request->only(['status', 'partner_id', 'contract_status']),
            'hasFilters' => $hasFilters,
            'partnerName' => $partnerName,
            'user' => Auth::user(),
            'generationDate' => now()->format('F d, Y - h:i A')
        ])->setPaper('A4', 'landscape');

        return $pdf->download('VigourSeed_PartnerOrders_' . now()->format('Y-m-d') . '.pdf');
    }

    public function exportDeliveryHistory($id)
    {
        $partnerOrder = PartnerOrder::with([
            'partner',
            'contract.farm',
            'lines.product',
        ])->findOrFail($id);

        $deliveryTransactions = \App\Models\InventoryTransaction::with(['creator', 'seed', 'item'])
            ->where('partner_order_id', $partnerOrder->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($tx) use ($partnerOrder) {
                // Get product name
                $productName = '-';
                if ($tx->product_type === 'seed' || $tx->product_type === 'App\\Models\\Seed') {
                    $productName = $tx->seed?->seed_variety ?? '-';
                } elseif ($tx->product_type === 'item' || $tx->product_type === 'App\\Models\\Item') {
                    $productName = $tx->item?->name ?? '-';
                }

                // Normalize transaction product type
                $txTypeNormalized = $tx->product_type;
                if ($txTypeNormalized === 'App\\Models\\Seed') {
                    $txTypeNormalized = 'seed';
                } elseif ($txTypeNormalized === 'App\\Models\\Item') {
                    $txTypeNormalized = 'item';
                }

                // Find the matching order line
                $orderLine = $partnerOrder->lines->first(function ($line) use ($tx, $txTypeNormalized) {
                    $lineTypeNormalized = $line->product_type;
                    if ($lineTypeNormalized === 'App\\Models\\Seed') {
                        $lineTypeNormalized = 'seed';
                    } elseif ($lineTypeNormalized === 'App\\Models\\Item') {
                        $lineTypeNormalized = 'item';
                    }
                    return $line->product_id == $tx->product_id
                        && $lineTypeNormalized === $txTypeNormalized;
                });

                $pricePerUnit = $orderLine ? $orderLine->price_per_unit : 0;

                // Convert quantity to base unit (kg/liter) for value calculation
                $qtyBase = abs($tx->qty);
                if ($tx->unit === 'sack') {
                    $qtyBase = $qtyBase * 50;
                } elseif ($tx->unit === 'ton') {
                    $qtyBase = $qtyBase * 1000;
                }

                // Calculate value
                $value = $qtyBase * $pricePerUnit;

                return [
                    'id' => $tx->id,
                    'product_name' => $productName,
                    'transaction_type' => $tx->transaction_type,
                    'quantity' => abs($tx->qty),
                    'unit' => $tx->unit,
                    'date' => $tx->created_at->format('Y-m-d H:i'),
                    'notes' => $tx->notes,
                    'delivered_by' => $tx->creator
                        ? trim(($tx->creator->first_name ?? '') . ' ' . ($tx->creator->last_name ?? ''))
                        : '-',
                    'value' => $value,
                ];
            });

        // Format order lines data
        $orderLines = $partnerOrder->lines->map(function ($line) {
            // Get product type and name
            $productType = '';
            $productName = '';

            if ($line->product_type === 'seed' || $line->product_type === 'App\\Models\\Seed') {
                $productType = 'seed';
                $productName = $line->product?->seed_variety ?? '-';
            } elseif ($line->product_type === 'item' || $line->product_type === 'App\\Models\\Item') {
                $item = $line->product;
                $productType = $item?->type ?? 'item';
                $productName = $item?->name ?? '-';
            }

            // Convert to base unit for total value calculation
            $qtyBase = $line->qty;
            if ($line->unit === 'sack') {
                $qtyBase = $qtyBase * 50;
            } elseif ($line->unit === 'ton') {
                $qtyBase = $qtyBase * 1000;
            }

            $totalValue = $qtyBase * $line->price_per_unit;

            return [
                'product_type' => $productType,
                'product_name' => $productName,
                'qty' => $line->qty,
                'unit' => $line->unit,
                'delivered_qty' => $line->delivered_qty,
                'price_per_unit' => $line->price_per_unit,
                'total_value' => $totalValue,
            ];
        });

        // Get contract details
        $contract = $partnerOrder->contract;
        $contractPeriod = null;
        if ($contract && $contract->effective_date && $contract->expiration_date) {
            $contractPeriod = $contract->effective_date->format('Y-m-d') . ' to ' . $contract->expiration_date->format('Y-m-d');
        }

        $pdf = Pdf::loadView('exports.delivery_transactions_pdf', [
            'transactions' => collect($deliveryTransactions),
            'orderLines' => $orderLines,
            'orderId' => $partnerOrder->id,
            'orderNumber' => $partnerOrder->order_number ?? 'PO-' . ($contract?->contract_name ?? 'ORDER') . '-' . $partnerOrder->id,
            'orderDate' => $partnerOrder->order_date->format('F d, Y'),
            'orderStatus' => $partnerOrder->status,
            'partnerName' => $partnerOrder->partner->name,
            'partnerContact' => $partnerOrder->partner->phone ?? 'N/A',
            'contractName' => $contract?->contract_name,
            'contractPeriod' => $contractPeriod,
            'buybackPrice' => $contract?->buyback_price_per_unit ?? 0,
            'farmName' => $contract?->farm?->location_name ?? 'N/A',
            'farmLocation' => $contract?->farm?->address ?? '',
            'fulfillmentPercentage' => $partnerOrder->getFulfillmentPercentage(),
            'user' => Auth::user(),
            'generationDate' => now()->format('F d, Y - h:i A')
        ])->setPaper('A4', 'landscape');

        return $pdf->download('VigourSeed_DeliveryHistory_PO' . $partnerOrder->id . '_' . now()->format('Y-m-d') . '.pdf');
    }
}