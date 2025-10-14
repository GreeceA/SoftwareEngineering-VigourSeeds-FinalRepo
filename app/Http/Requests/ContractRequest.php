<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Replace this with your actual role/permission check
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->route('contract') !== null;
        $contract = $this->route('contract');
        $contractId = $contract->id ?? null;

        // --- CONTRACT (Main Table) Fields ---
        $rules = [
            'contract_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('contracts', 'contract_name')->ignore($contractId),
            ], 
            'partner_id' => ['required', 'exists:partners,id'],
            // NEW REQUIRED FIELD: farm_id
            'farm_id' => ['required', 'exists:partner_farms,id'], 
            'signing_date' => ['required', 'date'],
            'effective_date' => ['nullable', 'date', 'after_or_equal:signing_date'],
            'expiration_date' => ['nullable', 'date', 'after:effective_date'],
            'buyback_price_per_unit' => ['required', 'numeric', 'min:0.0001', 'max:9999.9999'], 
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', Rule::in(['draft', 'under_review', 'active', 'suspended', 'terminated', 'cancelled', 'completed'])],
            // --- Seed Commitments (Nested Array) Fields ---
            'seeds' => ['required', 'array', 'min:1', 'max:1'], 
            'seeds.*.seed_id' => ['required', 'exists:seeds,id'],
            'seeds.*.seed_price_at_contract' => ['required', 'numeric', 'min:0.01', 'max:999999.99'], 
            'seeds.*.seed_quantity' => ['required', 'numeric', 'min:0.01'],
            'seeds.*.unit' => ['required', Rule::in(['kg', 'sack', 'ton'])],
            'seeds.*.planting_date' => ['required', 'date', 'after_or_equal:signing_date'], 
            'seeds.*.expected_first_harvest_date' => ['required', 'date', 'after:seeds.*.planting_date'],
            'seeds.*.agreed_cycles' => ['required', 'integer', 'min:1'],
            'seeds.*.expected_buyback_amount' => ['required', 'integer', 'min:1'],
            'seeds.*.buyback_unit' => ['required', Rule::in(['kg', 'ton'])],
        ];

        // --- FILE HANDLING RULES ---
        $fileRules = [
            'contract_file' => ['file', 'mimes:pdf,doc,docx', 'max:10240'],
            'original_file_name' => ['nullable', 'string', 'max:255'],
        ];

        if (!$isUpdate || $this->hasFile('contract_file')) {
            $fileRules['contract_file'][] = 'required';
        } else {
            $rules['contract_file'] = ['nullable'];
            $rules['original_file_name'] = ['nullable', 'string', 'max:255'];
        }

        $rules = array_merge($rules, $fileRules);

        // --- ADJUSTMENTS FOR PARTIAL EDITS (Logic for active contracts) ---
        if ($isUpdate && !$contract->canBeEdited()) {
            // Overwrite rules for partially editable contracts (e.g., Active status)
            $rules = [
                'notes' => ['nullable', 'string'],
                'buyback_price_per_unit' => ['nullable', 'numeric', 'min:0.0001', 'max:9999.9999'],
                'contract_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
                // Allow only dynamic fields within commitments to be updated
                'seeds' => ['required', 'array', 'min:1', 'max:1'], 
                'seeds.*.id' => ['required', 'exists:contract_seed_commitments,id'],
                'seeds.*.planting_date' => ['required', 'date', 'after_or_equal:signing_date'],
                'seeds.*.expected_first_harvest_date' => ['required', 'date', 'after:seeds.*.planting_date'],
                'seeds.*.expected_buyback_amount' => ['required', 'integer', 'min:1'],
            ];
            // Note: partner_id and farm_id usually should NOT change in partial edit, 
            // so they shouldn't be included unless required for context validation
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'seeds.required' => 'A single Seed Variety commitment is required for the contract.',
            'seeds.max' => 'Only one seed variety is allowed per contract.',
            'contract_name.unique' => 'A contract with this name already exists.',
            'seeds.*.planting_date.after_or_equal' => 'The planting date must be on or after the contract signing date.',
            'seeds.*.expected_first_harvest_date.after' => 'The expected harvest date must be after the planting date.',
        ];
    }
}