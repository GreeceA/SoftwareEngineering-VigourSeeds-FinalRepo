<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDamageReportRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Change if you want to restrict access
    }

   public function rules()
    {
        return [
            'field_visit_ID' => ['required', 'exists:field_visits,field_visit_ID'],
            'stage' => ['required', 'string', 'max:100'],
            'type_damage' => ['required', 'string', 'max:100'],
            'severity_damage' => ['required', 'in:low,medium,high,critical'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}