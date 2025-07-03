<?php

namespace App\Http\Controllers;

use App\Models\Lease;
use App\Models\Payment;
use App\Models\User; // Although User model is not directly used in the final calculations, it's good practice to keep if potentially needed elsewhere in the controller.
use App\Models\Invoice; // Although Invoice model is not directly used in the final calculations, it's good practice to keep if potentially needed elsewhere in the controller.
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB; // Required for DB::raw
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        try {
            $now = Carbon::now();

            // Define the reporting period for the "current" metrics as the *last full month*
            $currentReportingMonthStart = $now->copy()->subMonth()->startOfMonth();
            $currentReportingMonthEnd = $now->copy()->subMonth()->endOfMonth();

            // Define the reporting period for the "previous" metrics as the *month before the last full month*
            $previousReportingMonthStart = $now->copy()->subMonths(2)->startOfMonth();
            $previousReportingMonthEnd = $now->copy()->subMonths(2)->endOfMonth();

            // Total Revenue (cumulative up to the end of the last full month)
            $totalRevenue = Payment::whereDate('payment_date', '<=', $currentReportingMonthEnd)->sum('amount');
    
            // Active Tenants (count of distinct tenants with active leases during the last full month)
            $activeTenants = Lease::where('status', 'active')
                ->whereDate('start_date', '<=', $currentReportingMonthEnd)
                ->whereDate('end_date', '>=', $currentReportingMonthStart)
                ->distinct('user_id')
                ->count('user_id');
    
            // Average Rent (average rent amount for leases active during the last full month)
            $averageRent = Lease::where('status', 'active')
                ->whereDate('start_date', '<=', $currentReportingMonthEnd)
                ->whereDate('end_date', '>=', $currentReportingMonthStart)
                ->avg('rent_amount');
            
            // Handle case where no active leases for average rent calculation
            $averageRent = $averageRent ?? 0;

            // Revenue for the previous full month (e.g., May if current month is July)
            $previousReportingMonthRevenue = Payment::whereBetween('payment_date', [$previousReportingMonthStart, $previousReportingMonthEnd])->sum('amount');
    
            // Revenue for the last full month (e.g., June if current month is July)
            $currentReportingMonthRevenue = Payment::whereBetween('payment_date', [$currentReportingMonthStart, $currentReportingMonthEnd])->sum('amount');
    
            // Growth Rate (percentage change in revenue from the month before last to the last full month)
            $growth = $previousReportingMonthRevenue > 0
                ? (($currentReportingMonthRevenue - $previousReportingMonthRevenue) / $previousReportingMonthRevenue) * 100
                : 0; // If previous month had no revenue, growth is 0 (or can be 100 if current has revenue)

            // Calculate Expected Revenue for the last full month
            // Sum of rent_amount for all leases active during the current reporting month
            $expectedRevenueCurrentMonth = Lease::where('status', 'active')
                ->whereDate('start_date', '<=', $currentReportingMonthEnd)
                ->whereDate('end_date', '>=', $currentReportingMonthStart)
                ->sum('rent_amount');

            // Collection Rate (Actual collections / Expected collections for the last full month)
            $collectionRate = ($expectedRevenueCurrentMonth > 0)
                ? round(($currentReportingMonthRevenue / $expectedRevenueCurrentMonth) * 100, 2)
                : 0; // If no expected revenue, collection rate is 0
    
            // Line Chart Data (Monthly collections for the last 6 full months)
            $lineChartData = Payment::select(
                    DB::raw('DATE_FORMAT(payment_date, "%Y-%m") as month'),
                    DB::raw('SUM(amount) as total')
                )
                // Fetch data from 6 months before the last full month, up to the end of the last full month
                ->whereBetween('payment_date', [
                    $now->copy()->subMonths(6)->startOfMonth(),
                    $currentReportingMonthEnd
                ])
                ->groupBy('month')
                ->orderBy('month')
                ->get();
    
            // Pie Chart Data (Payment methods distribution for the last 6 full months)
            $pieChartData = Payment::select('method', DB::raw('SUM(amount) as total'))
                // Fetch data from 6 months before the last full month, up to the end of the last full month
                ->whereBetween('payment_date', [
                    $now->copy()->subMonths(6)->startOfMonth(),
                    $currentReportingMonthEnd
                ])
                ->groupBy('method')
                ->get();
    
            // Removed the dd() statement as requested.

            return Inertia::render('Reports/Index', [
                'stats' => [
                    'total_revenue' => $totalRevenue,
                    'active_tenants' => $activeTenants,
                    'average_rent' => round($averageRent, 2),
                    'collection_rate' => $collectionRate,
                    'growth_rate' => round($growth, 2),
                ],
                'line_chart' => $lineChartData,
                'pie_chart' => $pieChartData,
            ]);
        } catch (\Throwable $e) {
            Log::error('Reports load failed: ' . $e->getMessage());
            dd($e->getMessage());
            return response()->json(['error' => 'Failed to generate reports.'], 500);
        }
    }
}