<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = auth()->user();
    
    return Inertia::render('Dashboard', [
        'user' => [
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->roles ? $user->roles->map->only('name') : [['name' => 'User']]
        ],
        'tab' => request()->query('tab', 'overview')
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Properties route
    Route::get('/properties', function () {
        return Inertia::render('Properties/Index');
    })->name('properties.index');
    
    // Tenants route
    Route::get('/tenants', function () {
        return Inertia::render('Tenants/Index');
    })->name('tenants.index');
    
    // Payments route
    Route::get('/payments', function () {
        return Inertia::render('Payments/Index');
    })->name('payments.index');
    
    // Reports route
    Route::get('/reports', function () {
        return Inertia::render('Reports/Index');
    })->name('reports.index');
    
    // Settings routes
    Route::get('/settings/{tab?}', function ($tab = 'profile') {
        return Inertia::render('Settings/Index', [
            'tab' => $tab,
            'user' => auth()->user()
        ]);
    })->where('tab', 'profile|account|security|notifications|billing')
      ->name('settings');
    
});

require __DIR__.'/auth.php';
