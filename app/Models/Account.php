<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    /** @use HasFactory<\Database\Factories\AccountFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_paid',
        'total_invoiced',
        'balance',
        'status',
    ];

    public function tenant()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
