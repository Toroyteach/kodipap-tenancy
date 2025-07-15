<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Services\TenantAccountService;

class Lease extends Model
{
    /** @use HasFactory<\Database\Factories\LeaseFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'unit_id',
        'start_date',
        'end_date',
        'rent_amount',
        'deposit_amount',
        'status',
    ];


    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }
    
    public function tenant()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
    
    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function applyPayment(float $amount): void
    {
        $this->payments()->create([
            'amount' => $amount,
            'payment_date' => now(),
            'method' => 'mpesa',
            'transaction_reference' => Str::uuid(),
            'notes' => 'Auto-applied via MPESA',
        ]);

        TenantAccountService::make($this->tenant)->syncAccount();
    }
}
