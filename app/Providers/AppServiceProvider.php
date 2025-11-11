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
            'item' => \App\Models\Item::class,
        ]);

        Inertia::share('auth', function () {
            $user = Auth::user();
            
            if (!$user) {
                return ['user' => null];
            }

            $userData = $user->toArray();
            
            if (isset($userData['avatar']) && $userData['avatar']) {
                $avatarPath = str_replace('/storage/', '', $userData['avatar']);
                $avatarPath = ltrim($avatarPath, '/');
                $userData['avatar'] = "http://localhost/dashboard/SoftwareEngineering-VigourSeeds-FinalRepo/public/storage/" . $avatarPath;
            }
            
            $userData['can'] = $user->getAllPermissions()->pluck('name')->toArray();
            
            return ['user' => $userData];
        });
    }
}