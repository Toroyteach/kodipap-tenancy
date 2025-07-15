<?php

namespace Database\Seeders\Tenant;

use App\Models\User;
use App\Models\Property;
use App\Models\Unit;
use App\Models\Lease;
use App\Models\Payment;
use App\Models\Invoice;
use App\Models\MaintenanceRequest;
use App\Models\Setting;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call the SettingSeeder first
        $this->call(SettingSeeder::class);

        // Create an admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'type' => 'admin',
            'password' => Hash::make('password'),
        ]);

        // Create manager users
        User::factory(3)->create(['type' => 'manager']);

        // Create properties and units
        $properties = Property::factory(5)->create(['user_id' => $admin->id]);
        $properties->each(fn($property) => Unit::factory(5)->create(['property_id' => $property->id]));

        // Create tenant users
        $tenants = User::factory(30)->create(['type' => 'tenant']); // Increased tenants to ensure enough unique tenants for leases
        $units = Unit::all(); // Get all units for random assignment

        // Define the number of leases for each month from January to June 2025
        // This array defines the exponential growth with a dip for varying results
        // Index 0 = January, 1 = February, etc.
        $leaseCountsPerMonth = [
            5,  // January
            8,  // February
            13, // March
            10, // April (a dip to create variation in percentage change)
            18, // May
            25  // June
        ];

        // Loop through the months from January to June 2025
        for ($i = 0; $i < count($leaseCountsPerMonth); $i++) {
            // Calculate the current month's start and end dates
            $currentMonth = Carbon::create(2025, $i + 1, 1);
            $startDate = $currentMonth->copy()->startOfMonth();
            $endDate = $currentMonth->copy()->endOfMonth();

            // Get the number of leases to create for the current month
            $numberOfLeases = $leaseCountsPerMonth[$i];

            // Create the specified number of leases for the current month
            for ($j = 0; $j < $numberOfLeases; $j++) {
                // Get a random tenant and unit for the lease
                $tenant = $tenants->random();
                $unit = $units->random();

                // Determine if the invoice should be unpaid (e.g., 20% chance)
                $isUnpaid = (rand(1, 100) <= 20); // 20% chance of being unpaid
                $invoiceStatus = $isUnpaid ? 'unpaid' : 'paid';
                $leaseStatus = $isUnpaid ? 'active' : 'terminated';

                // Create the Lease record
                $lease = Lease::factory()->create([
                    'user_id' => $tenant->id,
                    'unit_id' => $unit->id,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'rent_amount' => $unit->rent_amount,
                    'deposit_amount' => 0, // Assuming no deposit for these seeded leases
                    'status' => $leaseStatus,
                ]);

                // Create an associated Invoice for the lease
                // The status is now conditionally set to 'unpaid' or 'paid'
                $invoice = Invoice::factory()->create([
                    'lease_id' => $lease->id,
                    'issue_date' => $startDate,
                    'due_date' => $startDate->copy()->addDays(5), // Due 5 days after start
                    'amount' => $unit->rent_amount,
                    'status' => $invoiceStatus, // Set status based on $isUnpaid
                ]);

                // Only create a payment if the invoice is 'paid'
                if (!$isUnpaid) {
                    Payment::factory()->create([
                        'lease_id' => $lease->id,
                        'amount' => $unit->rent_amount,
                        'payment_date' => $startDate->copy()->addDays(4), // Paid 4 days after start
                        'method' => 'mpesa', // Example payment method
                    ]);
                }
            }
        }

        $tenants->each(function ($tenant) {
            Account::factory()->withTenantData($tenant)->create();
        });
    }
}