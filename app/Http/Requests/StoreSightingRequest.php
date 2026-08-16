<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSightingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check(); // Allow only logged-in users to log
    }

    /**
     * Clean data before the validation rules
     */
    protected function prepareForValidation()
    {
        if ($this->has('short_description')) {
            $this->merge([
                'short_description' => strip_tags(trim($this->short_description)),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'type' => ['required', 'in:person,other'],
            'short_description' => [
                'required',
                'string',
                'min:10',
                'max:255',
                'regex:/[a-zA-Z]/'
            ],

            // Person specific fields
            'details.hair_color' => ['required_if:type,person', 'nullable', 'string', 'max:50'],
            'details.headwear' => ['nullable', 'string', 'max:50'],
            'details.shirt' => ['nullable', 'string', 'max:50'],
            'details.pants' => ['nullable', 'string', 'max:50'],
            'details.shoes' => ['nullable', 'string', 'max:50'],
            'details.height' => ['required_if:type,person', 'nullable', 'in:short,middle,tall'],

            // Other specific fields
            'details.entity_type' => ['required_if:type,other', 'nullable', 'string', 'max:50'],
            'details.general_color' => ['required_if:type,other', 'nullable', 'string', 'max:50'],
            'details.accent_colors' => ['nullable', 'string', 'max:100'],
        ];
    }

    /**
     * Error messages if requirements not met
     */
    public function messages(): array
    {
        return [
            'short_description.min' => 'Please provide a more detailed description (min 10 chars).',
            'short_description.regex' => 'The description must contain actual text.',
        ];
    }
}
