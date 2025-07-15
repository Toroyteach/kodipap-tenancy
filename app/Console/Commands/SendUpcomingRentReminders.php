<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Lease;
use App\Services\NotificationService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use App\Helpers\Settings;
use App\Jobs\SendTenantNotification;

class SendUpcomingRentReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-upcoming-rent-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send rent due reminder a few days before due date';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        try {
            $defaultDueDay = (int) Setting::where('key', 'default_rent_due_day')->value('value') ?? 5;
            $enableSms = Setting::where('key', 'enable_sms_notifications')->value('value') === 'true';
            $smsTemplate = Setting::where('key', 'sms_upcoming_rent')->value('value') 
                ?? 'Hi :name, rent of :amount is due by :date. Please pay to avoid penalties.';
    
            if ($today->day !== $defaultDueDay || !$enableSms) {
                $this->info("Today is not the configured rent reminder day or SMS is disabled.");
                return;
            }
    
            $leases = Lease::with(['tenant.account', 'unit.property'])
                ->where('status', 'active')
                ->get();
    
            $sent = 0;
    
            foreach ($leases as $lease) {
                $tenant = $lease->tenant;
                $account = $tenant->account;
                $property = $lease->unit->property;
    
                if (!$tenant || !$property || !$account || !$tenant->phone) {
                    Log::warning("Incomplete lease or tenant data for lease ID {$lease->id}");
                    continue;
                }
    
                // Skip if tenant has no balance due
                if ($account->balance >= 0) continue;
    
                $amountDue = number_format(abs($account->balance), 2);
                $dueDate = $today->copy()->endOfMonth()->format('M d');
    
                $message = str_replace(
                    [':name', ':amount', ':date'],
                    [$tenant->name, $amountDue, $dueDate],
                    $smsTemplate
                );
    
                if (strlen($message) > 146) {
                    $message = substr($message, 0, 145) . '...';
                }
    
                SendTenantNotification::dispatch($tenant, $message);
                $sent++;
            }
    
            $this->info("Upcoming rent reminders sent to {$sent} tenants.");
        } catch (\Throwable $e) {
            Log::error('Upcoming rent reminder failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            $this->fail();
        }
    }
}