<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\ContractSeedItem;
use App\Models\Partner;
use App\Models\Seed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class ContractController extends Controller
{
    public function index()
    {
        $contracts = Contract::with(['partner', 'contractSeedItems.seed'])
            ->latest()
            ->paginate(15)
            ->through(fn ($contract) => [
                'id' => $contract->id,
                'title' => $contract->title,
                'partner_name' => $contract->partner->name,
                'contract_date' => $contract->contract_date->format('Y-m-d'),
                'effective_date' => $contract->effective_date?->format('Y-m-d'),
                'expiration_date' => $contract->expiration_date?->format('Y-m-d'),
                'seed_varieties' => $contract->contractSeedItems
                    ->take(3)
                    ->map(fn ($item) => $item->seed->seed_variety)
                    ->implode(', '),
                'status' => $contract->status,
            ]);

        return Inertia::render('Contracts/Index', [
            'auth' => ['user' => auth()->user()],
            'contracts' => $contracts,
            'filters' => request()->all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Contracts/Create', [
            'partners' => Partner::select('id', 'name')->get(),
            'seeds' => Seed::select('id', 'seed_variety', 'price_per_unit', 'growth_cycle')->get(), // <-- add growth_cycle
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'partner_id' => 'required|exists:partners,id',
            'contract_date' => 'required|date',
            'effective_date' => 'nullable|date|after_or_equal:contract_date',
            'expiration_date' => 'nullable|date|after:effective_date',
            'notes' => 'nullable|string',
            'contract_file' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'seeds' => 'required|array|min:1|max:3',
            'seeds.*.seed_id' => 'required|exists:seeds,id',
            'seeds.*.quantity' => 'required|integer|min:1',
            'seeds.*.unit' => ['required', Rule::in(['kg', 'sack', 'ton'])],
            'seeds.*.expected_harvest_date' => 'required|date|after:contract_date',
            'seeds.*.cycles' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            // Handle file upload
            if ($request->hasFile('contract_file')) {
                $validated['contract_file'] = $request->file('contract_file')
                    ->store('contracts', 'public');
            }

            // Create contract
            $contract = Contract::create($validated);

            // Create seed items
            foreach ($validated['seeds'] as $seedData) {
                ContractSeedItem::create([
                    'contract_id' => $contract->id,
                    'seed_id' => $seedData['seed_id'],
                    'quantity' => $seedData['quantity'],
                    'unit' => $seedData['unit'],
                    'expected_harvest_date' => $seedData['expected_harvest_date'],
                    'cycles' => $seedData['cycles'],
                ]);
            }

            DB::commit();

            return redirect()->route('contracts.index')
                ->with('success', 'Contract created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function show(Contract $contract)
    {
        $contract->load(['partner', 'contractSeedItems.seed']);

        return Inertia::render('Contracts/Show', [
            'contract' => [
                'id' => $contract->id,
                'title' => $contract->title,
                'partner' => $contract->partner,
                'contract_date' => $contract->contract_date->format('Y-m-d'),
                'effective_date' => $contract->effective_date?->format('Y-m-d'),
                'created_at' => $contract->created_at?->toISOString(),
                'updated_at' => $contract->updated_at?->toISOString(),
                'expiration_date' => $contract->expiration_date?->format('Y-m-d'),
                'notes' => $contract->notes,
                'status' => $contract->status,
                'contract_file' => $contract->contract_file,
                'seed_items' => $contract->contractSeedItems->map(fn ($item) => [
                    'id' => $item->id,
                    'seed' => $item->seed,
                    'quantity' => $item->quantity,
                    'unit' => $item->unit,
                    'expected_harvest_date' => $item->expected_harvest_date->format('Y-m-d'),
                    'cycles' => $item->cycles,
                ]),
                'can_be_edited' => $contract->canBeEdited(),
                'can_be_partially_edited' => $contract->canBePartiallyEdited(),
                'available_transitions' => $this->getAvailableTransitions($contract),
            ],
        ]);
    }

    public function edit(Contract $contract)
    {
        $contract->load(['partner', 'contractSeedItems.seed']);

        return Inertia::render('Contracts/Edit', [
            'auth' => ['user' => auth()->user()],
            'contract' => $contract,
            'partners' => Partner::all(),
            'seeds' => Seed::all(),
        ]);
    }

    public function update(Request $request, Contract $contract)
    {
        $isFullyEditable = $contract->canBeEdited();
        $isPartiallyEditable = $contract->canBePartiallyEdited();

        if (!$isFullyEditable && !$isPartiallyEditable) {
            return redirect()->back()->withErrors([
                'error' => 'Contract cannot be edited in its current status.'
            ]);
        }

        // Build validation rules based on edit permissions
        $rules = [
            'notes' => 'nullable|string',
        ];

        if ($isFullyEditable) {
            $rules = array_merge($rules, [
                'title' => 'required|string|max:255',
                'partner_id' => 'required|exists:partners,id',
                'contract_date' => 'required|date',
                'effective_date' => 'nullable|date|after_or_equal:contract_date',
                'expiration_date' => 'nullable|date|after:effective_date',
                'contract_file' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
                'seeds' => 'required|array|min:1|max:3',
                'seeds.*.seed_id' => 'required|exists:seeds,id',
                'seeds.*.quantity' => 'required|integer|min:1',
                'seeds.*.unit' => ['required', Rule::in(['kg', 'sack', 'ton'])],
                'seeds.*.expected_harvest_date' => 'required|date|after:contract_date',
                'seeds.*.cycles' => 'required|integer|min:1',
            ]);
        } elseif ($isPartiallyEditable) {
            $rules = array_merge($rules, [
                'expiration_date' => 'nullable|date|after:effective_date',
                'contract_file' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            ]);
        }

        $validated = $request->validate($rules);

        DB::beginTransaction();

        try {
            // Handle file upload
            if ($request->hasFile('contract_file')) {
                // Delete old file if exists
                if ($contract->contract_file) {
                    Storage::disk('public')->delete($contract->contract_file);
                }
                $validated['contract_file'] = $request->file('contract_file')
                    ->store('contracts', 'public');
            }

            // Update contract
            $contract->update($validated);

            // Update seed items only if fully editable
            if ($isFullyEditable && isset($validated['seeds'])) {
                // Delete existing seed items
                $contract->contractSeedItems()->delete();

                // Create new seed items
                foreach ($validated['seeds'] as $seedData) {
                    ContractSeedItem::create([
                        'contract_id' => $contract->id,
                        'seed_id' => $seedData['seed_id'],
                        'quantity' => $seedData['quantity'],
                        'unit' => $seedData['unit'],
                        'expected_harvest_date' => $seedData['expected_harvest_date'],
                        'cycles' => $seedData['cycles'],
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('contracts.index')
                ->with('success', 'Contract updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function destroy(Contract $contract)
    {
        $contract->update(['status' => 'archived']);

        return redirect()->route('contracts.index')
            ->with('success', 'Contract archived successfully.');
    }

    public function changeStatus(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in([
                'draft', 'active', 'suspended', 'terminated', 'cancelled', 'archived'
            ])],
        ]);

        $newStatus = $validated['status'];

        if (!$contract->canTransitionTo($newStatus)) {
            return redirect()->back()->withErrors([
                'error' => "Cannot transition from {$contract->status} to {$newStatus}."
            ]);
        }

        // Special validation for activating contract
        if ($newStatus === 'active' && !$contract->contract_file) {
            return redirect()->back()->withErrors([
                'error' => 'Contract file is required to activate the contract.'
            ]);
        }

        $contract->update(['status' => $newStatus]);

        return redirect()->back()
            ->with('success', "Contract status changed to {$newStatus}.");
    }

    public function searchPartners(Request $request)
    {
        $query = $request->get('q');
        
        $partners = Partner::select('id', 'name')
            ->when($query, function ($q) use ($query) {
                return $q->where('name', 'like', "%{$query}%");
            })
            ->limit(10)
            ->get();

        return response()->json($partners);
    }

    private function getAvailableTransitions($contract)
{
    // Example transitions, adjust as needed for your business logic
    $transitions = [
        'draft' => ['active', 'archived'],
        'active' => ['suspended', 'terminated', 'cancelled', 'archived'],
        'suspended' => ['active', 'terminated', 'archived'],
        'terminated' => ['archived'],
        'cancelled' => ['archived'],
        'archived' => [],
    ];

    return $transitions[$contract->status] ?? [];
}
}