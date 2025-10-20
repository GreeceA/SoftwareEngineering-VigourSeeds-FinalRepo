<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContractRequest;
use App\Models\Contract;
use App\Models\ContractSeedCommitment;
use App\Models\Partner;
use App\Models\Seed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Mail\ContractReviewMail;

class ContractController extends Controller
{
    /**
     * Display a listing of contracts with filtering, sorting, and search.
     */
    public function index(Request $request)
    {
        $query = Contract::with(['partner', 'contractSeedCommitments.seed']);

        // Apply search
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Apply status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'id');
        $sortDir = $request->get('sort_dir', 'desc');
        
        $validSortColumns = ['id', 'contract_name', 'signing_date', 'effective_date', 'expiration_date', 'status'];
        if (in_array($sortBy, $validSortColumns)) {
            $query->orderBy($sortBy, $sortDir);
        } else {
            $query->latest();
        }

        $perPage = min($request->get('per_page', 15), 100); // Cap at 100
        
        $contracts = $query->paginate($perPage)
            ->through(fn ($contract) => [
                'id' => $contract->id,
                'contract_name' => $contract->contract_name,
                'partner_name' => $contract->partner->name,
                'signing_date' => $contract->signing_date->format('Y-m-d'),
                'effective_date' => $contract->effective_date?->format('Y-m-d'),
                'expiration_date' => $contract->expiration_date?->format('Y-m-d'),
                'seed_varieties' => $contract->contractSeedCommitments
                    ->take(3)
                    ->map(fn ($item) => $item->seed->seed_variety)
                    ->implode(', '),
                'status' => $contract->status,
                'is_expired' => $contract->isExpired(),
                'days_until_expiration' => $contract->getDaysUntilExpiration(),
            ]);

