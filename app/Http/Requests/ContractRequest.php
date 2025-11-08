<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->route('contract') !== null;
        $contract = $this->route('contract');
        $contractId = $contract->id ?? null;
        $today = now()->format('Y-m-d');

        $isPartialEdit = $isUpdate && $contract && !$contract->canBeEdited() && $contract->canBePartiallyEdited();

        // Base rules for full edit/create
        $rules = [
            'contract_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('contracts', 'contract_name')->ignore($contractId),
            ],
            'partner_id' => ['required', 'exists:partners,id'],
            'farm_id' => [
                'required',
                'exists:partner_farms,id',
                // Validate farm belongs to selected partner
                function ($attribute, $value, $fail) {
                    $partnerId = $this->input('partner_id');
                    if ($partnerId && $value) {
                        $farm = \App\Models\PartnerFarm::where('id', $value)
                            ->where('partner_id', $partnerId)
                            ->first();
                        
                        if (!$farm) {
                            $fail('The selected farm does not belong to the chosen partner.');
                        }
                    }
                },
            ],
            'signing_date' => array_filter([
                'required',
                'date',
                'before_or_equal:' . $today,
                // Only enforce "max 1 week in past" if creating or editing a draft
                (!$isUpdate || ($contract && $contract->status === 'draft'))
                    ? 'after_or_equal:' . now()->subWeek()->format('Y-m-d')
                    : null,
            ]),
            'effective_date' => [
                'required',
                'date',
                'after_or_equal:signing_date',
            ],
            'expiration_date' => [
                'required',
                'date',
                'after:effective_date',
                // Validate minimum contract duration (e.g., 30 days)
                function ($attribute, $value, $fail) {
                    $effectiveDate = $this->input('effective_date');
                    if ($effectiveDate && $value) {
                        $duration = \Carbon\Carbon::parse($effectiveDate)
                            ->diffInDays(\Carbon\Carbon::parse($value));
                        
                        if ($duration < 30) {
                            $fail('Contract duration must be at least 30 days.');
                        }
                    }
                },
            ],
            'buyback_price_per_unit' => [
                'required',
                'numeric',
                'min:0.0001',
                'max:999999.99',
                'regex:/^\d+(\.\d{1,4})?$/', // Allow up to 4 decimals
            ],
            'notes' => ['nullable', 'string', 'max:5000'],
            'status' => [
                'nullable',
                Rule::in(['draft', 'under_review', 'active', 'suspended', 'terminated', 'cancelled', 'completed'])
            ],
            'contract_file' => [
                $isUpdate && !$this->hasFile('contract_file') ? 'nullable' : 'required',
                'file',
                'mimes:pdf,doc,docx',
                'max:5120', // 5MB
            ],
            'original_file_name' => ['nullable', 'string', 'max:255'],
            
            // Seed commitment rules
            'seeds' => ['required', 'array', 'min:1', 'max:1'],
            'seeds.*.seed_id' => ['required', 'exists:seeds,id'],
            'seeds.*.seed_price_at_contract' => [
                'required',
                'numeric',
                'min:0.01',
                'max:999999.99',
                'regex:/^\d+(\.\d{1,2})?$/',
            ],
            'seeds.*.seed_quantity' => [
                'required',
                'numeric',
                'min:0.01',
                'max:99999.99',
            ],
            'seeds.*.unit' => ['required', Rule::in(['kg', 'sack', 'ton'])],
            'seeds.*.planting_date' => [
                'required',
                'date',
                'after:effective_date',
                'before:expiration_date',
            ],
            'seeds.*.expected_first_harvest_date' => [
                'required',
                'date',
                'after:seeds.*.planting_date',
                'before_or_equal:expiration_date',
            ],
            'seeds.*.agreed_cycles' => [
                'required',
                'integer',
                'min:1',
                'max:50', // Reasonable maximum
                // Validate cycles fit within contract duration
                function ($attribute, $value, $fail) {
                    $index = explode('.', $attribute)[1];
                    $plantingDate = $this->input("seeds.{$index}.planting_date");
                    $seedId = $this->input("seeds.{$index}.seed_id");
                    $expirationDate = $this->input('expiration_date');
                    
                    if ($plantingDate && $seedId && $expirationDate && $value) {
                        $seed = \App\Models\Seed::find($seedId);
                        if ($seed && $seed->growth_cycle) {
                            $totalDays = \Carbon\Carbon::parse($plantingDate)
                                ->diffInDays(\Carbon\Carbon::parse($expirationDate));
                            $maxCycles = floor($totalDays / $seed->growth_cycle);
                            
                            if ($value > $maxCycles) {
                                $fail("Maximum {$maxCycles} cycles are possible within the contract duration.");
                            }
                        }
                    }
                },
            ],
            'seeds.*.expected_buyback_amount' => [
                'required',
                'integer',
                'min:1',
                'max:9999999',
            ],
            'seeds.*.buyback_unit' => ['required', 'in:kg,sack,ton'],
        ];

        // Partial edit rules (active/suspended contracts)
        if ($isPartialEdit) {
            $rules = [
                'expiration_date' => [
                    'required',
                    'date',
                    'after:' . $contract->effective_date->format('Y-m-d'),
                        // Only allow extending expiration date if suspended
                        function ($attribute, $value, $fail) use ($contract) {
                            if ($contract->status === 'suspended' && $value < $contract->expiration_date->format('Y-m-d')) {
                                $fail('You can only extend the expiration date. Shortening is not allowed while suspended.');
                            }
                        },
                ],
                'buyback_price_per_unit' => [
                    'required',
                    'numeric',
                    'min:0.0001',
                    'max:999999.99',
                    'regex:/^\d+(\.\d{1,4})?$/',
                ],
                'notes' => ['nullable', 'string', 'max:5000'],
                'contract_file' => [
                    'nullable',
                    'file',
                    'mimes:pdf,doc,docx',
                    'max:5120',
                ],
                'original_file_name' => ['nullable', 'string', 'max:255'],
                'seeds' => ['required', 'array', 'min:1', 'max:1'],
                'seeds.*.id' => ['required', 'exists:contract_seed_commitments,id'],
                'seeds.*.planting_date' => [
                    'required',
                    'date',
                    'after:' . $contract->effective_date->format('Y-m-d'),
                    'before:expiration_date',
                ],
                'seeds.*.expected_first_harvest_date' => [
                    'required',
                    'date',
                    'after:seeds.*.planting_date',
                    'before_or_equal:expiration_date',
                ],
                'seeds.*.agreed_cycles' => ['required', 'integer', 'min:1', 'max:50'],
                'seeds.*.expected_buyback_amount' => ['required', 'integer', 'min:1'],
                'seeds.*.buyback_unit' => ['required', 'in:kg,sack,ton'],
            ];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            // Contract fields
            'contract_name.required' => 'The contract name is required.',
            'contract_name.unique' => 'A contract with this name already exists.',
            'contract_name.max' => 'The contract name cannot exceed 255 characters.',
            
            'partner_id.required' => 'Please select a partner.',
            'partner_id.exists' => 'The selected partner does not exist.',
            
            'farm_id.required' => 'Please select a farm location.',
            'farm_id.exists' => 'The selected farm does not exist.',
            
            'signing_date.required' => 'The signing date is required.',
            'signing_date.before_or_equal' => 'The signing date cannot be in the future.',
            'signing_date.after_or_equal' => 'The signing date cannot be more than one week in the past.',
            
            'effective_date.required' => 'The effective date is required.',
            'effective_date.after_or_equal' => 'The effective date must be on or after the signing date.',
            
            'expiration_date.required' => 'The expiration date is required.',
            'expiration_date.after' => 'The expiration date must be after the effective date.',
            
            'buyback_price_per_unit.required' => 'The buyback price is required.',
            'buyback_price_per_unit.min' => 'The buyback price must be greater than zero.',
            'buyback_price_per_unit.max' => 'The buyback price is too large.',
            'buyback_price_per_unit.regex' => 'The buyback price can have a maximum of 4 decimal places.',
            
            'contract_file.required' => 'A contract file (PDF, DOC, DOCX) is required.',
            'contract_file.mimes' => 'The contract file must be a PDF, DOC, or DOCX.',
            'contract_file.max' => 'The contract file must not exceed 5MB.',
            
            // Seed commitment fields
            'seeds.required' => 'At least one seed commitment is required.',
            'seeds.max' => 'Only one seed variety is allowed per contract.',
            
            'seeds.*.seed_id.required' => 'Please select a seed variety.',
            'seeds.*.seed_id.exists' => 'The selected seed does not exist.',
            
            'seeds.*.seed_quantity.required' => 'The seed quantity is required.',
            'seeds.*.seed_quantity.min' => 'The seed quantity must be at least 0.01.',
            'seeds.*.seed_quantity.max' => 'The seed quantity is too large.',
            
            'seeds.*.unit.required' => 'Please select a unit for seed quantity.',
            'seeds.*.unit.in' => 'The selected unit is invalid.',
            
            'seeds.*.planting_date.required' => 'The planting date is required.',
            'seeds.*.planting_date.after' => 'The planting date must be after the effective date.',
            'seeds.*.planting_date.before' => 'The planting date must be before the expiration date.',
            
            'seeds.*.expected_first_harvest_date.required' => 'The expected harvest date is required.',
            'seeds.*.expected_first_harvest_date.after' => 'The harvest date must be after the planting date.',
            'seeds.*.expected_first_harvest_date.before_or_equal' => 'The harvest date cannot exceed the contract expiration date.',
            
            'seeds.*.agreed_cycles.required' => 'The number of agreed cycles is required.',
            'seeds.*.agreed_cycles.min' => 'At least one cycle is required.',
            'seeds.*.agreed_cycles.max' => 'The number of cycles is too large.',
            
            'seeds.*.expected_buyback_amount.required' => 'The expected buyback amount is required.',
            'seeds.*.expected_buyback_amount.min' => 'The buyback amount must be at least 1.',
            'seeds.*.expected_buyback_amount.max' => 'The buyback amount is too large.',
            
            'seeds.*.buyback_unit.required' => 'Please select a buyback unit.',
            'seeds.*.buyback_unit.in' => 'The buyback unit must be kg or ton.',
            
            // Partial edit
            'seeds.*.id.required' => 'The commitment ID is required.',
            'seeds.*.id.exists' => 'The selected commitment does not exist.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'contract_name' => 'contract name',
            'partner_id' => 'partner',
            'farm_id' => 'farm',
            'signing_date' => 'signing date',
            'effective_date' => 'effective date',
            'expiration_date' => 'expiration date',
            'buyback_price_per_unit' => 'buyback price',
            'contract_file' => 'contract file',
            'seeds.*.seed_id' => 'seed variety',
            'seeds.*.planting_date' => 'planting date',
            'seeds.*.expected_first_harvest_date' => 'expected harvest date',
        ];
    }
}