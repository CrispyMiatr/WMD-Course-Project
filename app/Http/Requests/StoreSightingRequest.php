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
        // Define which types are "person-based" for validation logic
        $personTypes = ['suspicious_person', 'loitering_youth', 'trespassing'];
        $isPerson = in_array($this->type, $personTypes);

        return [
            'latitude' => ['required', 'numeric'],
            'longitude' => ['required', 'numeric'],
            'type' => ['required', 'in:suspicious_person,loitering_youth,trespassing,suspicious_vehicle,vandalism,theft_risk,other'],
            'short_description' => [
                'required',
                'string',
                'min:10',
                'max:255',
                'regex:/[a-zA-Z]/'
            ],

            // Validate person details ONLY if type is a person-based microlabel
            'details.hair_color' => [$isPerson ? 'required' : 'nullable', 'string', 'max:50'],
            'details.height' => [$isPerson ? 'required' : 'nullable', 'in:short,middle,tall'],
            'details.headwear' => ['nullable', 'string'],
            'details.shirt' => ['nullable', 'string'],
            'details.pants' => ['nullable', 'string'],

            // Validate object details ONLY if type is NOT a person-based microlabel
            'details.entity_type' => [!$isPerson ? 'required' : 'nullable', 'string', 'max:50'],
            'details.general_color' => [!$isPerson ? 'required' : 'nullable', 'string', 'max:50'],
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
