<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    protected $model = Account::class;

    public function definition(): array
    {
        $totalInvoiced = $this->faker->numberBetween(5000, 20000);
        $totalPaid = $this->faker->numberBetween(3000, 25000);
        $balance = $totalPaid - $totalInvoiced;

        return [
            'user_id' => User::factory(),
            'total_invoiced' => $totalInvoiced,
            'total_paid' => $totalPaid,
            'balance' => $balance,
            'status' => $balance > 0 ? 'credit' : ($balance < 0 ? 'arrears' : 'cleared'),
        ];
    }

    public function withTenantData(User $tenant): static
    {
        return $this->state(function () use ($tenant) {
            $totalInvoiced = fake()->numberBetween(5000, 15000);
            $totalPaid = fake()->numberBetween(5000, 15000);
            $balance = $totalPaid - $totalInvoiced;

            return [
                'user_id' => $tenant->id,
                'total_invoiced' => $totalInvoiced,
                'total_paid' => $totalPaid,
                'balance' => $balance,
                'status' => $balance > 0 ? 'credit' : ($balance < 0 ? 'arrears' : 'cleared'),
            ];
        });
    }
}
