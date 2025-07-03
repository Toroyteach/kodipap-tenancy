<?php

namespace App\Http\Controllers;

use App\Jobs\SendTenantNotification;
use App\Models\User;
use App\Models\Setting;
use App\Models\NotificationLogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{
    /**
     * Send SMS using a message stored in settings (by type).
     */
    public function sendByType(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|string',
        ]);

        if (!Setting::where('key', 'enable_sms_notifications')->firstOrFail()) {
            return back()->withErrors(['sms_disabled' => 'SMS sending is disabled in settings.']);
        }

        $user = User::where('id', $data['user_id'])->where('type', 'tenant')->first();
        if (!$user) {
            return back()->withErrors(['not_found' => 'Tenant not found.']);
        }

        $template = Setting::value("sms_message_{$data['type']}");
        if (!$template) {
            return back()->withErrors(['invalid_type' => 'Message type not found in settings.']);
        }

        $message = $this->formatMessage($template, $user->name);

        try {
            SendTenantNotification::dispatch($user, $message);
            return back()->with('success', 'SMS queued successfully.');
        } catch (\Throwable $e) {
            Log::error('Failed to dispatch SMS: ' . $e->getMessage());
            return back()->withErrors(['dispatch_failed' => 'Failed to queue SMS.']);
        }
    }

    /**
     * Send SMS with a custom text message (max 144 characters).
     */
    public function sendByCustomMessage(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'message' => 'required|string|max:144',
        ]);

        if (!Setting::where('key', 'enable_sms_notifications')->firstOrFail()) {
            return back()->withErrors(['sms_disabled' => 'SMS sending is disabled in settings.']);
        }

        $user = User::where('id', $data['user_id'])->where('type', 'tenant')->first();
        if (!$user) {
            return back()->withErrors(['not_found' => 'Tenant not found.']);
        }

        try {
            SendTenantNotification::dispatch($user, $data['message']);
            return back()->with('success', 'Custom SMS queued successfully.');
        } catch (\Throwable $e) {
            Log::error('Failed to dispatch custom SMS: ' . $e->getMessage());
            return back()->withErrors(['dispatch_failed' => 'Failed to queue SMS.']);
        }
    }

    /**
     * Send bulk messages by type (from settings).
     */
    public function sendBulkByCustomMessage(Request $request)
    {
        $data = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'message' => 'required|string|max:144',
        ]);

        if (!Setting::where('key', 'enable_sms_notifications')->firstOrFail()) {
            return back()->withErrors(['sms_disabled' => 'SMS sending is disabled in settings.']);
        }

        $users = User::whereIn('id', $data['user_ids'])->where('type', 'tenant')->get();

        foreach ($users as $user) {
            $message = $this->formatMessage($data['message'], $user->name);

            try {
                SendTenantNotification::dispatch($user, $message);
            } catch (\Throwable $e) {
                Log::error("Failed to dispatch SMS to user {$user->id}: " . $e->getMessage());
            }
        }

        return back()->with('success', 'Bulk SMS queued.');
    }

    /**
     * Resend failed notification.
     */
    public function resend($id)
    {
        $log = NotificationLog::where('id', $id)->where('status', 'failed')->first();

        if (!$log) {
            return back()->withErrors(['not_found' => 'Failed notification not found.']);
        }

        $user = User::find($log->notifiable_id);
        if (!$user) {
            return back()->withErrors(['user_missing' => 'User not found.']);
        }

        try {
            SendTenantNotification::dispatch($user, $log->message);
            return back()->with('success', 'Notification requeued.');
        } catch (\Throwable $e) {
            Log::error("Failed to requeue notification log #{$id}: " . $e->getMessage());
            return back()->withErrors(['resend_failed' => 'Failed to requeue notification.']);
        }
    }

    /**
     * Format the message with the tenant's name.
     */
    protected function formatMessage(string $template, string $name): string
    {
        return str_replace('{name}', $name, $template);
    }
}