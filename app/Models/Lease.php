<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
