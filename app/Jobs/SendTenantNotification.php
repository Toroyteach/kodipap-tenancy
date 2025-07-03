<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\User;
use App\Models\NotificationLog;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;
use Exception;

class SendTenantNotification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected User $user,
        protected string $message
    ) {}

    public function handle(): void
    {
        $channels = [];

        if (env('ENABLE_EMAIL_NOTIFICATIONS', true) && $this->user->email_notifications_enabled) {
            $channels[] = 'email';
        }

        if (env('ENABLE_SMS_NOTIFICATIONS', true) && $this->user->sms_notifications_enabled) {
            $channels[] = 'sms';
        }

        foreach ($channels as $channel) {
            try {
                match ($channel) {
                    'email' => $this->sendEmail(),
                    'sms' => $this->sendSms(),
                };

                NotificationLog::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => $this->user->id,
                    'channel' => $channel,
                    'message' => $this->message,
                    'status' => 'sent',
                    'sent_at' => now(),
                ]);

            } catch (Exception $e) {
                Log::error("Failed to send {$channel} to user {$this->user->id}: {$e->getMessage()}");

                NotificationLog::create([
                    'notifiable_type' => User::class,
                    'notifiable_id' => $this->user->id,
                    'channel' => $channel,
                    'message' => $this->message,
                    'status' => 'failed',
                    'sent_at' => now(),
                ]);

                throw $e; // triggers job retry
            }
        }
    }

    protected function sendEmail(): void
    {
        // basic Laravel mail sending
        \Mail::raw($this->message, fn($msg) => $msg
            ->to($this->user->email)
            ->subject('Notification'));
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
