<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGrowthReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'stage' => 'required|string|in:Emergence,Vegetative,Tasseling,Silking,Maturity,Harvest',
            'status' => 'required|string|in:excellent,good,average,poor',
            'notes' => 'required|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'stage.required' => 'Please select a growth stage.',
            'stage.in' => 'Invalid growth stage selected.',
            'status.required' => 'Please select a plant status.',
            'status.in' => 'Invalid status selected.',
            'notes.required' => 'Please provide observations and notes.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
        ];
    }
}