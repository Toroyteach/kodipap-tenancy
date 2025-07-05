<?php

namespace App\Http\Controllers;

use App\Models\Lease;
use App\Models\Invoice;
use App\Models\User;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\NotificationLogs;
use App\Jobs\SendTenantNotification;
use App\Http\Requests\CreateLeaseRequest;

class TenantController extends Controller
{
    public function index(Request $request)
    {
        try {
            $tenants = Lease::with([
                    'tenant:id,name,email,phone',
                    'unit.property:id,name',
                    'payments' => fn($q) => $q->latest()
                ])
                ->where('status', 'active')
                ->get()
                ->map(function ($lease) {
                    return [
                        'id' => $lease->tenant->id,
                        'name' => $lease->tenant->name,
                        'email' => $lease->tenant->email,
                        'phone' => $lease->tenant->phone,
                        'status' => $lease->status,
                        'due' => $lease->end_date,
                        'phone' => $lease->tenant->phone,
                        'monthly_rent' => $lease->rent_amount,
                        'balance' => Invoice::where('lease_id', $lease->id)->where('status', 'unpaid')->sum('amount'),
                        'last_payment' => $lease->payments->first()?->payment_date,
                        'property' => $lease->unit->property->name ?? null,
                    ];
                });
            
            return Inertia::render('Tenants/Index', [
                'tenants' => $tenants
            ]);
        } catch (\Throwable $e) {
            Log::error('Tenant list load failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to load tenants.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function sendReminder(Request $request, $leaseId)
    {
        try {
            $lease = Lease::with('tenant')->findOrFail($leaseId);
            $user = $lease->tenant;

            $messageSetting = Setting::where('key', 'send_reminder_message')->first();
            $message = $messageSetting?->value ?? 'This is a reminder regarding your lease account.';

            dispatch(new SendTenantNotification($user, $message));

            return response()->json(['message' => 'Reminder sent successfully.']);
        } catch (\Throwable $e) {
            Log::error("Failed to send reminder: " . $e->getMessage());
            return response()->json([
                'message' => 'Failed to send reminder.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function sendCustomMessage(Request $request, $leaseId)
    {
        try {
            $request->validate([
                'message' => 'required|string',
            ]);

            $lease = Lease::with('tenant')->findOrFail($leaseId);
            $user = $lease->tenant;

            dispatch(new SendTenantNotification($user, $request->message));

            return response()->json(['message' => 'Custom message sent successfully.']);
        } catch (\Throwable $e) {
            Log::error("Failed to send custom message: " . $e->getMessage());
            return response()->json([
                'message' => 'Failed to send custom message.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($tenantId)
    {
        try {
            // Load the tenant with leases, units, and payments
            $tenant = User::with([
                'leases.unit',
                'leases.payments' => fn($q) => $q->latest(),
            ])->findOrFail($tenantId);
    
            // Get all tenants for the TenantSwitcher dropdown
            $allTenantsForSwitcher = User::where('type', 'tenant')
                ->select('id', 'name')
                ->orderBy('name')
                ->get();
    
            return Inertia::render('Tenants/Show', [
                'tenant' => $tenant,
                'allTenants' => $allTenantsForSwitcher,
            ]);
        } catch (\Throwable $e) {
            Log::error('Failed to load tenant details: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to load tenant details.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function sendReceipt($leaseId)
    {
        try {
            $lease = Lease::with('tenant', 'payments')->findOrFail($leaseId);
            $user = $lease->tenant;
            $payment = $lease->payments()->latest()->first();

            if (!$payment) {
                return response()->json(['message' => 'No payment found for this tenant.'], 404);
            }

            $alreadySent = NotificationLogs::where('notifiable_type', get_class($user))
                ->where('notifiable_id', $user->id)
                ->where('message', 'like', '%' . $payment->reference . '%')
                ->exists();

            if ($alreadySent) {
                return response()->json(['message' => 'Receipt has already been sent to the user.'], 409);
            }

            $message = "Payment receipt for KES {$payment->amount} made on {$payment->paid_at->format('Y-m-d H:i')} (Ref: {$payment->reference}).";

            dispatch(new SendTenantNotification($user, $message));

            return response()->json(['message' => 'Receipt sent successfully.']);
        } catch (\Throwable $e) {
            Log::error('Failed to send receipt: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to send receipt.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // GET: Units + Users available for lease
    public function leaseFormData()
    {
        $availableUnits = Unit::doesntHave('lease')
            ->where('status', 'available')
            ->select('id', 'unit_number')
            ->get();

        $users = User::where('type', 'tenant')->select('id', 'name')->get();

        return back()->with([
            'units' => $availableUnits,
            'users' => $users,
        ]);
    }

    // POST: Create lease
    public function createLease(CreateLeaseRequest $request)
    {
        $validated = $request->validated();

        $lease = Lease::create([
            'user_id' => $validated['user_id'],
            'unit_id' => $validated['unit_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'rent_amount' => $validated['rent_amount'],
            'deposit_amount' => $validated['deposit_amount'] ?? 0,
            'status' => 'active',
        ]);

        return back()->with(['message' => 'Lease created', 'lease' => $lease]);
    }
}
