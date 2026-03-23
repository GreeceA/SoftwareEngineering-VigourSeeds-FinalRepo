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
        $user = $request->user();

        // Convert avatar to full URL if it exists
        $avatarUrl = null;
        if ($user && $user->avatar) {
            $avatarUrl = str_starts_with($user->avatar, 'http') 
                ? $user->avatar 
                : asset($user->avatar);
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'avatar' => $avatarUrl,
                    // Load permissions and roles with the user
                    'can' => $user->getAllPermissions()->pluck('name')->toArray(),
                    'roles' => $user->getRoleNames()->toArray(),
                ] : null,
            ],
            'notifications' => $user ? $user->unreadNotifications()
                ->latest()
                ->take(5)
                ->get() : [],
        ];
    }
}