<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PartnerRequest extends FormRequest
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
        $partnerId = $this->route('partner') ? $this->route('partner')->id : null;

        return [
            'partner_type' => [
                'required',
                'in:individual,organization',
            ],
            'name' => [
                'required',
                'string',
                'max:255',
                'filled',
                Rule::unique('partners')->ignore($partnerId),
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('partners')->ignore($partnerId),
            ],
            'phone' => [
                'required',
                'string',
                'regex:/^(0[89]\d{2}-\d{3}-\d{4})$/',
                'max:13',
            ],
            'address' => [
                'required',
                'string',
            ],
            'registration_number' => [
                'required',
                'string',
                'regex:/^\d{11}$/',
            ],
            'tax_id' => [
                'required',
                'regex:/^\d{3}-\d{3}-\d{3}-\d{3}$/',
            ],
            'notes' => [
                'nullable',
                'string',
            ],
            'status' => [
                'required',
                'in:active,inactive',
            ],

            // Organization contacts
            'contact_persons' => [
                Rule::requiredIf($this->input('partner_type') === 'organization'),
                $this->input('partner_type') === 'organization' ? 'array' : 'nullable',
                $this->input('partner_type') === 'organization' ? 'min:1' : 'nullable',
                $this->input('partner_type') === 'organization' ? 'max:3' : 'nullable',
            ],
            'contact_persons.*.name' => [
                Rule::requiredIf($this->input('partner_type') === 'organization'),
                'string',
                'max:255',
                'distinct',
            ],
            'contact_persons.*.email' => [
                Rule::requiredIf($this->input('partner_type') === 'organization'),
                'email',
                'max:255',
                'distinct',
            ],
            'contact_persons.*.phone_number' => [
                Rule::requiredIf($this->input('partner_type') === 'organization'),
                'string',
                'regex:/^(0[89]\d{2}-\d{3}-\d{4})$/',
                'max:13',
                'distinct',
            ],

            // Farms validation
            'farms' => [
                'required',
                'array',
                'min:1',
                'max:10',
            ],
            'farms.*.location_name' => [
                'required',
                'string',
                'max:255',
                'distinct',
            ],
            'farms.*.address' => [
                'required',
                'string',
            ],
            'farms.*.area_size' => [
                'required',
                'numeric',
                'min:0.01',
                'max:999.99',
            ],
            'farms.*.soil_type' => [
                'required',
                Rule::in(['clay', 'sandy', 'loam', 'silty']),
            ],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            // Partner fields messages
            'partner_type.required' => 'Partner type is required.',
            'partner_type.in' => 'Invalid partner type selected. Please choose either Individual or Organization.',
            'name.required' => 'Partner name is required.',
            'name.string' => 'Partner name must be a string.',
            'name.max' => 'Partner name may not be greater than 255 characters.',
            'name.unique' => 'A partner with this name already exists. Please provide a different name.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.max' => 'Email address may not be greater than 255 characters.',
            'email.unique' => 'This email address is already registered.',
            'phone.required' => 'Phone number is required.',
            'phone.string' => 'Phone number must be a string.',
            'phone.regex' => 'Phone number must be 11 digits, start with 08 or 09, and formatted as XXXX-XXX-XXXX.',
            'phone.max' => 'Phone number may not be greater than 13 characters.',
            'address.required' => 'Address is required.',
            'registration_number.required' => 'DTI Registration Number is required.',
            'registration_number.string' => 'DTI Registration Number must be a string.',
            'registration_number.regex' => 'DTI Registration Number must be exactly 11 digits.',
            'tax_id.required' => 'Tax ID (TIN) is required.',
            'tax_id.string' => 'Tax ID (TIN) must be a string.',
            'tax_id.regex' => 'Tax ID (TIN) must be exactly 12 digits.',
            'notes.string' => 'Notes must be a string.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be either active or inactive.',

            // Organization contacts validation messages
            'contact_persons.required_if' => 'At least one contact person is required for organizations.',
            'contact_persons.array' => 'Contact persons data must be an array.',
            'contact_persons.min' => 'At least one contact person is required.',
            'contact_persons.max' => 'You can only add up to 3 contact persons.',
            'contact_persons.*.name.required_if' => 'Contact person name is required for organizations.',
            'contact_persons.*.name.string' => 'Contact person name must be a string.',
            'contact_persons.*.name.max' => 'Contact person name may not be greater than 255 characters.',
            'contact_persons.*.name.distinct' => 'Contact person names must be unique within the company.',
            'contact_persons.*.email.required_if' => 'Contact person email is required for organizations.',
            'contact_persons.*.email.email' => 'Contact person email must be a valid email address.',
            'contact_persons.*.email.max' => 'Contact person email may not be greater than 255 characters.',
            'contact_persons.*.email.distinct' => 'Contact person emails must be unique within the company.',
            'contact_persons.*.phone_number.required_if' => 'Contact person phone number is required for organizations.',
            'contact_persons.*.phone_number.string' => 'Contact person phone number must be a string.',
            'contact_persons.*.phone_number.regex' => 'Contact person phone number must be 11 digits, start with 08 or 09, and formatted as XXXX-XXX-XXXX.',
            'contact_persons.*.phone_number.max' => 'Contact person phone number may not be greater than 13 characters.',
            'contact_persons.*.phone_number.distinct' => 'Contact person phone numbers must be unique within the company.',

            // Farms validation messages
            'farms.required' => 'At least one farm is required.',
            'farms.array' => 'Farms data must be an array.',
            'farms.min' => 'At least one farm is required.',
            'farms.max' => 'You can only add up to 10 farms.',
            'farms.*.location_name.required' => 'Farm name is required.',
            'farms.*.location_name.string' => 'Farm name must be a string.',
            'farms.*.location_name.max' => 'Farm name may not be greater than 255 characters.',
            'farms.*.location_name.distinct' => 'Farm names must be unique within the same partner.',
            'farms.*.address.required' => 'Farm address is required.',
            'farms.*.address.string' => 'Farm address must be a string.',
            'farms.*.area_size.required' => 'Area size is required.',
            'farms.*.area_size.numeric' => 'Area size must be a number.',
            'farms.*.area_size.min' => 'Area size must be greater than 0.',
            'farms.*.area_size.max' => 'Area size must not exceed 1000 hectares.',
            'farms.*.soil_type.required' => 'Soil type is required. Please select a soil type.',
            'farms.*.soil_type.in' => 'Soil type must be one of: clay, sandy, loam, or silty.',
        ];
    }
}