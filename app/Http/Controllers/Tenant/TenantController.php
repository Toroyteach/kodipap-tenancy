<?php

namespace App\Http\Controllers\Tenant;

use Illuminate\Support\Facades\Cache;
use App\Http\Controllers\Controller;
use App\Http\Requests\Landlord\StoreOrUpdateTenantRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Stancl\Tenancy\Tenancy;
use Inertia\Inertia;
use App\Models\Tenant;
use App\Models\Domain;
use Throwable;

class TenantController extends Controller
{

    public function index()
    {
        $totalTenants = Tenant::count();
        $latestTenants = Tenant::with('domains:id,domain,tenant_id')->latest()->take(5)->get();

        return Inertia::render('Multitenancy/Dashboard', [
            'totalTenants' => $totalTenants,
            'latestTenants' => $latestTenants,
        ]);
    }

    public function createTenant()
    {
        return Inertia::render('Multitenancy/Landlord/Create');
    }

    public function storeTenant(StoreOrUpdateTenantRequest $request)
    {
        try {
            $tenant = new Tenant();
            $tenant->id = $request->id;
            $tenant->name = $request->name;
            $tenant->email = $request->email;
            $tenant->phone = $request->phone;
            $tenant->id_number = $request->id_number;
            $tenant->kra_pin = $request->kra_pin;
            $tenant->company_name = $request->company_name;
            $tenant->company_reg_no = $request->company_reg_no;
            $tenant->industry = $request->industry;
            $tenant->ownership_type = $request->ownership_type;
            $tenant->billing_email = $request->billing_email;
            $tenant->billing_phone = $request->billing_phone;
            $tenant->billing_address = $request->billing_address;
            $tenant->city = $request->city;
            $tenant->country = $request->country;
            $tenant->currency = $request->currency;
            $tenant->plan = $request->plan;
            $tenant->trial_ends_at = $request->trial_ends_at;
            $tenant->subscription_ends_at = $request->subscription_ends_at;
            $tenant->is_active = $request->boolean('is_active');

            $tenant->save();
    
            $tenant->domains()->create([
                'domain' => $request->input('domain'),
            ]);
    
            return back()->with('success', 'Tenant created successfully.');
        } catch (Throwable $e) {
            Log::error('Tenant creation failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to create tenant.']);
        }
    }

    /**
     * Display the specified tenant and their model counts.
     *
     * @param  \App\Models\Tenant  $tenant
     * @return \Inertia\Response
     */
    public function showTenant(Tenant $tenant)
    {
        try {
            // Load related domains
            $tenant->load('domains:id,domain,tenant_id');
    
            // Define models and aliases
            $modelsToCount = [
                \App\Models\User::class => 'users',
                \App\Models\Property::class => 'properties',
                \App\Models\Unit::class => 'units',
                \App\Models\Lease::class => 'leases',
                \App\Models\Invoice::class => 'invoices',
                \App\Models\Payment::class => 'payments',
                \App\Models\Setting::class => 'settings',
                \App\Models\NotificationLog::class => 'notification_logs',
            ];
    
            // Get model counts without cache
            $counts = [];
    
            $tenant->run(function () use (&$counts, $modelsToCount, $tenant) {
                foreach ($modelsToCount as $modelClass => $alias) {
                    try {
                        $counts[$alias] = $modelClass::count();
                    } catch (Throwable $e) {
                        Log::warning("Could not get count for model {$modelClass} for tenant {$tenant->id}: " . $e->getMessage());
                        $counts[$alias] = 0;
                    }
                }
            });
    
            return Inertia::render('Multitenancy/Landlord/Show', [
                'tenant' => $tenant,
                'modelCounts' => $counts,
            ]);
        } catch (Throwable $e) {
            Log::error('Failed to retrieve tenant details or model counts', [
                'tenant_id' => $tenant->id,
                'error' => $e->getMessage(),
            ]);
    
            return response()->json([
                'message' => 'Failed to load dashboard data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function editTenant(Tenant $tenant)
    {
        $tenant->load('domains:id,domain,tenant_id');
        
        return Inertia::render('Multitenancy/Landlord/Edit', [
            'tenant' => $tenant
        ]);
    }

    public function updateTenant(StoreOrUpdateTenantRequest $request, Tenant $tenant)
    {
        try {
            // Handle ID change
            if ($request->id !== $tenant->id) {
                $newTenant = $tenant->replicate();
                $newTenant->id = $request->id;
                $newTenant->save();
    
                foreach ($tenant->domains as $domain) {
                    $domain->tenant_id = $newTenant->id;
                    $domain->save();
                }
    
                $tenant->delete();
                $tenant = $newTenant;
            }
    
            $tenant->name = $request->name;
            $tenant->email = $request->email;
            $tenant->phone = $request->phone;
            $tenant->id_number = $request->id_number;
            $tenant->kra_pin = $request->kra_pin;
            $tenant->company_name = $request->company_name;
            $tenant->company_reg_no = $request->company_reg_no;
            $tenant->industry = $request->industry;
            $tenant->ownership_type = $request->ownership_type;
            $tenant->billing_email = $request->billing_email;
            $tenant->billing_phone = $request->billing_phone;
            $tenant->billing_address = $request->billing_address;
            $tenant->city = $request->city;
            $tenant->country = $request->country;
            $tenant->currency = $request->currency;
            $tenant->plan = $request->plan;
            $tenant->trial_ends_at = $request->trial_ends_at;
            $tenant->subscription_ends_at = $request->subscription_ends_at;
            $tenant->is_active = $request->boolean('is_active');
    
            $tenant->save();
    
            $tenant->domains()->updateOrCreate(
                ['tenant_id' => $tenant->id],
                ['domain' => $request->input('domain')]
            );
    
            return back()->with('success', 'Tenant updated successfully.');
        } catch (Throwable $e) {
            Log::error('Tenant update failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to update tenant.']);
        }
    }

    public function destroyTenant(Tenant $tenant)
    {
        try {
            $tenant->delete();
            return redirect()->route('landlord.tenants.index')->with('success', 'Tenant deleted.');
        } catch (\Throwable $e) {
            \Log::error('Tenant deletion failed', ['error' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Failed to delete tenant.']);
        }
    }

    public function toggleActive(Tenant $tenant, Tenancy $tenancy)
    {
        try {
            $tenant->is_active = !$tenant->is_active;
            $tenant->save();

            if (! $tenant->is_active) {
                // Deactivate tenancy
                $tenant->putDownForMaintenance();
            } else {
                // Re-initialize tenancy
                $tenant->update(['maintenance_mode' => null]);
            }

            return back()->with('success', 'Tenant status toggled.');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Failed to toggle tenant status.']);
        }
    }

    public function createTenantAdmin(Request $request, $tenantId, Tenancy $tenancy)
    {
        $tenant = Tenant::findOrFail($tenantId);

        // Use the injected $tenancy instance
        $tenancy->initialize($tenant);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        try {
            \App\Models\User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'type' => 'admin', 
            ]);

            return back()->with('success', 'Tenant admin created successfully.');
        } catch (\Throwable $e) {

            \Log::error("Error creating tenant admin for tenant {$tenantId}: " . $e->getMessage());
            return response()->json([
                'message' => 'Failed to load dashboard data.',
                'error' => $e->getMessage(),
            ], 500);
        } finally {
            $tenancy->end();
        }
    }
}
