<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'current_password' => ['required', 'current_password'],
            'password' => [
                'required',
                'string',
                'min:8',          
                'confirmed',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'password.min' => 'Password must be at least :min characters.',
        ];
    }
}