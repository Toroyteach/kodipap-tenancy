<?php

namespace Database\Seeders\Tenant;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'app_name', 'value' => 'KODIPAP Rental Manager'],
            ['key' => 'app_url', 'value' => 'https://app.kodipap.com'],
            ['key' => 'property_name', 'value' => 'Greenview Apartments'],
            ['key' => 'property_address', 'value' => '123 Moi Avenue, Nairobi'],
            ['key' => 'property_units', 'value' => '24'],
            ['key' => 'bank_account', 'value' => '011xxxxxxxxx'],
            ['key' => 'enable_auto_reconcile', 'value' => 'true'],
            ['key' => 'enable_email_notifications', 'value' => 'true'],
            ['key' => 'enable_sms_notifications', 'value' => 'true'],
            ['key' => 'sms_api_url', 'value' => 'https://smsservice.com/'],
            ['key' => 'sms_api_key', 'value' => 'your-sms-api-key'],
            ['key' => 'email_from_address', 'value' => 'noreply@kodipap.com'],
            ['key' => 'support_email', 'value' => 'support@kodipap.com'],
            ['key' => 'currency', 'value' => 'KES'],
            ['key' => 'timezone', 'value' => 'Africa/Nairobi'],
            ['key' => 'default_rent_due_day', 'value' => '5'],
            ['key' => 'sms_due_reminder', 'value' => 'Dear :name, your rent of :amount is due on :date. Kindly make payment'],
            ['key' => 'sms_payment_thankyou', 'value' => 'Hello :name, we have received your rent payment of :amount. Thank you!'],
            ['key' => 'sms_partial_payment', 'value' => 'Hello :name, you have made a partial payment of'],
            ['key' => 'sms_overdue_notice', 'value' => 'Hello :name, Your rent is overdue. Please clear your balance'],
            ['key' => 'sms_welcome_tenant', 'value' => 'Welcome :name! Your lease at :unit starts on :date. Thank you for choosing us.'],
            ['key' => 'mpesa.consumer_key', 'value' => 'your-consumer-key'],
            ['key' => 'mpesa.consumer_secret', 'value' => 'your-consumer-secret'],
            ['key' => 'mpesa.short_code', 'value' => '123456'],
            ['key' => 'mpesa.passkey', 'value' => 'your-passkey'],
            ['key' => 'mpesa.base_url', 'value' => 'https://sandbox.safaricom.co.ke'],
            ['key' => 'mpesa.initiator', 'value' => 'your-initiator-name'],
            ['key' => 'mpesa.security_credential', 'value' => 'your-encoded-security-credential'],
            ['key' => 'mpesa.timeout_url', 'value' => 'https://yourapp.com/api/mpesa/timeout'],
            ['key' => 'mpesa.result_url', 'value' => 'https://yourapp.com/api/mpesa/result'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], ['value' => $setting['value']]);
        }
    }
}
