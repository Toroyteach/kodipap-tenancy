<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    /** @use HasFactory<\Database\Factories\PropertyFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'location',
        'owner_name',
        'contact_number',
        'default_rent_amount',
        'rent_due_date',
        'user_id'
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    public function units()
    {
        return $this->hasMany(Unit::class);
    }
}
