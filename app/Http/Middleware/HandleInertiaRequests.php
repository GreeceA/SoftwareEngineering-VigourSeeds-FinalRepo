<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $shared = parent::share($request);
        
        // Get the authenticated user model (not the array)
        $user = $request->user();
        
        // If user is authenticated, add notifications
        if ($user) {
            // Fix avatar URL in the shared auth array
            if (isset($shared['auth']['user']['avatar']) && $shared['auth']['user']['avatar']) {
                $avatarPath = str_replace('/storage/', '', $shared['auth']['user']['avatar']);
                $avatarPath = ltrim($avatarPath, '/');
                $shared['auth']['user']['avatar'] = "http://localhost/dashboard/SoftwareEngineering-VigourSeeds-FinalRepo/public/storage/" . $avatarPath;
            }
            
            // Add notifications (use the actual User model, not the array)
            $shared['notifications'] = $user->unreadNotifications()
                ->latest()
                ->take(5)
                ->get();
        } else {
            $shared['notifications'] = [];
        }
        
        return $shared;
    }
}