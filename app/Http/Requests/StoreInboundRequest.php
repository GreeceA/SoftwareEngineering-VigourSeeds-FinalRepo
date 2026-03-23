<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Seed;
use App\Models\Item;

class StoreInboundRequest extends FormRequest
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
        return [
            'products' => 'required|array|min:1',

            // --- Rules for EACH item inside the 'products' array ---

            'products.*.product_type' => [
                'required',
                'string',
                Rule::in(['seed', 'item']),
            ],

            'products.*.product_id' => [
                'required',
                'integer',
            ],

            // --- REVISED QUANTITY RULE ---
            'products.*.qty' => [
                'required',
                'numeric',
                'gt:0', // Greater than 0
                'lt:100000', // Less than 100,000
            ],

            'products.*.unit' => [
                'required',
                'string',
                Rule::in(['kg', 'liter', 'sack', 'ton']),
            ],

            'products.*.receipt_date' => [
                'required',
                'date',
                'before_or_equal:today',
            ],

            'products.*.manufacture_date' => [
                'required',
                'date',
                'before_or_equal:products.*.receipt_date',
            ],

            'products.*.expiration_date' => [
                'required',
                'date',
                'after:products.*.manufacture_date',
            ],

            'products.*.notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'products.required' => 'You must add at least one product to the inbound stock.',
            'products.min' => 'You must add at least one product to the inbound stock.',

            // --- Messages for array fields ---
            'products.*.product_type.required' => 'The product type is required for each item.',
            'products.*.product_type.in' => 'Invalid product type selected.',

            'products.*.product_id.required' => 'Please select a product for each item.',

            // --- REVISED QUANTITY MESSAGES ---
            'products.*.qty.required' => 'The quantity is required for each item.',
            'products.*.qty.gt' => 'The quantity must be greater than 0.',
            'products.*.qty.lt' => 'The quantity must be less than 100,000.', // <-- ADDED THIS

            'products.*.unit.required' => 'The unit is required for each item.',
            'products.*.unit.in' => 'Invalid unit selected.',

            'products.*.receipt_date.required' => 'The receipt date is required for each item.',
            'products.*.receipt_date.before_or_equal' => 'The receipt date cannot be in the future.',

            'products.*.manufacture_date.required' => 'The manufacture date is required for each item.',
            'products.*.manufacture_date.before_or_equal' => 'The manufacture date must be on or before the receipt date.',

            'products.*.expiration_date.required' => 'The expiration date is required for each item.',
            'products.*.expiration_date.after' => 'The expiration date must be after the manufacture date.',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            foreach ($this->input('products', []) as $index => $product) {
                if (empty($product['product_type']) || empty($product['product_id'])) {
                    continue;
                }

                $exists = false;

                if ($product['product_type'] === 'seed') {
                    $exists = Seed::where('id', $product['product_id'])->exists();
                } elseif ($product['product_type'] === 'item') {
                    $exists = Item::where('id', $product['product_id'])->exists();
                }

                if (!$exists) {
                    $validator->errors()->add(
                        "products.{$index}.product_id",
                        "The selected product is invalid or does not match the chosen product type."
                    );
                }
            }
        });
    }
}