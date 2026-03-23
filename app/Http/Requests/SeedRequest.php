<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SeedRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->route('seed') !== null;

        $rules = [
            'seed_variety' => [
                'required',
                'string',
                'max:255',
                Rule::unique('seeds', 'seed_variety')->ignore($this->route('seed')),
            ],
            'price_per_unit' => 'required|numeric|min:0.01|max:9999.99',
            'growth_cycle' => 'required|integer|min:60|max:200',
            'storage_requirements' => 'required|string|max:255',
            'soil_type' => ['required', Rule::in(['clay', 'sandy', 'loam', 'silty'])],
            'notes' => 'nullable|string',
        ];

        if ($isUpdate) {
            $rules['status'] = [
                'required',
                Rule::in(['active', 'archived']),
            ];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            // Seed fields messages
            'seed_variety.unique' => 'The seed variety is already registered.',
            'seed_variety.required' => 'The seed variety name is required.',

            'price_per_unit.required' => 'The price per unit is required.',
            'price_per_unit.numeric' => 'The price must be a numeric value.',
            'price_per_unit.min' => 'The price must be greater than 0.00.',
            'price_per_unit.max' => 'The price must not exceed 9,999.99.',

            'growth_cycle.required' => 'The growth cycle is required.',
            'growth_cycle.min' => 'The growth cycle must be at least 60 days.',
            'storage_requirements.required' => 'The storage requirements field is required.',

            // Soil Type (ENUM) messages
            'soil_type.required' => 'The soil type is required.',
            'soil_type.in' => 'The soil type must be one of the following: clay, sandy, loam, or silty.',

            // Status (Only for Update) messages
            'status.required' => 'The status field is required.',
            'status.in' => 'The status must be either "active" or "archived".',
        ];
    }
}