<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Property;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Unit>
 */
class UnitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'property_id' => Property::factory(),
            'unit_number' => 'U-' . fake()->unique()->numerify('###'),
            'status' => fake()->randomElement(['available', 'occupied', 'maintenance']),
            'rent_amount' => fake()->randomFloat(2, 8000, 30000),
            'floor' => fake()->numberBetween(0, 5),
            'bedrooms' => fake()->numberBetween(1, 4),
            'bathrooms' => fake()->numberBetween(1, 3),
            'is_furnished' => fake()->boolean(),
        ];
    }
}
