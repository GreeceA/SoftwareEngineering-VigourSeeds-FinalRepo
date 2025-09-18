<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RefreshPermissions
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Force refresh permissions cache for authenticated users
        if ($request->user()) {
            // Clear the cached permissions to ensure fresh data
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
            
            // Reload the user's permissions from database
            $request->user()->load('permissions', 'roles.permissions');
        }

        return $next($request);
    }
}
