<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\User;
use App\Models\NotificationLogs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Jobs\SendTenantNotification;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    public function index()
    {
        try {
            $settings = Setting::all()->pluck('value', 'key');
            $notificationsLog = NotificationLogs::latest()->paginate(30);
            $tenants = User::where('type', 'tenant')->select('id', 'name')->orderBy('name')->get();
    
            return Inertia::render('Settings/Index', ['settings' => $settings, 'notifications' => $notificationsLog, 'tenants'=> $tenants]);
        } catch (\Throwable $e) {
            Log::error('Failed to load settings: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to fetch settings.'], 500);
        }
    }


    public function updateAppSettings(Request $request)
    {
        $data = $request->validate([
            'app_name' => 'required|string',
            'app_url' => 'required|url',
            'support_email' => 'required|email',
            'currency' => 'required|string',
            'timezone' => 'required|string',
        ]);

        $this->saveSettings($data);
        return back()->with('success', 'App settings updated.');
    }

    public function updatePropertySettings(Request $request)
    {
        $data = $request->validate([
            'property_name' => 'required|string',
            'property_address' => 'required|string',
            'property_units' => 'required|integer',
            'bank_account' => 'required|string',
            'default_rent_due_day' => 'required|integer|min:1|max:31',
        ]);

        $this->saveSettings($data);
        return back()->with('success', 'Property settings updated.');
    }

    public function updateNotificationSettings(Request $request)
    {
        $data = $request->validate([
            'enable_auto_reconcile' => 'required|boolean',
            'enable_email_notifications' => 'required|boolean',
            'enable_sms_notifications' => 'required|boolean',
            'sms_due_reminder' => 'required|string',
            'sms_payment_thankyou' => 'required|string',
            'sms_partial_payment' => 'required|string',
            'sms_overdue_notice' => 'required|string',
            'sms_welcome_tenant' => 'required|string',
        ]);

        $this->saveSettings($data);
        return back()->with('success', 'Notification settings updated.');
    }

    public function updatePaymentSettings(Request $request)
    {
        $data = $request->validate([
            'mpesa.short_code' => 'required|string',
            'mpesa.passkey' => 'required|string',
            'mpesa.consumer_key' => 'required|string',
            'mpesa.consumer_secret' => 'required|string',
            'mpesa.base_url' => 'required|url',
            'mpesa.initiator' => 'required|string',
            'mpesa.security_credential' => 'required|string',
            'mpesa.timeout_url' => 'required|url',
            'mpesa.result_url' => 'required|url',
        ]);

        $this->saveSettings($data);
        return back()->with('success', 'Payment settings updated.');
    }

    private function saveSettings(array $settings)
    {
        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }

    public function sendBulkMessage(Request $request)
    {
        try {
            $request->validate([
                'user_ids' => 'required|array',
                'user_ids.*' => 'exists:users,id',
                'message' => 'required|string',
            ]);

            $users = User::whereIn('id', $request->user_ids)->get();

            foreach ($users as $user) {
                dispatch(new SendTenantNotification($user, $request->message));
            }

            return response()->json(['message' => 'Bulk message sent successfully.']);
        } catch (\Throwable $e) {
            Log::error('Failed to send bulk message: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to send bulk message.'], 500);
        }
    }

    public function uploadBulkData(Request $request)
    {
        //TODO: handle the differemnt of uploads like the units tenants users properties
        try {

            return response()->json(['message' => 'Bulk data uploaded successfully.']);
        } catch (\Throwable $e) {
            Log::error('Bulk upload failed: ' . $e->getMessage());
            return response()->json(['error' => 'Bulk upload failed.'], 500);
        }
    }
}
