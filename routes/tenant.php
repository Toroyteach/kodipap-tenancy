<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;
use Stancl\Tenancy\Middleware\CheckTenantForMaintenanceMode;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\NotificationController;
use Illuminate\Foundation\Application;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
    CheckTenantForMaintenanceMode::class
])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Welcome', [
            'auth' => ['user' => auth()->user()],
        ]);
    });
    
    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
        
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
        // Tenants
        Route::get('lease-form-data', [TenantController::class, 'leaseFormData']);
        //TODO: change the names of the routes
        Route::prefix('tenants')->name('tenants.')->controller(TenantController::class)->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('{tenant}', 'show')->name('show');
            Route::post('{lease}/send-reminder', 'sendReminder')->name('send-reminder');
            Route::post('{lease}/send-receipt', 'sendReceipt')->name('send-receipt');
            Route::post('{lease}/send-custom-message', 'sendCustomMessage')->name('send-custom-message');
            Route::post('create-lease', [TenantController::class, 'createLease']);
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
    
        // Settings
        Route::prefix('settings')->name('settings.')->controller(SettingController::class)->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/app', 'updateAppSettings')->name('app.update');
            Route::post('/property', 'updatePropertySettings')->name('property.update');
            Route::post('/notifications', 'updateNotificationSettings')->name('notifications.update');
            Route::post('/payment', 'updatePaymentSettings')->name('payment.update');
        });
    
        //notifications
        Route::prefix('notifications')->name('notifications.')->group(function () {
            Route::get('/', [NotificationController::class, 'index'])->name('index');
            Route::post('/send/type', [NotificationController::class, 'sendByType'])->name('send.type');
            Route::post('/send/custom', [NotificationController::class, 'sendByCustomMessage'])->name('send.custom');
            Route::post('/send/bulk', [NotificationController::class, 'sendBulkByCustomMessage'])->name('send.bulk');
            Route::post('/resend/{id}', [NotificationController::class, 'resend'])->name('resend');
        });
    });
    
    require __DIR__.'/auth.php';
});
