<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Replace with your actual role/permission check if needed
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->route('contract') !== null;
        $contract = $this->route('contract');
        $contractId = $contract->id ?? null;
        $today = now()->format('Y-m-d');

        // Assume canBeEdited() returns true for FULL edit, false for PARTIAL edit
        $isPartialEdit = $isUpdate && method_exists($contract, 'canBeEdited') && !$contract->canBeEdited();

        // --- FULL EDIT / CREATE RULES ---
        $rules = [
            'contract_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('contracts', 'contract_name')->ignore($contractId),
            ],
            'partner_id' => ['required', 'exists:partners,id'],
            'farm_id' => ['required', 'exists:partner_farms,id'],
            'signing_date' => ['required', 'date', 'before_or_equal:' . $today],
            'effective_date' => ['required', 'date', 'after_or_equal:signing_date'],
            'expiration_date' => ['required', 'date', 'after:effective_date'],
            'buyback_price_per_unit' => [
                'required', 'numeric', 'min:0.01', 'max:999999.99', 'regex:/^\d+(\.\d{1,2})?$/'
            ],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', Rule::in(['draft', 'under_review', 'active', 'suspended', 'terminated', 'cancelled', 'completed'])],
            'contract_file' => ['file', 'mimes:pdf,doc,docx', 'max:5120'], // 5MB
            'original_file_name' => ['nullable', 'string', 'max:255'],
            'seeds' => ['required', 'array', 'min:1', 'max:1'],
            'seeds.*.seed_id' => ['required', 'exists:seeds,id'],
            'seeds.*.seed_price_at_contract' => ['required', 'numeric', 'min:0.01', 'max:999999.99', 'regex:/^\d+(\.\d{1,2})?$/'],
            'seeds.*.seed_quantity' => ['required', 'numeric', 'min:0.01'],
            'seeds.*.unit' => ['required', Rule::in(['kg', 'sack', 'ton'])],
            'seeds.*.planting_date' => ['required', 'date', 'after:effective_date', 'before:expiration_date'],
            'seeds.*.expected_first_harvest_date' => ['required', 'date', 'after:seeds.*.planting_date', 'before_or_equal:expiration_date'],
            'seeds.*.agreed_cycles' => ['required', 'integer', 'min:1'],
            'seeds.*.expected_buyback_amount' => ['required', 'integer', 'min:1'],
            'seeds.*.buyback_unit' => ['required', Rule::in(['kg', 'ton'])],
        ];

        // File is required on create, optional on update unless a new file is uploaded
        if (!$isUpdate || $this->hasFile('contract_file')) {
            $rules['contract_file'][] = 'required';
        } else {
            $rules['contract_file'][] = 'nullable';
        }

        // --- PARTIAL EDIT RULES ---
        if ($isPartialEdit) {
            $rules = [
                'expiration_date' => ['required', 'date', 'after:effective_date'],
                'buyback_price_per_unit' => [
                    'required', 'numeric', 'min:0.0001', 'max:999999.99', 'regex:/^\d+(\.\d{1,2})?$/'
                ],
                'notes' => ['nullable', 'string'],
                'contract_file' => ['file', 'mimes:pdf,doc,docx', 'max:5120', 'nullable'],
                'original_file_name' => ['nullable', 'string', 'max:255'],
                'seeds' => ['required', 'array', 'min:1', 'max:1'],
                'seeds.*.id' => ['required', 'exists:contract_seed_commitments,id'],
                'seeds.*.planting_date' => ['required', 'date', 'after:effective_date', 'before:expiration_date'],
                'seeds.*.expected_first_harvest_date' => ['required', 'date', 'after:seeds.*.planting_date', 'before_or_equal:expiration_date'],
                'seeds.*.agreed_cycles' => ['required', 'integer', 'min:1'],
                'seeds.*.expected_buyback_amount' => ['required', 'integer', 'min:1'],
            ];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            // General Contract Fields
            'contract_name.required' => 'The contract name is required.',
            'contract_name.unique' => 'A contract with this name already exists.',
            'partner_id.required' => 'A Partner selection is required.',
            'farm_id.required' => 'A Farm selection is required.',
            'signing_date.required' => 'The signing date is required.',
            'signing_date.before_or_equal' => 'The signing date cannot be in the future.',
            'effective_date.required' => 'The effective date is required.',
            'effective_date.after_or_equal' => 'The effective date must be on or after the signing date.',
            'expiration_date.required' => 'The expiration date is required.',
            'expiration_date.after' => 'The expiration date must be after the effective date.',
            'buyback_price_per_unit.required' => 'The buyback price per unit is required.',
            'buyback_price_per_unit.regex' => 'The buyback price can have a maximum of two decimal places.',
            'buyback_price_per_unit.min' => 'The buyback price must be greater than zero.',
            'buyback_price_per_unit.max' => 'The buyback price is too large.',
            'contract_file.required' => 'A contract file (PDF, DOC, DOCX) is required for submission.',
            'contract_file.mimes' => 'The contract file must be a PDF, DOC, or DOCX.',
            'contract_file.max' => 'The contract file must not exceed 5MB.',
            // Seed Commitment Array
            'seeds.required' => 'A single Seed Variety commitment is required for the contract.',
            'seeds.min' => 'At least one seed variety commitment is required.',
            'seeds.max' => 'Only one seed variety is allowed per contract.',
            // Seed Commitment Nested Fields
            'seeds.*.seed_id.required' => 'The seed variety is required for the commitment.',
            'seeds.*.seed_id.exists' => 'The selected seed does not exist.',
            'seeds.*.seed_price_at_contract.required' => 'The seed price at contract is required.',
            'seeds.*.seed_price_at_contract.regex' => 'The seed price can have a maximum of two decimal places.',
            'seeds.*.seed_quantity.required' => 'The seed quantity is required.',
            'seeds.*.unit.required' => 'The seed quantity unit is required.',
            'seeds.*.planting_date.required' => 'The planting date is required.',
            'seeds.*.planting_date.after' => 'The planting date must be after the effective date.',
            'seeds.*.planting_date.before' => 'The planting date must be before the expiration date.',
            'seeds.*.expected_first_harvest_date.required' => 'The expected harvest date is required.',
            'seeds.*.expected_first_harvest_date.after' => 'The expected harvest date must be after the planting date.',
            'seeds.*.expected_first_harvest_date.before_or_equal' => 'Expected harvest date exceeds contract expiration.',
            'seeds.*.agreed_cycles.required' => 'The number of agreed cycles is required.',
            'seeds.*.agreed_cycles.min' => 'At least one cycle is required.',
            'seeds.*.expected_buyback_amount.required' => 'The expected buyback amount is required.',
            'seeds.*.expected_buyback_amount.min' => 'The expected buyback amount must be at least 1.',
            'seeds.*.buyback_unit.required' => 'The buyback unit is required.',
            'seeds.*.buyback_unit.in' => 'The buyback unit must be kg or ton.',
            // Partial Edit
            'seeds.*.id.required' => 'Seed commitment ID is required for update.',
            'seeds.*.id.exists' => 'Seed commitment does not exist.',
        ];
    }
}