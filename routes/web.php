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
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

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

    Route::prefix('settings')->name('settings.')->controller(SettingController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'update')->name('update');
        Route::post('send-bulk-message', 'sendBulkMessage')->name('send-bulk-message');
        Route::post('upload-bulk', 'uploadBulkData')->name('upload-bulk');
    });
// Route::get('/dashboard', function () {
//     $user = auth()->user();
    
//     return Inertia::render('Dashboard', [
//         'user' => [
//             'name' => $user->name,
//             'email' => $user->email,
//             'roles' => $user->roles ? $user->roles->map->only('name') : [['name' => 'User']]
//         ],
//         'tab' => request()->query('tab', 'overview')
//     ]);
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Properties route
    Route::get('/properties', function () {
        return Inertia::render('Properties/Index');
    })->name('properties.index');
    
    // Sample tenant data (replace with data from your database)
    $tenants = [
        ['id' => 1, 'name' => 'John Doe', 'email' => 'john.doe@example.com', 'phone' => '123-456-7890', 'unit' => 'A101', 'rent' => 1200, 'last_payment' => '2024-06-01', 'due_date' => '2024-07-01', 'status' => 'Paid', 'balance' => 0, 'property' => 'Evergreen Apartments', 'lease_start' => '2023-01-15', 'lease_end' => '2024-01-14', 'payments' => [['id' => 'PAY-001', 'date' => '2024-06-01', 'amount' => 1200, 'status' => 'Paid'], ['id' => 'PAY-002', 'date' => '2024-05-01', 'amount' => 1200, 'status' => 'Paid']]],
        ['id' => 2, 'name' => 'Jane Smith', 'email' => 'jane.smith@example.com', 'phone' => '987-654-3210', 'unit' => 'B203', 'rent' => 1500, 'last_payment' => '2024-05-15', 'due_date' => '2024-06-15', 'status' => 'Overdue', 'balance' => 1500, 'property' => 'Evergreen Apartments', 'lease_start' => '2022-11-01', 'lease_end' => '2023-10-31', 'payments' => [['id' => 'PAY-004', 'date' => '2024-05-15', 'amount' => 1500, 'status' => 'Paid']]],
        ['id' => 3, 'name' => 'Mike Johnson', 'email' => 'mike.johnson@example.com', 'phone' => '555-123-4567', 'unit' => 'C305', 'rent' => 1100, 'last_payment' => '2024-06-05', 'due_date' => '2024-07-05', 'status' => 'Paid', 'balance' => 0, 'property' => 'Sunset Towers', 'lease_start' => '2023-08-20', 'lease_end' => '2024-08-19', 'payments' => [['id' => 'PAY-005', 'date' => '2024-06-05', 'amount' => 1100, 'status' => 'Paid']]],
        ['id' => 4, 'name' => 'Emily Davis', 'email' => 'emily.davis@example.com', 'phone' => '555-987-6543', 'unit' => 'D401', 'rent' => 1350, 'last_payment' => '2024-06-01', 'due_date' => '2024-07-01', 'status' => 'Paid', 'balance' => 0, 'property' => 'Sunset Towers', 'lease_start' => '2023-03-10', 'lease_end' => '2024-03-09', 'payments' => [['id' => 'PAY-006', 'date' => '2024-06-01', 'amount' => 1350, 'status' => 'Paid']]],
        ['id' => 5, 'name' => 'Chris Lee', 'email' => 'chris.lee@example.com', 'phone' => '555-555-5555', 'unit' => 'E502', 'rent' => 1600, 'last_payment' => '2024-04-20', 'due_date' => '2024-05-20', 'status' => 'Overdue', 'balance' => 1600, 'property' => 'Oceanview Villas', 'lease_start' => '2023-09-01', 'lease_end' => '2024-08-31', 'payments' => [['id' => 'PAY-007', 'date' => '2024-04-20', 'amount' => 1600, 'status' => 'Paid']]],
    ];

    // Tenants route
    // Route::get('/tenants', function () use ($tenants) {
    //     $filteredTenants = collect($tenants)->when(Request::input('search'), function ($query, $search) {
    //         return $query->filter(function ($tenant) use ($search) {
    //             return str_contains(strtolower($tenant['name']), strtolower($search)) ||
    //                    str_contains(strtolower($tenant['email']), strtolower($search)) ||
    //                    str_contains($tenant['phone'], $search) ||
    //                    str_contains(strtolower($tenant['unit']), strtolower($search));
    //         });
    //     })->when(Request::input('status'), function ($query, $status) {
    //         return $query->where('status', $status);
    //     });

    //     return Inertia::render('Tenants/Index', [
    //         'tenants' => $filteredTenants->values()->all(),
    //         'filters' => Request::all('search', 'status'),
    //     ]);
    // })->name('tenants.index');

    // Route::get('/tenants/{id}', function ($id) use ($tenants) {
    //     $tenant = collect($tenants)->firstWhere('id', $id);
    //     // dd($tenant);

    //     if (!$tenant) {
    //         abort(404);
    //     }

    //     $allTenantsForSwitcher = collect($tenants)->map(function ($t) {
    //         return ['id' => $t['id'], 'name' => $t['name']];
    //     });


    //     return Inertia::render('Tenants/Show', [
    //         'tenant' => $tenant,
    //         'allTenants' => $allTenantsForSwitcher
    //     ]);
    // })->name('tenants.show');
    
    // Payments route
    // Route::get('/payments', function () {
    //     return Inertia::render('Payments/Index');
    // })->name('payments.index');
    
    // Reports route
    // Route::get('/reports', function () {
    //     return Inertia::render('Reports/Index');
    // })->name('reports.index');
    
    // Settings routes
    Route::get('/settings/{tab?}', function ($tab = 'profile') {
        return Inertia::render('Settings/Index', [
            'tab' => $tab,
            'user' => auth()->user()
        ]);
    })->where('tab', 'profile|account|security|notifications|billing')
      ->name('settings');
    
});

// Route::get('/settings', function () {
//     // Sample notifications data (replace with data from your database)
//     $notifications = [
//         ['id' => 1, 'message' => 'Rent reminder for Unit A101', 'status' => 'Sent', 'created_at' => '2024-06-28 10:00:00'],
//         ['id' => 2, 'message' => 'Overdue balance notice for Jane Smith', 'status' => 'Sent', 'created_at' => '2024-06-27 15:30:00'],
//         ['id' => 3, 'message' => 'Bulk message: Maintenance scheduled for tomorrow', 'status' => 'Failed', 'created_at' => '2024-06-26 11:00:00'],
//         ['id' => 4, 'message' => 'Welcome message to new tenant Chris Lee', 'status' => 'Pending', 'created_at' => '2024-06-25 09:00:00'],
//     ];

//     return Inertia::render('Settings/Index', [
//         'notifications' => $notifications,
//     ]);
// })->name('settings.index');

require __DIR__.'/auth.php';
