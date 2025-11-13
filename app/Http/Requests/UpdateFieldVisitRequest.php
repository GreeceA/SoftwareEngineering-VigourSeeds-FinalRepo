<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFieldVisitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // Cannot change contract_ID or farm_ID - these are locked after creation

            // You can re-assign the visit to another user
            'user_ID' => 'required|integer|exists:users,id',

            // You can reschedule the visit (but only to today or future)
            'date_visit' => 'required|date|after_or_equal:today',

            // This is the main reason for editing:
            // to mark it as 'completed' or 'cancelled'
            'status' => 'required|string|in:ongoing,completed,cancelled',

            // You can always add or change remarks
            'remarks' => 'nullable|string|max:2000',
        ];
    }

    public function messages(): array
    {
        return [
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