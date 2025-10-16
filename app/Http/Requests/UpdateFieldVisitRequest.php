<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFieldVisitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'contract_ID' => ['required', 'exists:contracts,id'],
            'farm_ID' => ['required', 'exists:partner_farms,id'],
            'user_ID' => ['nullable', 'exists:users,id'],
            'date_visit' => ['required', 'date'],
            'status' => ['required', 'in:ongoing,completed,cancelled'],
            'remarks' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'contract_ID.required' => 'Please select a contract.',
            'contract_ID.exists' => 'The selected contract does not exist.',
            'farm_ID.required' => 'Please select a farm.',
            'farm_ID.exists' => 'The selected farm does not exist.',
            'user_ID.exists' => 'The selected user does not exist.',
            'date_visit.required' => 'Visit date is required.',
            'date_visit.date' => 'Visit date must be a valid date.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be ongoing, completed, or cancelled.',
        ];
    }
}