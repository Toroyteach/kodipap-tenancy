<?php

namespace App\Services;

use App\Models\User;
use App\Models\Lease;
use App\Models\Payment;
use App\Models\Invoice;
use App\Models\Account;
use Illuminate\Support\Collection;

class TenantAccountService
{
    protected User $tenant;

    public function __construct(User $tenant)
    {
        $this->tenant = $tenant;
    }

    public static function make(User $tenant): static
    {
        return new static($tenant);
    }

    public function getActiveLease(): ?Lease
    {
        return Lease::where('user_id', $this->tenant->id)
            ->where('status', 'active')
            ->with(['payments', 'invoices'])
            ->latest('start_date')
            ->first();
    }

    public function getInvoices(): Collection
    {
        return Invoice::whereHas('lease', function ($q) {
                $q->where('user_id', $this->tenant->id);
            })
            ->get();
    }

    public function getPayments(): Collection
    {
        return Payment::whereHas('lease', function ($q) {
                $q->where('user_id', $this->tenant->id);
            })
            ->get();
    }

    public function getTotalInvoiced(): float
    {
        return $this->getInvoices()->sum('amount');
    }

    public function getTotalPaid(): float
    {
        return $this->getPayments()->sum('amount');
    }

    public function getBalance(): float
    {
        return $this->getTotalPaid() - $this->getTotalInvoiced();
    }

    public function getAccountStatus(): string
    {
        $balance = $this->getBalance();

        return match (true) {
            $balance > 0 => 'credit',
            $balance < 0 => 'arrears',
            default => 'cleared',
        };
    }

    public function syncAccount(): void
    {
        $account = Account::firstOrNew(['user_id' => $this->tenant->id]);

        $account->fill([
            'total_paid' => $this->getTotalPaid(),
            'total_invoiced' => $this->getTotalInvoiced(),
            'balance' => $this->getBalance(),
            'status' => $this->getAccountStatus(),
        ])->save();
    }

    public function toArray(): array
    {
        return [
            'tenant_id' => $this->tenant->id,
            'name' => $this->tenant->name,
            'active_lease_id' => optional($this->getActiveLease())->id,
            'total_invoiced' => $this->getTotalInvoiced(),
            'total_paid' => $this->getTotalPaid(),
            'balance' => $this->getBalance(),
            'status' => $this->getAccountStatus(),
        ];
    }

    public function getExpectedRentAmount(): float
    {
        $lease = $this->getActiveLease();
        return $lease ? $lease->rent_amount : 0;
    }
}