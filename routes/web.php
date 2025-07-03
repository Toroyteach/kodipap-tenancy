<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Tenants
    Route::prefix('tenants')->name('tenants.')->controller(TenantController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('{tenant}', 'show')->name('show');
        Route::post('{lease}/send-reminder', 'sendReminder')->name('send-reminder');
        Route::post('{lease}/send-receipt', 'sendReceipt')->name('send-receipt');
        Route::post('{lease}/send-custom-message', 'sendCustomMessage')->name('send-custom-message');
    });
    
    // Payments
    Route::prefix('payments')->name('payments.')->controller(PaymentController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('{payment}', 'show')->name('show');
    });
    
    // Reports
    Route::prefix('reports')->name('reports.')->controller(ReportController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('monthly-statement', 'downloadMonthlyStatement')->name('monthly-statement');
        Route::get('rental-schedule', 'downloadRentalSchedule')->name('rental-schedule');
        Route::get('tax-report', 'downloadTaxReport')->name('tax-report');
    });
    
    //Settings
    Route::prefix('settings')->name('settings.')->controller(SettingController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'update')->name('update');
        Route::post('send-bulk-message', 'sendBulkMessage')->name('send-bulk-message');
        Route::post('upload-bulk', 'uploadBulkData')->name('upload-bulk');
    });
});

require __DIR__.'/auth.php';
