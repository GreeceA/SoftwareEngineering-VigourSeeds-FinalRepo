<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PermissionController extends Controller implements HasMiddleware
{
    // Core permissions that cannot be deleted
    protected const PROTECTED_PERMISSIONS = [
        'view users', 'create users', 'edit users', 'deactivate users',
        'view roles', 'create roles', 'edit roles', 'delete roles',
        'view permissions', 'create permissions', 'edit permissions', 'delete permissions'
    ];

    public static function middleware(): array
    {
        return [
            new Middleware('permission:view permissions', only: ['index']),
            // Removed create, edit, delete middleware - permissions are now view-only
        ];
    }

    // This method will show permissions page (VIEW ONLY)
    public function index()
    {
        $permissions = Permission::orderBy('name')->paginate(10);

        return Inertia::render('Permissions/List', [
            'permissions' => $permissions,
            'viewOnly' => true, // Indicate this is view-only mode
        ]);
    }

    // CREATE, EDIT, DELETE methods removed - permissions are managed by developers only
    // Permissions are tied to code functionality and should not be modified through UI

}
