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
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use App\Models\PartnerFarm;
use PhpOffice\PhpWord\IOFactory;
use Dompdf\Dompdf;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContractNotification;
use App\Mail\ContractReviewMail; // Uncomment when you have your Mailable
use App\Models\User; // Uncomment if you want to fetch internal users dynamically


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
        $partners = Partner::with('farms:id,partner_id,location_name,soil_type')
            ->select('id', 'name')
            ->get();
        
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
            // Handle file upload
            if ($request->hasFile('contract_file')) {
                $file = $request->file('contract_file');
                $validated['contract_file'] = $file->store('contracts', 'public');
                $validated['original_file_name'] = $file->getClientOriginalName();
            } else {
                // This exception should only trigger if validation was bypassed
                throw new \Exception('Contract file is required.');
            }

            // Create contract (Status defaults to 'draft')
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
        // Eager load all necessary relationships
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
            'partners' => Partner::with('farms:id,partner_id,location_name,soil_type')
                ->select('id', 'name')
                ->get(),
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

            // Restrict $validated array for partial updates
            if ($isPartiallyEditable && !$isFullyEditable) {
                $updatableFields = [
                    'notes',
                    'expiration_date',
                    'buyback_price_per_unit',
                    'contract_file',
                    'original_file_name',
                    'seeds'
                ];
                $validated = array_intersect_key($validated, array_flip($updatableFields));
            }

            $contract->update($validated);

            // 1. FULL EDIT: Delete/recreate commitments (Only allowed if isFullyEditable is true)
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

            // 2. PARTIAL EDIT: Update dynamic fields only
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
            return redirect()->route('contracts.show', $contract->id)
                ->with('success', 'Contract updated successfully.');
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
        // NOTE: $request->validate() is typically preferred over manual checks when possible,
        // but since we need to log context, the current structure is fine.

        // Try to get status from all possible sources
        $status = $request->input('status') ?? ($request->json('status') ?? null);

        if (!$status) {
            // Using the validation error response for consistent front-end error handling
            return redirect()->back()->withErrors([
                'status' => 'The status field is required.'
            ]);
        }

        if (!in_array($status, [
            'draft', 'under_review', 'active', 'suspended', 'terminated', 'cancelled', 'completed'
        ])) {
            return redirect()->back()->withErrors([
                'status' => 'Invalid status value.'
            ]);
        }

        // --- CHECK 1: Model Transition Rule ---
        if (!$contract->canTransitionTo($status)) {
            return redirect()->back()->withErrors([
                'error' => "Cannot transition from {$contract->status} to {$status}. Not allowed by model rules."
            ]);
        }

        // --- CHECK 2: CRITICAL FILE REQUIREMENT ---
        if (in_array($status, ['active', 'under_review']) && !$contract->contract_file) {
            return redirect()->back()->withErrors([
                'status' => 'Contract file is required to move the contract out of draft status.',
            ]);
        }

        // --- EXECUTION: Final Status Update ---
        $contract->update(['status' => $status]);

        return redirect()->back()
            ->with('success', "Contract status successfully changed to {$status}.");
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

    public function sendEmail(Contract $contract)
    {
        // Check missing file/email (your original logic, which is fine for basic check)
        if (!$contract->partner->email || !$contract->contract_file) {
            return redirect()->back()->with('error', 'Missing partner email or contract file.');
        }

        try {
            $to = $contract->partner->email;
            // IMPORTANT: In a real system, you'd fetch this dynamically (User::whereIn('role', ...)->pluck('email'))
            $internalCc = ['legal@yourcompany.com', 'salesmanager@yourcompany.com']; 
            
            // EXECUTION: Uses the Mailable class to send the structured email
            Mail::to($to)->cc($internalCc)->send(new ContractReviewMail($contract, $internalCc));

            \Log::info("Contract #{$contract->id} sent for review via email to: {$to}, CC: " . implode(', ', $internalCc));

            return redirect()->back()->with('success', 'Contract email successfully sent to partner and internal team!');
        } catch (\Exception $e) {
            \Log::error("Email failed for Contract ID {$contract->id}: " . $e->getMessage());
            return redirect()->back()->with('error', 'Email service failed. Please try again or check logs.');
        }
    }

    public function showPartner($id)
    {
        $contract = Contract::findOrFail($id);
        // Add any partner-specific logic/checks here
        return view('partner.contracts.show', compact('contract'));
    }

    public function verifyPartner($id)
    {
        $contract = Contract::findOrFail($id);
        // Add your verification logic here, e.g.:
        $contract->status = 'active';
        $contract->save();

        return redirect()->route('partner.contracts.show', $contract->id)
            ->with('success', 'Contract verified successfully!');
    }
}