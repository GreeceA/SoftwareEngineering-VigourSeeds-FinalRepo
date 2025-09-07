<?php
// app/Http/Controllers/ContractController.php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Partner;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ContractController extends Controller
{
    /**
     * Display a listing of the contracts.
     */
    public function index()
    {
        $contracts = Contract::with('partner')
            ->latest()
            ->get();

        return Inertia::render('Contracts/Index', [
            'contracts' => $contracts
        ]);
    }

    /**
     * Show the form for creating a new contract.
     */
    public function create()
    {
        $partners = Partner::select('id', 'name')->get();
        $seedOptions = Contract::getSeedOptions();
        $statusOptions = Contract::getStatusOptions();

        return Inertia::render('Contracts/Create', [
            'partners' => $partners,
            'seedOptions' => $seedOptions,
            'statusOptions' => $statusOptions
        ]);
    }

    /**
     * Store a newly created contract in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'contract_title' => 'required|string|max:255',
            'partner_id' => 'required|exists:partners,id',
            'contract_file' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10MB max
            'contract_date' => 'required|date',
            'effective_date' => 'required|date',
            'expiration_date' => 'required|date|after:effective_date',
            'seed' => 'required|in:' . implode(',', Contract::getSeedOptions()),
            'seed_quantity' => 'required|integer|min:1',
            'unit_of_measurement' => 'required|string|max:50',
            'expected_harvest_date' => 'required|date',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:draft,active,archived'
        ]);

        // Handle file upload
        if ($request->hasFile('contract_file')) {
            $file = $request->file('contract_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('contracts', $filename, 'public');
            $validated['contract_file'] = $path;
        }

        Contract::create($validated);

        return redirect()->route('contracts.index')
            ->with('success', 'Contract created successfully!');
    }

    /**
     * Display the specified contract.
     */
    public function show(Contract $contract)
    {
        $contract->load(['partner', 'monitoringLogs']);

        return Inertia::render('Contracts/Show', [
            'contract' => $contract
        ]);
    }

    /**
     * Show the form for editing the specified contract.
     */
    public function edit(Contract $contract)
    {
        $partners = Partner::select('id', 'name')->get();
        $seedOptions = Contract::getSeedOptions();
        $statusOptions = Contract::getStatusOptions();

        return Inertia::render('Contracts/Edit', [
            'contract' => $contract,
            'partners' => $partners,
            'seedOptions' => $seedOptions,
            'statusOptions' => $statusOptions
        ]);
    }

    /**
     * Update the specified contract in storage.
     */
    public function update(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'contract_title' => 'required|string|max:255',
            'partner_id' => 'required|exists:partners,id',
            'contract_file' => 'sometimes|file|mimes:pdf,doc,docx|max:10240',
            'contract_date' => 'required|date',
            'effective_date' => 'required|date',
            'expiration_date' => 'required|date|after:effective_date',
            'seed' => 'required|in:' . implode(',', Contract::getSeedOptions()),
            'seed_quantity' => 'required|integer|min:1',
            'unit_of_measurement' => 'required|string|max:50',
            'expected_harvest_date' => 'required|date',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:draft,active,archived'
        ]);

        // Handle file upload if new file is provided
        if ($request->hasFile('contract_file')) {
            // Delete old file
            if ($contract->contract_file && Storage::disk('public')->exists($contract->contract_file)) {
                Storage::disk('public')->delete($contract->contract_file);
            }

            $file = $request->file('contract_file');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('contracts', $filename, 'public');
            $validated['contract_file'] = $path;
        }

        $contract->update($validated);

        return redirect()->route('contracts.index')
            ->with('success', 'Contract updated successfully!');
    }

    /**
     * Archive the specified contract.
     */
    public function archive(Contract $contract)
    {
        $contract->update(['status' => 'archived']);

        return redirect()->route('contracts.index')
            ->with('success', 'Contract archived successfully!');
    }

    /**
     * Remove the specified contract from storage.
     */
    public function destroy(Contract $contract)
    {
        // Delete the file if it exists
        if ($contract->contract_file && Storage::disk('public')->exists($contract->contract_file)) {
            Storage::disk('public')->delete($contract->contract_file);
        }

        $contract->delete();

        return redirect()->route('contracts.index')
            ->with('success', 'Contract deleted successfully!');
    }
}