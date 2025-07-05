<?php

use App\Http\Controllers\Tenant\TenantController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])
    ->prefix('system-landlord')
    ->group(function () {
        Route::get('clients', [TenantController::class, 'index']);
        Route::get('clients/create', [TenantController::class, 'createTenant']);
        Route::post('clients', [TenantController::class, 'storeTenant']);
        Route::get('clients/{tenant}', [TenantController::class, 'showTenant']);
        Route::get('clients/{tenant}/edit', [TenantController::class, 'editTenant']);
        Route::put('clients/{tenant}', [TenantController::class, 'updateTenant']);
        Route::delete('clients/{tenant}', [TenantController::class, 'destroyTenant']);
        Route::post('clients/{tenant}/create-admin', [TenantController::class, 'createTenantAdmin']);
        Route::put('clients/{tenant}/toggle-active', [TenantController::class, 'toggleActive']);
        Route::post('clients/{tenant}/run-seeder', [TenantController::class, 'runSeeder']);
    });


Route::get('/', function () {
    return redirect('/system-landlord/clients');
});

Route::get('/dashboard', function () {
    return redirect('/system-landlord/clients');
});

Route::middleware('auth', 'verified')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';