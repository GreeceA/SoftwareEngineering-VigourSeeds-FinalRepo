<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Item;
use App\Models\Seed;

class StorePartnerOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'partner_id' => 'required|exists:partners,id',
            'contract_id' => 'required|exists:contracts,id',
            'order_date' => 'required|date|before_or_equal:today',
            'notes' => 'nullable|string|max:1000',
            'lines' => 'required|array|min:1',
            'lines.*.product_type' => 'required|in:fertilizer,pesticide,seed',
            'lines.*.product_id' => 'required|integer',
            'lines.*.qty' => 'required|numeric|gt:0|lt:100000',
            'lines.*.unit' => 'required|string',
            'lines.*.price_per_unit' => 'required|numeric|min:0',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $lines = $this->input('lines', []);

            foreach ($lines as $index => $line) {
                $productType = $line['product_type'] ?? null;
                $productId = $line['product_id'] ?? null;
                $qty = $line['qty'] ?? 0;

                if (!$productType || !$productId) {
                    continue;
                }

                // Get available stock based on product type
                $availableStock = 0;

                if ($productType === 'fertilizer' || $productType === 'pesticide') {
                    $item = Item::find($productId);
                    if ($item) {
                        $availableStock = $item->getCurrentStock();
                    }
                } elseif ($productType === 'seed') {
                    $seed = Seed::find($productId);
                    if ($seed) {
                        $availableStock = $seed->getCurrentStock();
                    }
                }

                // Validate quantity against stock
                
            }
        });
    }

    public function messages(): array
    {
        return [
            'partner_id.required' => 'Partner is required.',
            'partner_id.exists' => 'Selected partner does not exist.',
            'contract_id.required' => 'Contract is required.',
            'contract_id.exists' => 'Selected contract does not exist.',
            'order_date.required' => 'Order date is required.',
            'order_date.before_or_equal' => 'Order date cannot be in the future.',
            'lines.required' => 'At least one order line is required.',
            'lines.min' => 'At least one order line is required.',
            'lines.*.product_type.required' => 'Product type is required for each line.',
            'lines.*.product_id.required' => 'Product is required for each line.',
            'lines.*.qty.required' => 'Quantity is required for each line.',
            'lines.*.qty.gt' => 'Quantity must be greater than 0.',
            'lines.*.qty.lt' => 'Quantity must be less than 100,000.',
            'lines.*.unit.required' => 'Unit is required for each line.',
            'lines.*.price_per_unit.required' => 'Price per unit is required for each line.',
            'lines.*.price_per_unit.min' => 'Price must be 0 or greater.',
        ];
    }
}