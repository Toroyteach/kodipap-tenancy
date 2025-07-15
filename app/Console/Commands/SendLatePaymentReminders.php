<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Lease;
use App\Models\Setting;
use App\Jobs\SendTenantNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SendLatePaymentReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-late-payment-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Notify tenants of late payments';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        try {
            $today = now();

            $enableSms = Setting::where('key', 'enable_sms_notifications')->value('value') === 'true';
            $smsTemplate = Setting::where('key', 'sms_late_payment')->value('value') 
                ?? 'Hi :name, your rent of :amount was due on :date and is now overdue. Please clear it immediately.';

            if (!$enableSms) {
                $this->info("SMS is disabled in settings.");
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

                if (!$tenant || !$account || !$property || !$tenant->phone) continue;

                $dueDay = (int) Setting::where('key', 'default_rent_due_day')->value('value') ?? 5;
                $expectedDueDate = Carbon::create($today->year, $today->month, $dueDay);

                if ($today->lessThan($expectedDueDate->addDay())) continue; // Not yet late

                if ($account->balance >= 0) continue; // No outstanding balance

                $amount = number_format(abs($account->balance), 2);
                $formattedDueDate = $expectedDueDate->format('M d');

                $message = str_replace(
                    [':name', ':amount', ':date'],
                    [$tenant->name, $amount, $formattedDueDate],
                    $smsTemplate
                );

                if (strlen($message) > 146) {
                    $message = substr($message, 0, 145) . '...';
                }

                SendTenantNotification::dispatch($tenant, $message);
                $sent++;
            }

            $this->info("Late payment reminders sent to {$sent} tenants.");
        } catch (\Throwable $e) {
            Log::error('Late payment reminder failed: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            $this->fail();
        }
    }
}