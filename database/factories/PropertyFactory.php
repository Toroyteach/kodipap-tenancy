<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Property>
 */
class PropertyFactory extends Factory
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
            'name' => fake()->company . ' Apartments',
            'description' => fake()->sentence(),
            'location' => fake()->address(),
            'owner_name' => fake()->name(),
            'contact_number' => fake()->phoneNumber(),
            'default_rent_amount' => fake()->randomFloat(2, 10000, 50000),
            'rent_due_date' => now()->addDays(30),
        ];
    }
}
