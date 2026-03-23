<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDamageReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'stage' => 'required|string|in:Emergence,Vegetative,Tasseling,Silking,Maturity,Harvest',
            'type_damage' => 'required|string|in:pest,disease,weather,mechanical,other',
            'severity_damage' => 'required|string|in:low,medium,high,critical',
            'notes' => 'required|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'stage.required' => 'Please select a growth stage.',
            'stage.in' => 'Invalid growth stage selected.',
            'type_damage.required' => 'Please select a damage type.',
            'type_damage.in' => 'Invalid damage type selected.',
            'severity_damage.required' => 'Please select a severity level.',
            'severity_damage.in' => 'Invalid severity level selected.',
            'notes.required' => 'Please provide damage description and notes.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
        ];
    }
}