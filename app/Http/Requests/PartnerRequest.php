<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PartnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $partnerId = $this->route('partner') ? $this->route('partner')->id : null;

        return [
            'partner_type' => ['required', 'in:individual,organization'],
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('partners')->ignore($partnerId),
            ],
            'phone' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'registration_number' => ['nullable', 'string', 'max:255'],
            'tax_id' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'status' => ['required', 'in:active,inactive'],

            // Add these for organization contacts
            'contact_persons' => [
                'nullable',
                'array',
                'max:3',
                'required_if:partner_type,organization'
            ],
            'contact_persons.*.name' => [
                'required_if:partner_type,organization',
                'string',
                'max:255'
            ],
            'contact_persons.*.email' => [
                'nullable',
                'email',
                'max:255'
            ],
            'contact_persons.*.phone_number' => [
                'nullable',
                'string',
                'max:20'
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'partner_type.required' => 'Partner type is required.',
            'partner_type.in' => 'Partner type must be either individual or organization.',
            'name.required' => 'Partner name is required.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'phone.required' => 'Phone number is required.',
            'address.required' => 'Address is required.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be either active or inactive.',
        ];
    }
}