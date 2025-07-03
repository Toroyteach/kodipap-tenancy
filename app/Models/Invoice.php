<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    /** @use HasFactory<\Database\Factories\InvoiceFactory> */
    use HasFactory;

    protected $fillable = [
        'lease_id',
        'issue_date',
        'due_date',
        'amount',
        'status',
        'notes',
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
