<?php

namespace App\Services;

use App\Models\Lease;
use App\Models\Payment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;
use Exception;

class MpesaPaymentService
{
    protected string $consumerKey;
    protected string $consumerSecret;
    protected string $shortCode;
    protected string $passkey;
    protected string $baseUrl;

    public function __construct()
    {
        $this->consumerKey    = settings('mpesa.consumer_key');
        $this->consumerSecret = settings('mpesa.consumer_secret');
        $this->shortCode      = settings('mpesa.short_code');
        $this->passkey        = settings('mpesa.passkey');
        $this->baseUrl        = settings('mpesa.base_url');
    }

    public function generateAccessToken(): ?string
    {
        try {
            $res = Http::withBasicAuth($this->consumerKey, $this->consumerSecret)
                ->get("{$this->baseUrl}/oauth/v1/generate?grant_type=client_credentials");
            return $res->json()['access_token'] ?? null;
        } catch (\Throwable $e) {
            Log::error('MPESA TOKEN ERROR: ' . $e->getMessage());
            return null;
        }
    }

    public function handleIncomingPayment(array $data): void
    {
        try {
            $trx = $data['TransID'] ?? null;
            $phone = $data['MSISDN'] ?? null;
            $amount = $data['TransAmount'] ?? 0;
    
            if (!$trx || !$phone || !$amount) {
                throw new Exception('Incomplete MPESA data');
            }
    
            $lease = Lease::with(['tenant.user', 'unit.property'])
                ->whereHas('rentalTenant.user', fn($q) => $q->where('phone', $phone))
                ->first();
    
            if (!$lease) throw new Exception("No lease for phone: {$phone}");
    
            if (Payment::where('transaction_id', $trx)->exists()) return;
    
            Payment::create([
                'lease_id' => $lease->id,
                'amount' => $amount,
                'transaction_id' => $trx,
                'status' => 'paid',
                'paid_at' => now(),
                'method' => 'mpesa',
            ]);
    
            // Apply the payment and update lease details
            $lease->applyPayment($amount);
    
            // Notify user
            $user = $lease->tenant;
    
            if ($user) {
                if ($amount >= $lease->monthly_rent) {
                    $template = settings('sms_payment_thankyou') ?? 'Hello :name, we have received your rent payment of :amount. Thank you!';
                    $message = str_replace(
                        [':name', ':amount'],
                        [$user->name, number_format($amount, 2)],
                        $template
                    );
                } else {
                    $deficit = number_format($lease->monthly_rent - $amount, 2);
                    $template = settings('sms_partial_payment') ?? 'Hi :name, you have made a partial payment of :amount. Remaining balance is :balance.';
                    $message = str_replace(
                        [':name', ':amount', ':balance'],
                        [$user->name, number_format($amount, 2), $deficit],
                        $template
                    );
                }
    
                if (strlen($message) > 146) {
                    $message = substr($message, 0, 145) . '...';
                }
    
                SendTenantNotification::dispatch($user, $message);
            }
        } catch (\Throwable $e) {
            Log::error("MPESA CALLBACK ERROR: " . $e->getMessage());
        }
    }

    public function initiateReversal(string $transactionId, string $reason = 'Tenant request'): void
    {
        try {
            $token = $this->generateAccessToken();
            if (!$token) throw new Exception('Token generation failed');

            Http::withToken($token)->post("{$this->baseUrl}/mpesa/reversal/v1/request", [
                'Initiator' => config('services.mpesa.initiator'),
                'SecurityCredential' => config('services.mpesa.security_credential'),
                'CommandID' => 'TransactionReversal',
                'TransactionID' => $transactionId,
                'Amount' => 100, // This should be actual payment amount
                'ReceiverParty' => $this->shortCode,
                'RecieverIdentifierType' => 11,
                'Remarks' => $reason,
                'QueueTimeOutURL' => route('mpesa.timeout'),
                'ResultURL' => route('mpesa.reversal.result'),
                'Occasion' => 'Reversal',
            ]);
        } catch (\Throwable $e) {
            Log::error("MPESA REVERSAL ERROR: {$e->getMessage()}");
        }
    }

    public function syncPayments(): void
    {
        try {
            $token = $this->generateAccessToken();
            if (!$token) throw new Exception('Token generation failed');

            // Example logic, actual endpoint and tracking method may differ
            $response = Http::withToken($token)->post("{$this->baseUrl}/mpesa/transactionstatus/v1/query", [
                'Initiator' => config('services.mpesa.initiator'),
                'SecurityCredential' => config('services.mpesa.security_credential'),
                'CommandID' => 'TransactionStatusQuery',
                'TransactionID' => 'ABC123XYZ', // loop through expected trx if needed
                'PartyA' => $this->shortCode,
                'IdentifierType' => 4,
                'Remarks' => 'Query missing transactions',
                'QueueTimeOutURL' => route('mpesa.timeout'),
                'ResultURL' => route('mpesa.sync.result'),
                'Occasion' => 'Sync',
            ]);
        } catch (\Throwable $e) {
            Log::error("MPESA SYNC ERROR: {$e->getMessage()}");
        }
    }
}