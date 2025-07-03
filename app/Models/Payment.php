<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentFactory> */
    use HasFactory;

    protected $fillable = [
        'lease_id',
        'amount',
        'payment_date',
        'method',
        'transaction_reference',
        'notes',
    ];

    protected $dates = [
        'payment_date',
    ];

    public function lease()
    {
        return $this->belongsTo(Lease::class);
    }

    public function tenant()
    {
        return $this->hasOneThrough(User::class, Lease::class, 'id', 'id', 'lease_id', 'user_id');
    }

    public function unit()
    {
        return $this->hasOneThrough(Unit::class, Lease::class, 'id', 'id', 'lease_id', 'unit_id');
    }
}
