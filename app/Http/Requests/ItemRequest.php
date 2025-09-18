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
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $itemId = $this->route('item')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('items')->ignore($itemId),
            ],
            'type' => 'required|in:fertilizer,pesticide',
            'description' => 'required|string',
            'base_unit' => 'required|in:kg,liter',
            'price_per_unit' => 'required|numeric|min:0.01|max:999999.99',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The item name is required.',
            'name.unique' => 'An item with this name already exists.',
            'type.required' => 'Please select an item type.',
            'type.in' => 'The selected type is invalid.',
            'description.required' => 'The description field is required.',
            'base_unit.required' => 'Please select a base unit.',
            'base_unit.in' => 'The selected base unit is invalid.',
            'price_per_unit.required' => 'The price per unit is required.',
            'price_per_unit.numeric' => 'The price must be a valid number.',
            'price_per_unit.min' => 'The price must be greater than zero.',
            'price_per_unit.max' => 'The price must not exceed 99,999,999.99.',
        ];
    }
}