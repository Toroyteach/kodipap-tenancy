<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Unit;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lease>
 */
class LeaseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'unit_id' => Unit::factory(),
            'start_date' => now()->subMonths(rand(0, 12)),
            'end_date' => null,
            'rent_amount' => fake()->randomFloat(2, 10000, 30000),
            'deposit_amount' => fake()->randomFloat(2, 5000, 10000),
            'status' => 'active',
        ];
    }
}
