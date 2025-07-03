<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\User;
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

            return Inertia::render('Settings/Index', ['settings' => $settings]);
        } catch (\Throwable $e) {
            Log::error('Failed to load settings: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to fetch settings.'], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            foreach ($request->all() as $key => $value) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }

            return redirect()->back()->with('success', 'Settings updated successfully.');
        } catch (\Throwable $e) {
            Log::error('Failed to update settings: ' . $e->getMessage());
            return response()->json(['error' => 'Unable to update settings.'], 500);
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
