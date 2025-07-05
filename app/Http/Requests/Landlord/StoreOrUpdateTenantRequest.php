<?php

namespace App\Http\Requests\Landlord;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrUpdateTenantRequest extends FormRequest
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
        $tenantId = $this->route('tenant')?->id;

        return [
            'id' => ['required', 'string', Rule::unique('tenants', 'id')->ignore($tenantId)],
            'name' => 'required|string|max:255',
            'email' => ['required', 'email'],
            'phone' => 'nullable|string|max:20',
            'id_number' => 'nullable|string|max:50',
            'kra_pin' => 'nullable|string|max:20',
        
            'company_name' => 'nullable|string|max:255',
            'company_reg_no' => 'nullable|string|max:100',
            'industry' => 'nullable|string|max:100',
            'ownership_type' => 'nullable|string|max:50',
        
            'billing_email' => 'nullable|email',
            'billing_phone' => 'nullable|string|max:20',
            'billing_address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'currency' => 'nullable|string|max:10',
        
            'plan' => 'nullable|string|max:50',
            'trial_ends_at' => 'nullable|date',
            'subscription_ends_at' => 'nullable|date',
            'is_active' => 'nullable|boolean',
        
            'domain' => ['required', 'string', Rule::unique('domains', 'domain')->ignore(optional($this->route('tenant')?->domains->first())->id)],
        ];
    }

    public function messages(): array
    {
        return [
            'id.required' => 'Tenant ID is required.',
            'id.unique' => 'This tenant ID is already taken.',
            'name.required' => 'Tenant name is required.',
            'email.required' => 'Email is required.',
            'email.email' => 'Invalid email format.',
            'domain.required' => 'Domain is required.',
            'domain.unique' => 'This domain is already associated with another tenant.',
        ];
    }
}
