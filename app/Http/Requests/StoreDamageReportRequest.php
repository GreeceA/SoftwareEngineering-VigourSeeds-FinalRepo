<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDamageReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'field_visit_ID' => ['required', 'exists:field_visits,field_visit_ID'],
            'stage' => ['nullable', 'in:Emergence,Vegetative,Tasseling,Silking,Maturity,Harvest'],
            'type_damage' => ['nullable', 'in:pest,disease,weather,mechanical,other'],
            'severity_damage' => ['nullable', 'in:low,medium,high,critical'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}

class UpdateDamageReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'stage' => ['nullable', 'in:Emergence,Vegetative,Tasseling,Silking,Maturity,Harvest'],
            'type_damage' => ['nullable', 'in:pest,disease,weather,mechanical,other'],
            'severity_damage' => ['nullable', 'in:low,medium,high,critical'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}