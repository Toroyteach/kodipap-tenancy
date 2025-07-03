<?php

namespace App\Http\Controllers;

use App\Models\Lease;
use App\Models\Payment;
use App\Models\User;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Use Carbon::now() to get the actual current date dynamically
            $now = Carbon::now();

            // Define the reporting period for "this month" as the *last full month*
            $currentReportingMonthStart = $now->copy()->subMonth()->startOfMonth();
            $currentReportingMonthEnd = $now->copy()->subMonth()->endOfMonth();

            // Define the reporting period for "last month" as the *month before the last full month*
            $previousReportingMonthStart = $now->copy()->subMonths(2)->startOfMonth();
            $previousReportingMonthEnd = $now->copy()->subMonths(2)->endOfMonth();
    
            // Total collections for the current reporting month (last full month)
            $thisMonthTotal = Payment::whereBetween('payment_date', [$currentReportingMonthStart, $currentReportingMonthEnd])->sum('amount');
            // Total collections for the previous reporting month (month before last full month)
            $lastMonthTotal = Payment::whereBetween('payment_date', [$previousReportingMonthStart, $previousReportingMonthEnd])->sum('amount');
            $collectionsChange = $lastMonthTotal > 0 ? (($thisMonthTotal - $lastMonthTotal) / $lastMonthTotal) * 100 : 100;
    
            $activeTenants = Lease::where('status', 'active')
                ->whereDate('start_date', '<=', $currentReportingMonthEnd)
                ->whereDate('end_date', '>=', $currentReportingMonthStart)
                ->distinct('user_id')
                ->count('user_id');
    
            $lastMonthTenants = Lease::where('status', 'active')
                ->whereDate('start_date', '<=', $previousReportingMonthEnd)
                ->whereDate('end_date', '>=', $previousReportingMonthStart)
                ->distinct('user_id')
                ->count('user_id');
    
            $tenantsChange = $lastMonthTenants > 0 ? (($activeTenants - $lastMonthTenants) / $lastMonthTenants) * 100 : 100;


            // Pending payments = unpaid invoices (calculated for the current reporting month)
            $pendingPayments = Invoice::where('status', 'unpaid')
                ->whereBetween('issue_date', [$currentReportingMonthStart, $currentReportingMonthEnd]) // Assuming pending for the current reporting month
                ->sum('amount');
            // Pending payments for the previous reporting month
            $lastMonthPending = Invoice::where('status', 'unpaid')
                ->whereBetween('issue_date', [$previousReportingMonthStart, $previousReportingMonthEnd]) // Assuming pending for the previous reporting month
                ->sum('amount');

            $pendingChange = $lastMonthPending > 0 ? (($pendingPayments - $lastMonthPending) / $lastMonthPending) * 100 : 100;
    
            // Monthly collections (last 6 full months relative to $now)
            $monthlyCollections = collect();

            for ($i = 6; $i >= 1; $i--) {
                $start = $now->copy()->subMonths($i)->startOfMonth();
                $end = $now->copy()->subMonths($i)->endOfMonth();
            
                // Collected amount in the month
                $collected = Payment::whereBetween('payment_date', [$start, $end])->sum('amount');
            
                // Expected target: sum of rent_amount for leases active during this month
                $target = \App\Models\Lease::where(function ($q) use ($start, $end) {
                    $q->whereDate('start_date', '<=', $end)
                      ->whereDate('end_date', '>=', $start)
                      ->orWhereNull('end_date');
                })->sum('rent_amount');
            
                $monthlyCollections->push([
                    'month' => $start->format('M Y'),
                    'amount' => $collected,
                    'target' => $target,
                ]);
            }
    
            // Recent payments (still based on actual latest payments)
            $recentPayments = Payment::with(['lease.tenant', 'lease.unit'])
                ->latest('payment_date')
                ->take(5)
                ->get();
    
            return Inertia::render('Dashboard', [
                'stats' => [
                    'total_collections' => $thisMonthTotal,
                    'last_month_total_collections' => $lastMonthTotal,
                    'collections_change' => round($collectionsChange, 2),
                    'active_tenants' => $activeTenants,
                    'tenants_change' => round($tenantsChange, 2),
                    'pending_payments' => $pendingPayments,
                    'pending_change' => round($pendingChange, 2),
                ],
                'monthly_collections' => $monthlyCollections,
                'recent_payments' => $recentPayments,
            ]);
        } catch (\Throwable $e) {
            Log::error('Dashboard load failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to load dashboard data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}