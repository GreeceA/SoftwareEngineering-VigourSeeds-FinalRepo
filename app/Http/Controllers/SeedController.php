<?php

namespace App\Http\Controllers;

use App\Http\Requests\SeedRequest;
use App\Models\Seed;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Barryvdh\DomPDF\Facade\Pdf; 

class SeedController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view seeds', only: ['index', 'show']),
            new Middleware('permission:create seeds', only: ['create', 'store']),
            new Middleware('permission:edit seeds', only: ['edit', 'update']),
            new Middleware('permission:archive seeds', only: ['archive', 'restore']),
        ];
    }

    public function index(Request $request)
    {
        $seeds = Seed::query()
            ->with(['contractCommitments.contract']) // <-- Add this to load contracts
            ->when($request->search, function ($query) use ($request) {
                $query->search($request->search);
            })
            ->when($request->status, function ($query) use ($request) {
                if ($request->status === 'active') {
                    $query->active();
                } elseif ($request->status === 'archived') {
                    $query->archived();
                }
            })
            ->when($request->sort_by, function ($query) use ($request) {
                $sortBy = in_array($request->sort_by, ['seed_variety', 'price_per_unit', 'growth_cycle', 'id'])
                    ? $request->sort_by
                    : 'id';
                $sortDir = in_array($request->sort_dir, ['asc', 'desc'])
                    ? $request->sort_dir
                    : 'desc';
                $query->orderBy($sortBy, $sortDir);
            }, function ($query) {
                $query->orderBy('id', 'desc');
            })
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        // Transform data to include contract information and current stock
        $seeds->getCollection()->transform(function ($seed) {
            // Add contracts array for frontend modal
            $seed->contracts = $seed->contractCommitments->map(function ($commitment) {
                return [
                    'id' => $commitment->contract->id,
                    'status' => $commitment->contract->status,
                ];
            });
            
            // Add current stock
            $seed->current_stock = $seed->getCurrentStock();
            
            return $seed;
        });

        return Inertia::render('Seeds/Index', [
            'seeds' => $seeds,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_dir', 'per_page']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Seeds/Create');
    }

    public function store(SeedRequest $request)
    {
        $validated = $request->validated();
        $validated['status'] = 'active';
        Seed::create($validated);
        
        return redirect()->route('seeds.index')->with('success', 'Seed created successfully!');
    }

    public function show(Seed $seed)
    {
        $seed->load(['cornProduct', 'contractCommitments.contract.partner']);

        // Get all contracts associated with this seed (via contract commitments)
        // Remove the status filter to show ALL contracts
        $associatedContracts = $seed->contractCommitments()
            ->with(['contract.partner', 'contract'])
            ->get()
            ->map(function ($commitment) {
                return [
                    'id' => $commitment->contract->id,
                    'contract_name' => $commitment->contract->contract_name,
                    'status' => $commitment->contract->status,
                    'partner_name' => $commitment->contract->partner->name,
                    'start_date' => $commitment->contract->effective_date?->format('Y-m-d'),
                    'end_date' => $commitment->contract->expiration_date?->format('Y-m-d'),
                    'seed_amount' => $commitment->seed_quantity,
                    'unit' => $commitment->unit,
                    'planting_date' => $commitment->planting_date?->format('Y-m-d'),
                    'expected_buyback_amount' => $commitment->expected_buyback_amount,
                    'buyback_unit' => $commitment->buyback_unit,
                ];
            });

        return Inertia::render('Seeds/Show', [
            'seed' => $seed,
            'associatedContracts' => $associatedContracts,
        ]);
    }

    public function edit(Seed $seed)
    {
        return Inertia::render('Seeds/Edit', [
            'seed' => $seed,
        ]);
    }

    public function update(SeedRequest $request, Seed $seed)
    {
        $validated = $request->validated();

        // Always keep the current status (do not change it from the form)
        $validated['status'] = $seed->status;

        $seed->update($validated);
        return redirect()->route('seeds.index')->with('success', 'Seed updated successfully!');
    }

    // Status Modification

    public function archive(Seed $seed)
    {
        // Check if seed is used in any ongoing contracts
        $ongoingStatuses = ['draft', 'under_review', 'active', 'suspended'];
        
        $hasOngoingContracts = $seed->contractCommitments()
            ->whereHas('contract', function($query) use ($ongoingStatuses) {
                $query->whereIn('status', $ongoingStatuses);
            })
            ->exists();

        if ($hasOngoingContracts) {
            return back()->withErrors([
                'error' => 'Cannot archive this seed. It is currently used in ongoing contracts (draft, under review, active, or suspended). Please terminate, cancel, or complete all contracts before archiving.'
            ]);
        }

        // Check if seed has current stock
        $currentStock = $seed->getCurrentStock();
        if ($currentStock > 0) {
            return back()->withErrors([
                'error' => "Cannot archive this seed. It currently has {$currentStock} kg of stock on hand. Please remove or transfer all stock before archiving."
            ]);
        }

        $seed->update(['status' => 'archived']);
        return back()->with('success', 'Seed archived successfully!');
    }

    public function restore(Seed $seed)
    {
        $seed->update(['status' => 'active']);
        return back()->with('success', 'Seed restored successfully!');
    }

    // AJAX Uniqueness Check

    public function checkVariety(Request $request)
    {
        $exists = Seed::where('seed_variety', $request->seed_variety)
            ->when($request->seedId, function ($query) use ($request) {
                $query->where('id', '!=', $request->seedId);
            })
            ->exists();

        if ($exists) {
            return response()->json([
                'errors' => [
                    'seed_variety' => ['A seed variety with this name already exists. Please enter a different variety name.'],
                ],
            ], 422);
        }
        return response()->json(['message' => 'Variety is unique.'], 200);
    }

    public function export(Request $request)
    {
        $format = $request->query('format', 'pdf');
        
        // Load seeds with relationships and calculated stock
        $seeds = Seed::with(['cornProduct', 'contractCommitments' => function($query) {
            $query->whereHas('contract', function($q) {
                $q->where('status', 'active');
            });
        }])
            ->select('id', 'seed_variety', 'status', 'price_per_unit', 'growth_cycle', 'soil_type', 'storage_requirements', 'created_at') // <-- Removed corn_product_id
            ->orderBy('id', 'asc')
            ->get()
            ->map(function ($seed) {
                // Calculate current stock from inventory transactions
                $seed->stock_on_hand = $seed->getCurrentStock();
                
                // Count active contracts via contract commitments
                $seed->contracts_count = $seed->contractCommitments->count();
                
                return $seed;
            });

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('exports.seeds_pdf', compact('seeds'))
                ->setPaper('a4', 'landscape');
            return $pdf->download('VigourSeed_SeedList_' . now()->format('Y-m-d') . '.pdf');
        }
    }

    public function exportProfile(Seed $seed)
    {
        $seed->load([
            'cornProduct',
            'contractCommitments.contract.partner',
            'inventoryTransactions' => function($query) {
                $query->orderBy('created_at', 'desc');
            }
        ]);

        // Calculate stock on hand
        $stockOnHand = $seed->getCurrentStock();

        // Get active contracts count
        $activeContractsCount = $seed->contractCommitments()
            ->whereHas('contract', function($q) {
                $q->where('status', 'active');
            })->count();

        // Get all inventory transactions
        $transactions = $seed->inventoryTransactions;

        // Get all contract commitments
        $contracts = $seed->contractCommitments()
            ->whereHas('contract', function($q) {
                $q->where('status', 'active');
            })
            ->with('contract.partner')
            ->get();

        $pdf = Pdf::loadView('exports.seed_profile_pdf', [
            'seed' => $seed,
            'stockOnHand' => $stockOnHand,
            'activeContractsCount' => $activeContractsCount,
            'transactions' => $transactions,
            'contracts' => $contracts,
            'user' => auth()->user(),
        ])->setPaper('a4', 'landscape');

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="VigourSeed_Seed_' . $seed->id . '_' . now()->format('Y-m-d') . '.pdf"');
    }
}