        return Inertia::render('Contracts/Index', [
            'auth' => ['user' => auth()->user()],
            'contracts' => $contracts,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status ?? 'all',
                'sort_by' => $sortBy,
                'sort_dir' => $sortDir,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new contract.
     */
    public function create()
    {
        $partners = Partner::with('farms:id,partner_id,location_name,soil_type,area_size,address')
            ->select('id', 'name', 'email', 'phone')
            ->orderBy('name')
            ->get();
        
        $seeds = Seed::select('id', 'seed_variety', 'price_per_unit', 'growth_cycle', 'soil_type')
            ->orderBy('seed_variety')
            ->get();

        return Inertia::render('Contracts/Create', [
            'auth' => ['user' => auth()->user()],
            'partners' => $partners,
            'seeds' => $seeds,
        ]);
    }

    /**
     * Store a newly created contract in storage.
     */
    public function store(ContractRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            // Handle file upload
            if ($request->hasFile('contract_file')) {
                $file = $request->file('contract_file');
                $validated['contract_file'] = $file->store('contracts', 'public');
                $validated['original_file_name'] = $file->getClientOriginalName();
            }

            // Create contract (status defaults to 'draft')
            $contract = Contract::create($validated);

            // Create seed commitments
            foreach ($validated['seeds'] as $seedData) {
                ContractSeedCommitment::create([
                    'contract_id' => $contract->id,
                    'seed_id' => $seedData['seed_id'],
                    'seed_quantity' => $seedData['seed_quantity'],
                    'unit' => $seedData['unit'],
                    'seed_price_at_contract' => $seedData['seed_price_at_contract'],
                    'planting_date' => $seedData['planting_date'],
                    'expected_first_harvest_date' => $seedData['expected_first_harvest_date'],
                    'agreed_cycles' => $seedData['agreed_cycles'],
                    'expected_buyback_amount' => $seedData['expected_buyback_amount'],
                    'buyback_unit' => $seedData['buyback_unit'],
                ]);
            }

            DB::commit();

            Log::info("Contract created successfully", [
                'contract_id' => $contract->id,
                'user_id' => auth()->id(),
            ]);

            return redirect()->route('contracts.index')
                ->with('success', 'Contract created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Clean up uploaded file if transaction fails
            if (isset($validated['contract_file']) && Storage::disk('public')->exists($validated['contract_file'])) {
                Storage::disk('public')->delete($validated['contract_file']);
            }

            Log::error("Failed to create contract", [
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
            ]);

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create contract. Please try again.']);
        }
    }

    /**
     * Display the specified contract.
     */
    public function show(Contract $contract)
    {
        $contract->load(['partner.farms', 'farm', 'contractSeedCommitments.seed']);

        return Inertia::render('Contracts/Show', [
            'auth' => ['user' => auth()->user()],
            'contract' => [
                'id' => $contract->id,
                'contract_name' => $contract->contract_name,
                'partner' => [
                    'id' => $contract->partner->id,
                    'name' => $contract->partner->name,
                    'email' => $contract->partner->email,
                    'phone' => $contract->partner->phone,
                    'address' => $contract->partner->address,
                ],
                'farm' => $contract->farm ? [
                    'id' => $contract->farm->id,
                    'location_name' => $contract->farm->location_name,
                    'soil_type' => $contract->farm->soil_type,
                    'area_size' => $contract->farm->area_size,
                    'address' => $contract->farm->address,
                ] : null,
                'signing_date' => $contract->signing_date->format('Y-m-d'),
                'effective_date' => $contract->effective_date?->format('Y-m-d'),
                'expiration_date' => $contract->expiration_date?->format('Y-m-d'),
                'created_at' => $contract->created_at?->toISOString(),
                'updated_at' => $contract->updated_at?->toISOString(),
                'notes' => $contract->notes,
                'status' => $contract->status,
                'contract_file' => $contract->contract_file,
                'original_file_name' => $contract->original_file_name,
                'buyback_price_per_unit' => $contract->buyback_price_per_unit,
                'contract_commitments' => $contract->contractSeedCommitments->map(fn ($item) => [
                    'id' => $item->id,
                    'seed' => [
                        'id' => $item->seed->id,
                        'seed_variety' => $item->seed->seed_variety,
                        'growth_cycle' => $item->seed->growth_cycle,
                        'price_per_unit' => $item->seed->price_per_unit,
                    ],
                    'seed_quantity' => $item->seed_quantity,
                    'unit' => $item->unit,
                    'seed_price_at_contract' => $item->seed_price_at_contract,
                    'planting_date' => $item->planting_date->format('Y-m-d'),
                    'expected_first_harvest_date' => $item->expected_first_harvest_date->format('Y-m-d'),
                    'agreed_cycles' => $item->agreed_cycles,
                    'expected_buyback_amount' => $item->expected_buyback_amount,
                    'buyback_unit' => $item->buyback_unit,
                    'total_seed_cost' => $item->getTotalSeedCost(),
                    'total_buyback_value' => $item->getTotalBuybackValue(),
                    'profit_margin_estimate' => $item->getProfitMarginEstimate(),
                ]),
                'can_be_edited' => $contract->canBeEdited(),
                'can_be_partially_edited' => $contract->canBePartiallyEdited(),
                'available_transitions' => $this->getAvailableTransitions($contract),
                'is_expired' => $contract->isExpired(),
                'days_until_expiration' => $contract->getDaysUntilExpiration(),
                'total_expected_buyback' => $contract->getTotalExpectedBuyback(),
                'buyback_fulfillment_percentage' => $contract->getBuybackFulfillmentPercentage(),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified contract.
     */
    public function edit(Contract $contract)
    {
        // Check if contract can be edited
        if (!$contract->canBeEdited() && !$contract->canBePartiallyEdited()) {
            return redirect()->route('contracts.show', $contract->id)
                ->with('error', 'This contract cannot be edited in its current status.');
        }

        $contract->load(['partner.farms', 'farm', 'contractSeedCommitments.seed']);

        return Inertia::render('Contracts/Edit', [
            'auth' => ['user' => auth()->user()],
            'contract' => [
                'id' => $contract->id,
                'contract_name' => $contract->contract_name,
                'partner_id' => $contract->partner_id,
                'farm_id' => $contract->farm_id,
                'partner' => $contract->partner,
                'signing_date' => $contract->signing_date->format('Y-m-d'),
                'effective_date' => $contract->effective_date?->format('Y-m-d'),
                'expiration_date' => $contract->expiration_date?->format('Y-m-d'),
                'notes' => $contract->notes,
                'status' => $contract->status,
                'contract_file' => $contract->contract_file,
                'original_file_name' => $contract->original_file_name,
                'created_at' => $contract->created_at,
                'updated_at' => $contract->updated_at,
                'buyback_price_per_unit' => $contract->buyback_price_per_unit,
                'contractSeedCommitments' => $contract->contractSeedCommitments->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'seed_id' => $item->seed_id,
                        'seed_quantity' => $item->seed_quantity,
                        'unit' => $item->unit,
                        'seed_price_at_contract' => $item->seed_price_at_contract,
                        'planting_date' => $item->planting_date->format('Y-m-d'),
                        'expected_first_harvest_date' => $item->expected_first_harvest_date->format('Y-m-d'),
                        'agreed_cycles' => $item->agreed_cycles,
                        'expected_buyback_amount' => $item->expected_buyback_amount,
                        'buyback_unit' => $item->buyback_unit,
                        'seed' => [
                            'id' => $item->seed->id,
                            'seed_variety' => $item->seed->seed_variety,
                            'growth_cycle' => $item->seed->growth_cycle,
                            'price_per_unit' => $item->seed->price_per_unit,
                        ],
                    ];
                })->values(),
                'can_be_edited' => $contract->canBeEdited(),
                'can_be_partially_edited' => $contract->canBePartiallyEdited(),
            ],
            'partners' => Partner::with('farms:id,partner_id,location_name,soil_type,area_size')
                ->select('id', 'name', 'email')
                ->orderBy('name')
                ->get(),
            'seeds' => Seed::select('id', 'seed_variety', 'price_per_unit', 'growth_cycle', 'soil_type')
                ->orderBy('seed_variety')
                ->get(),
        ]);
    }

    /**
     * Update the specified contract in storage.
     */
    public function update(ContractRequest $request, Contract $contract)
    {
        $isFullyEditable = $contract->canBeEdited();
        $isPartiallyEditable = $contract->canBePartiallyEdited();

        if (!$isFullyEditable && !$isPartiallyEditable) {
            return redirect()->back()->withErrors([
                'error' => 'Contract cannot be edited in its current status.'
            ]);
        }

        $validated = $request->validated();

        DB::beginTransaction();

        try {
            // Handle file upload
            if ($request->hasFile('contract_file')) {
                if ($contract->contract_file && Storage::disk('public')->exists($contract->contract_file)) {
                    Storage::disk('public')->delete($contract->contract_file);
                }
                $file = $request->file('contract_file');
                $validated['contract_file'] = $file->store('contracts', 'public');
                $validated['original_file_name'] = $file->getClientOriginalName();
            }

            // Restrict fields for partial updates
            if ($isPartiallyEditable && !$isFullyEditable) {
                $updatableFields = [
                    'notes',
                    'expiration_date',
                    'buyback_price_per_unit',
                    'contract_file',
                    'original_file_name',
                    'seeds',
                ];
                $validated = array_intersect_key($validated, array_flip($updatableFields));
            }

            // Update contract
            $contract->update($validated);

            // Handle seed commitments
            if ($isFullyEditable && isset($validated['seeds'])) {
                // Full edit: Delete and recreate
                $contract->contractSeedCommitments()->delete();

                foreach ($validated['seeds'] as $seedData) {
                    ContractSeedCommitment::create([
                        'contract_id' => $contract->id,
                        'seed_id' => $seedData['seed_id'],
                        'seed_quantity' => $seedData['seed_quantity'],
                        'unit' => $seedData['unit'],
                        'seed_price_at_contract' => $seedData['seed_price_at_contract'],
                        'planting_date' => $seedData['planting_date'],
                        'expected_first_harvest_date' => $seedData['expected_first_harvest_date'],
                        'agreed_cycles' => $seedData['agreed_cycles'],
                        'expected_buyback_amount' => $seedData['expected_buyback_amount'],
                        'buyback_unit' => $seedData['buyback_unit'],
                    ]);
                }
            } elseif ($isPartiallyEditable && !$isFullyEditable && isset($validated['seeds'])) {
                // Partial edit: Update specific fields only
                foreach ($validated['seeds'] as $seedData) {
                    if (empty($seedData['id'])) {
                        continue;
                    }

                    $updateData = array_intersect_key($seedData, array_flip([
                        'planting_date',
                        'expected_first_harvest_date',
                        'expected_buyback_amount',
                        'agreed_cycles',
                    ]));

                    if (!empty($updateData)) {
                        ContractSeedCommitment::where('id', $seedData['id'])
                            ->where('contract_id', $contract->id) // Security check
                            ->update($updateData);
                    }
                }
            }

            DB::commit();

            Log::info("Contract updated successfully", [
                'contract_id' => $contract->id,
                'user_id' => auth()->id(),
                'edit_type' => $isFullyEditable ? 'full' : 'partial',
            ]);

            return redirect()->route('contracts.show', $contract->id)
                ->with('success', 'Contract updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();

            // Clean up uploaded file if transaction fails
            if (isset($validated['contract_file']) && $request->hasFile('contract_file')) {
                Storage::disk('public')->delete($validated['contract_file']);
            }

            Log::error("Failed to update contract", [
                'contract_id' => $contract->id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
            ]);

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update contract. Please try again.']);
        }
    }

    /**
     * Cancel the specified contract (soft status change).
     */
    public function destroy(Contract $contract)
    {
        if (!in_array($contract->status, ['draft', 'under_review'])) {
            return redirect()->route('contracts.index')
                ->with('error', 'Only draft or under review contracts can be cancelled.');
        }

        try {
            $contract->update(['status' => 'cancelled']);

            Log::info("Contract cancelled", [
                'contract_id' => $contract->id,
                'user_id' => auth()->id(),
            ]);

            return redirect()->route('contracts.index')
                ->with('success', 'Contract cancelled successfully.');

        } catch (\Exception $e) {
            Log::error("Failed to cancel contract", [
                'contract_id' => $contract->id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
            ]);

            return redirect()->back()
                ->with('error', 'Failed to cancel contract. Please try again.');
        }
    }

    /**
     * Change the status of a contract.
     */
    public function changeStatus(Request $request, Contract $contract)
    {
        $status = $request->input('status') ?? $request->json('status');

        if (!$status) {
            return redirect()->back()->withErrors([
                'status' => 'The status field is required.'
            ]);
        }

        $validStatuses = ['draft', 'under_review', 'active', 'suspended', 'terminated', 'cancelled', 'completed'];
        
        if (!in_array($status, $validStatuses)) {
            return redirect()->back()->withErrors([
                'status' => 'Invalid status value.'
            ]);
        }

        // Check if transition is allowed
        if (!$contract->canTransitionTo($status)) {
            return redirect()->back()->withErrors([
                'error' => "Cannot transition from {$contract->status} to {$status}."
            ]);
        }

        // File requirement check for active/under_review statuses
        if (in_array($status, ['active', 'under_review']) && !$contract->contract_file) {
            return redirect()->back()->withErrors([
                'status' => 'Contract file is required before changing status to ' . $status . '.',
            ]);
        }

        try {
            $oldStatus = $contract->status;
            $contract->update(['status' => $status]);

            Log::info("Contract status changed", [
                'contract_id' => $contract->id,
                'old_status' => $oldStatus,
                'new_status' => $status,
                'user_id' => auth()->id(),
            ]);

            return redirect()->back()
                ->with('success', "Contract status successfully changed to {$status}.");

        } catch (\Exception $e) {
            Log::error("Failed to change contract status", [
                'contract_id' => $contract->id,
                'status' => $status,
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
            ]);

            return redirect()->back()
                ->with('error', 'Failed to change contract status. Please try again.');
        }
    }

    /**
     * Send contract email to partner and internal team.
     */
    public function sendEmail(Contract $contract)
    {
        if (!$contract->partner->email) {
            return redirect()->back()->with('error', 'Partner email address is missing.');
        }

        if (!$contract->contract_file) {
            return redirect()->back()->with('error', 'Contract file is missing.');
        }

        try {
            $to = $contract->partner->email;
            $internalCc = config('mail.internal_cc', ['legal@yourcompany.com']);

            Mail::to($to)->cc($internalCc)->send(new ContractReviewMail($contract, $internalCc));

            Log::info("Contract email sent", [
                'contract_id' => $contract->id,
                'recipient' => $to,
                'cc' => $internalCc,
                'user_id' => auth()->id(),
            ]);

            return redirect()->back()
                ->with('success', 'Contract email successfully sent to partner and internal team!');

        } catch (\Exception $e) {
            Log::error("Failed to send contract email", [
                'contract_id' => $contract->id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
            ]);

            return redirect()->back()
                ->with('error', 'Email service failed. Please try again or check logs.');
        }
    }

    /**
     * Check if contract name is unique.
     */
    public function checkNameUnique(Request $request)
    {
        $contractName = trim($request->contract_name);
        $contractId = $request->contractId;

        if (empty($contractName)) {
            return response()->json(['unique' => true]);
        }

        $query = Contract::where('contract_name', $contractName);

        if ($contractId) {
            $query->where('id', '!=', $contractId);
        }

        if ($query->exists()) {
            return response()->json([
                'message' => 'A contract with this name already exists.'
            ], 422);
        }

        return response()->json(['unique' => true]);
    }

    /**
     * Get available status transitions for a contract.
     */
    private function getAvailableTransitions(Contract $contract): array
    {
        $transitions = [
            'draft' => ['under_review', 'cancelled'],
            'under_review' => ['draft', 'active', 'cancelled'],
            'active' => ['suspended', 'terminated', 'completed'],
            'suspended' => ['active', 'terminated'],
            'terminated' => ['completed'],
            'cancelled' => ['completed'],
            'completed' => [],
        ];

        return $transitions[$contract->status] ?? [];
    }
}