<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        try {
            $today = now()->toDateString();

            $todayTotal = Payment::whereDate('payment_date', $today)->sum('amount');
    
            $totalMpesa = Payment::where('method', 'mpesa')->sum('amount');
            $totalBank = Payment::where('method', 'bank')->sum('amount');

            $totalPending = Invoice::where('status', 'unpaid')->sum('amount');
    
            $payments = Payment::with([
                    'lease.tenant:id,name',
                    'lease.unit:id,unit_number,property_id',
                    'lease.unit.property:id,name'
                ])
                ->latest()
                ->limit(10)
                ->get()
                ->map(function ($payment) {
                    return [
                        'id' => $payment->id,
                        'tenant' => $payment->lease->tenant->name ?? '',
                        'unit' => $payment->lease->unit->unit_number ?? '',
                        'property' => $payment->lease->unit->property->name ?? '',
                        'amount' => $payment->amount,
                        'method' => $payment->method,
                        'status' => 'completed',
                        'reference' => $payment->transaction_reference,
                        'paid_at' => $payment->payment_date,
                    ];
                });
    
            return Inertia::render('Payments/Index', [
                'stats' => [
                    'today_total' => $todayTotal,
                    'total_mpesa' => $totalMpesa,
                    'total_bank' => $totalBank,
                    'total_pending' => $totalPending,
                ],
                'payments' => $payments,
            ]);
        } catch (\Throwable $e) {
            Log::error('Payments load failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to load payments.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($paymentId)
    {
        try {
            $payment = Payment::with([
                    'lease.tenant:id,name,email,phone',
                    'lease.unit:id,unit_number,property_id',
                    'lease.unit.property:id,name',
                    'lease.payments' => fn($q) => $q->latest(),
                ])
                ->findOrFail($paymentId);

            return Inertia::render('Payments/Show', [
                'payment' => [
                    'id' => $payment->id,
                    'amount' => $payment->amount,
                    'method' => $payment->method,
                    'status' => $payment->status,
                    'reference' => $payment->reference,
                    'paid_at' => $payment->paid_at?->format('Y-m-d H:i'),
                ],
                'tenant' => [
                    'id' => $payment->lease->tenant->id,
                    'name' => $payment->lease->tenant->name,
                    'email' => $payment->lease->tenant->email,
                    'phone' => $payment->lease->tenant->phone,
                ],
                'unit' => $payment->lease->unit->unit_number ?? '',
                'property' => $payment->lease->unit->property->name ?? '',
                'payment_history' => $payment->lease->payments->map(function ($p) {
                    return [
                        'amount' => $p->amount,
                        'method' => $p->method,
                        'status' => $p->status,
                        'reference' => $p->reference,
                        'paid_at' => optional($p->paid_at)->format('Y-m-d H:i'),
                    ];
                }),
            ]);
        } catch (\Throwable $e) {
            Log::error('Payment detail load failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to load payment details.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
