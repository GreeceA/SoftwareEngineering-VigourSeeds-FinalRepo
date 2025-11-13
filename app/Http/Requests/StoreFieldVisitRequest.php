<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFieldVisitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'contract_ID' => ['required', 'exists:contracts,id'],
            'farm_ID' => ['nullable', 'exists:partner_farms,id'],
            'user_ID' => ['required', 'exists:users,id'], 
            'date_visit'  => ['required', 'date', 'after_or_equal:today'],
            'status' => ['required', 'in:ongoing,completed,cancelled'],
            'remarks' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'contract_ID.required' => 'Please select a contract.',
            'contract_ID.exists' => 'The selected contract does not exist.',
            'user_ID.required' => 'Please assign a user to this field visit.',
            'user_ID.exists' => 'The selected user does not exist.',
            'date_visit.required' => 'Visit date is required.',
            'date_visit.date' => 'Visit date must be a valid date.',
            'date_visit.after_or_equal' => 'Visit date cannot be in the past. Please select today or a future date.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be ongoing, completed, or cancelled.',
        ];
    }
}