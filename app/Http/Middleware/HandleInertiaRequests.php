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