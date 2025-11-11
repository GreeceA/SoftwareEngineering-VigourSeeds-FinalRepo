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
        
        // Get the user from the auth array
        if (isset($shared['auth']['user']) && $shared['auth']['user']) {
            $user = $shared['auth']['user'];
            
            // Fix avatar URL
            if (isset($user['avatar']) && $user['avatar']) {
                $avatarPath = str_replace('/storage/', '', $user['avatar']);
                $avatarPath = ltrim($avatarPath, '/');
                $user['avatar'] = "http://localhost/dashboard/SoftwareEngineering-VigourSeeds-FinalRepo/public/storage/" . $avatarPath;
                
                $shared['auth']['user'] = $user;
            }
        }
        
        return $shared;
    }
}