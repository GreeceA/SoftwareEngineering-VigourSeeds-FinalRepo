<?php
namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\ContractSeedCommitment; 
use App\Models\Partner;
use App\Models\Seed;
use App\Models\PartnerFarm;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use App\Http\Requests\ContractRequest; 
use Illuminate\Http\Request;

class ContractController extends Controller
{
    public function index()
    {
        $contracts = Contract::with(['partner', 'contractSeedCommitments.seed'])
            ->latest()
            ->paginate(15)
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
            ]);

        return Inertia::render('Contracts/Index', [
            'auth' => ['user' => auth()->user()],
            'contracts' => $contracts,
            'filters' => request()->all(),
        ]);
    }

    public function create()
    {
        $partners = Partner::with('farms:id,partner_id,location_name,soil_type')->select('id', 'name')->get(); 
        $seeds = Seed::select('id', 'seed_variety', 'price_per_unit', 'growth_cycle', 'soil_type')->get(); 

        return Inertia::render('Contracts/Create', [
            'partners' => $partners,
            'seeds' => $seeds, 
        ]);
    }

    public function store(ContractRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            if ($request->hasFile('contract_file')) {
                $file = $request->file('contract_file');
                $validated['contract_file'] = $file->store('contracts', 'public');
                $validated['original_file_name'] = $file->getClientOriginalName();
            } else {
                throw new \Exception('Contract file is required.');
            }

            $contract = Contract::create($validated); 

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

            return redirect()->route('contracts.index')
                ->with('success', 'Contract created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($validated['contract_file']) && Storage::disk('public')->exists($validated['contract_file'])) {
                Storage::disk('public')->delete($validated['contract_file']);
            }
            return redirect()->back()->withInput()->withErrors(['error' => 'Failed to create contract: ' . $e->getMessage()]);
        }
    }

    public function show(Contract $contract)
    {
        $contract->load(['partner.farms', 'farm', 'contractSeedCommitments.seed']);

        return Inertia::render('Contracts/Show', [
            'contract' => [
                'id' => $contract->id,
                'contract_name' => $contract->contract_name,
                'partner' => $contract->partner,
                'farm' => $contract->farm,
                'signing_date' => $contract->signing_date->format('Y-m-d'),
                'effective_date' => $contract->effective_date?->format('Y-m-d'),
                'created_at' => $contract->created_at?->toISOString(),
                'updated_at' => $contract->updated_at?->toISOString(),
                'expiration_date' => $contract->expiration_date?->format('Y-m-d'),
                'notes' => $contract->notes,
                'status' => $contract->status,
                'contract_file' => $contract->contract_file,
                'original_file_name' => $contract->original_file_name,
                'buyback_price_per_unit' => $contract->buyback_price_per_unit,
                'contract_commitments' => $contract->contractSeedCommitments->map(fn ($item) => [
                    'id' => $item->id,
                    'seed' => $item->seed,
                    'seed_quantity' => $item->seed_quantity,
                    'unit' => $item->unit,
                    'seed_price_at_contract' => $item->seed_price_at_contract,
                    'planting_date' => $item->planting_date->format('Y-m-d'), 
                    'expected_first_harvest_date' => $item->expected_first_harvest_date->format('Y-m-d'),
                    'agreed_cycles' => $item->agreed_cycles,
                    'expected_buyback_amount' => $item->expected_buyback_amount,
                    'buyback_unit' => $item->buyback_unit,
                ]),
                'can_be_edited' => $contract->canBeEdited(),
                'can_be_partially_edited' => $contract->canBePartiallyEdited(),
                'available_transitions' => $this->getAvailableTransitions($contract),
            ],
        ]);
    }

    public function edit(Contract $contract)
    {
        $contract->load(['partner.farms', 'farm', 'contractSeedCommitments.seed']);

        return Inertia::render('Contracts/Edit', [
            'auth' => ['user' => auth()->user()],
            'contract' => [
                'id' => $contract->id,
                'contract_name' => $contract->contract_name,
                'partner_id' => $contract->partner_id,
                'farm_id' => $contract->farm_id,
                'partner' => $contract->partner,
                'signing_date' => $contract->signing_date ? $contract->signing_date->format('Y-m-d') : null,
                'effective_date' => $contract->effective_date ? $contract->effective_date->format('Y-m-d') : null,
                'expiration_date' => $contract->expiration_date ? $contract->expiration_date->format('Y-m-d') : null,
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
                        'planting_date' => $item->planting_date ? $item->planting_date->format('Y-m-d') : null, 
                        'expected_first_harvest_date' => $item->expected_first_harvest_date ? $item->expected_first_harvest_date->format('Y-m-d') : null,
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
            ],
            'partners' => Partner::with('farms:id,partner_id,location_name,soil_type')->select('id', 'name')->get(),
            'seeds' => Seed::select('id', 'seed_variety', 'price_per_unit', 'growth_cycle', 'soil_type')->get(),
        ]);
    }

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
            if ($request->hasFile('contract_file')) {
                if ($contract->contract_file) {
                    Storage::disk('public')->delete($contract->contract_file);
                }
                $file = $request->file('contract_file');
                $validated['contract_file'] = $file->store('contracts', 'public');
                $validated['original_file_name'] = $file->getClientOriginalName();
            }

            // Only allow certain fields for partial edit
            if ($isPartiallyEditable && !$isFullyEditable) {
                $updatableFields = ['notes', 'expiration_date', 'buyback_price_per_unit', 'contract_file', 'original_file_name'];
                $validated = array_intersect_key($validated, array_flip($updatableFields));
            }

            $contract->update($validated);

            if ($isFullyEditable && isset($validated['seeds'])) {
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
            }
            
            if ($isPartiallyEditable && !$isFullyEditable && isset($validated['seeds'])) {
                foreach ($validated['seeds'] as $seedData) {
                    ContractSeedCommitment::where('id', $seedData['id'])->update([
                        'planting_date' => $seedData['planting_date'],
                        'expected_first_harvest_date' => $seedData['expected_first_harvest_date'],
                        'expected_buyback_amount' => $seedData['expected_buyback_amount'] ?? ContractSeedCommitment::find($seedData['id'])->expected_buyback_amount,
                    ]);
                }
            }

            DB::commit();
            return redirect()->route('contracts.index')->with('success', 'Contract updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($validated['contract_file']) && $request->hasFile('contract_file')) {
                Storage::disk('public')->delete($validated['contract_file']);
            }
            return redirect()->back()->withInput()->withErrors(['error' => 'Failed to update contract: ' . $e->getMessage()]);
        }
    }

    public function destroy(Contract $contract)
    {
        $contract->update(['status' => 'cancelled']); 

        return redirect()->route('contracts.index')
            ->with('success', 'Contract cancelled successfully.');
    }

    public function changeStatus(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in([
                'draft', 'under_review', 'active', 'suspended', 'terminated', 'cancelled', 'completed'
            ])],
        ]);

        $newStatus = $validated['status'];

        if (!$contract->canTransitionTo($newStatus)) {
            return redirect()->back()->withErrors([
                'error' => "Cannot transition from {$contract->status} to {$newStatus}."
            ]);
        }

        if (in_array($newStatus, ['active', 'under_review']) && !$contract->contract_file) {
            return redirect()->back()->withErrors([
                'error' => 'Contract file is required to move the contract out of draft status.'
            ]);
        }

        $contract->update(['status' => $newStatus]);

        return redirect()->back()
            ->with('success', "Contract status changed to {$newStatus}.");
    }

    private function getAvailableTransitions($contract)
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
    
    private function makeDownloadName($contract, $ext)
    {
        $title = preg_replace('/[^A-Za-z0-9]+/', '_', $contract->contract_name);
        $partner = preg_replace('/[^A-Za-z0-9]+/', '_', $contract->partner->name);
        $date = $contract->signing_date ? date('Ymd', strtotime($contract->signing_date)) : 'nodate'; 
        return "{$title}_{$partner}_{$date}_Contract.{$ext}";
    }
}