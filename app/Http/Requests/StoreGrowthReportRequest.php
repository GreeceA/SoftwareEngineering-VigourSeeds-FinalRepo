<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGrowthReportRequest extends FormRequest
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
            'status' => ['nullable', 'in:excellent,good,average,poor'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}

class UpdateGrowthReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'stage' => ['nullable', 'in:Emergence,Vegetative,Tasseling,Silking,Maturity,Harvest'],
            'status' => ['nullable', 'in:excellent,good,average,poor'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}