<?php
namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        \Illuminate\Database\Eloquent\Relations\Relation::morphMap([
            'seed' => \App\Models\Seed::class,
            'Seed' => \App\Models\Seed::class,  // Support legacy capitalized version
            'item' => \App\Models\Item::class,
            'Item' => \App\Models\Item::class,  // Support legacy capitalized version
            'corn_product' => \App\Models\CornProduct::class,
            'App\Models\CornProduct' => \App\Models\CornProduct::class,  // Support fully qualified version
        ]);

        Inertia::share('auth', function () {
            $user = Auth::user();
            
            if (!$user) {
                return ['user' => null];
            }

            $userData = $user->toArray();
            
            // Convert avatar path to full URL - works with any APP_URL
            if (isset($userData['avatar']) && $userData['avatar']) {
                // If it's already a full URL, keep it; otherwise use asset helper
                if (!str_starts_with($userData['avatar'], 'http')) {
                    $userData['avatar'] = asset($userData['avatar']);
                }
            }
            
            $userData['can'] = $user->getAllPermissions()->pluck('name')->toArray();
            
            return ['user' => $userData];
        });
    }
}