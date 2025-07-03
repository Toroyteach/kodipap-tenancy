<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Setting;
use App\Models\NotificationLogs;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Exception;

class SendTenantNotification implements ShouldQueue
{
    use Queueable, Dispatchable;

    public function __construct(
        protected User $user,
        protected string $message
    ) {}

    public function handle(): void
    {
        try {
            if (!Setting::where('key', 'enable_sms_notifications')->firstOrFail()) {
                return ;
            }

            $this->sendSms();

            NotificationLogs::create([
                'notifiable_type' => User::class,
                'notifiable_id' => $this->user->id,
                'channel' => 'sms',
                'message' => $this->message,
                'status' => 'sent',
                'sent_at' => now(),
            ]);
        } catch (Exception $e) {
            Log::error("Failed to send SMS to user {$this->user->id}: {$e->getMessage()}");

            NotificationLogs::create([
                'notifiable_type' => User::class,
                'notifiable_id' => $this->user->id,
                'channel' => 'sms',
                'message' => $this->message,
                'status' => 'failed',
                'sent_at' => now(),
            ]);

            throw $e;
        }
    }

    protected function sendSms(): void
    {
        if (empty($this->user->phone)) {
            throw new \Exception('User has no phone number.');
        }

        $response = \Http::post('https://smsservice.com/', [
            'phone' => $this->user->phone,
            'message' => $this->message,
        ]);

        if (!$response->ok()) {
            Log::error("SMS failed to {$this->user->phone}: {$response->body()}");
            throw new \Exception("Failed to send SMS. Response: " . $response->status());
        }

        Log::info("SMS successfully sent to {$this->user->phone}");
    }
}