<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Lease;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
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
            'amount' => fake()->randomFloat(2, 8000, 30000),
            'payment_date' => now()->subDays(rand(1, 30)),
            'method' => fake()->randomElement(['cash', 'mpesa', 'bank', 'cheque', 'online']),
            'transaction_reference' => Str::uuid(),
            'notes' => fake()->sentence(),
        ];
    }
}
