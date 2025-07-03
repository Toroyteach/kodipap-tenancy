<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    /** @use HasFactory<\Database\Factories\UnitFactory> */
    use HasFactory;

    protected $fillable = [
        'property_id',
        'unit_number',
        'status',
        'rent_amount',
        'floor',
        'bedrooms',
        'bathrooms',
        'is_furnished',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
    
    public function lease()
    {
        return $this->hasOne(Lease::class)->where('status', 'active');
    }
    
    public function invoices()
    {
        return $this->hasManyThrough(Invoice::class, Lease::class);
    }
    
    public function payments()
    {
        return $this->hasManyThrough(Payment::class, Lease::class);
    }
}
