<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Assuming authorization is handled by middleware or policies, we return true for validation to run.
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $itemId = $this->route('item') ? $this->route('item')->id : null;

        $rules = [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('items', 'name')->ignore($itemId),
            ],
            'type' => [
                'required',
                Rule::in(['fertilizer', 'pesticide']),
            ],
            'description' => [
                'required',
                'string',
                'max:1000',
            ],
            // Allow both kg and liter for any type
            'base_unit' => [
                'required',
                Rule::in(['kg', 'liter'])
            ],
            'price_per_unit' => [
                'required',
                'numeric',
                'min:0.01',
                'max:99999.99',
            ],
        ];

        if ($this->method() === 'PUT' || $this->method() === 'PATCH') {
            $rules['status'] = ['required', Rule::in(['active', 'archived'])];
        }

        return $rules;
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.unique' => 'This item name is already registered.',
            'name.required' => 'The item name is required.',

            'type.required' => 'The item type is required.',
            'type.in' => 'Invalid item type selected.',

            'description.required' => 'The item description is required.',

            'base_unit.required' => 'The base unit (kg/liter) is required.',
            'base_unit.in' => 'Invalid unit selected for this item type.',

            'price_per_unit.required' => 'The price per unit is required.',
            'price_per_unit.numeric' => 'The price must be a valid number.',
            'price_per_unit.min' => 'The price must be greater than ₱0.00.',
            'price_per_unit.max' => 'The price must not exceed ₱99,999.99.',
        ];
    }
}