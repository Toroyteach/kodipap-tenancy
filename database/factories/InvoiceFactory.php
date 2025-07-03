<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Lease;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'lease_id' => Lease::factory(),
            'issue_date' => now(),
            'due_date' => now()->addDays(10),
            'amount' => fake()->randomFloat(2, 10000, 30000),
            'status' => fake()->randomElement(['unpaid', 'paid', 'overdue']),
            'notes' => fake()->sentence(),
        ];
    }
}
