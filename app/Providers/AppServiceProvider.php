<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\Setting;
use Inertia\Inertia;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Inertia::share('app_settings', function () {
            if (tenancy()->initialized && tenancy()->tenant) {
                return Setting::whereIn('key', ['app_name'])->pluck('value', 'key');
            }
            return null;
        });
    }
}
