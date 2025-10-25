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
        'view permissions',
        'view partners', 'create partners', 'edit partners', 'archive partners',
        'view seeds', 'create seeds', 'edit seeds', 'archive seeds',
        'view items', 'create items', 'edit items', 'archive items',
    ];

    public static function middleware(): array
    {
        return [
            new Middleware('permission:view permissions', only: ['index']),
            new Middleware('permission:create permissions', only: ['create']),
            new Middleware('permission:edit permissions', only: ['edit']),
            new Middleware('permission:delete permissions', only: ['destroy']),
        ];
    }

    // This method will show permissions page
    public function index()
    {
        $permissions = Permission::orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Permissions/List', [
            'permissions' => $permissions,
        ]);
    }

    // This method will show create persmission page
    public function create()
    {
        return Inertia::render('Permissions/Create');
    }

    // This method will insert a permission in DB
    public function store(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:permissions,name',
        ]);
     
        if($validator->passes()) {
            Permission::create(['name' => $request->name]);
            
            // Clear the permission cache to ensure fresh permissions are loaded
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
            
            return redirect()->route('permissions.index')
                ->with('success', 'Permission added successfully.')
                ->with('refresh_permissions', true);
        } else {
            return redirect()->route('permissions.create')->withInput()->withErrors($validator);
        }
    }

    // This method will edit a permission in DB
    public function edit($id)
    {
        $permission = Permission::findOrFail($id);
        return Inertia::render('Permissions/Edit', [
            'permission' => $permission,
        ]);
    }

    // This method will update a permission in DB
    public function update(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);
        
        // Prevent editing of protected permissions
        if (in_array($permission->name, self::PROTECTED_PERMISSIONS)) {
            return redirect()
                ->route('permissions.index')
                ->with('error', 'Cannot edit core system permission: ' . $permission->name);
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $id,
        ]);

        try {
            $permission->update([
                'name' => $request->name,
            ]);

            // Clear the permission cache to ensure fresh permissions are loaded
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

            return redirect()
                ->route('permissions.index')
                ->with('success', 'Permission updated successfully.')
                ->with('refresh_permissions', true);
        } catch (\Exception $e) {
            return redirect()
                ->route('permissions.index')
                ->with('error', 'Failed to update permission. Please try again.');
        }
    }

    // This method will delete a permission in DB
    public function destroy($id)
    {
        try {
            $permission = Permission::findOrFail($id);
            
            // Prevent deletion of protected permissions
            if (in_array($permission->name, self::PROTECTED_PERMISSIONS)) {
                return redirect()
                    ->route('permissions.index')
                    ->with('error', 'Cannot delete core system permission: ' . $permission->name);
            }
            
            $permission->delete();

            // Clear the permission cache to ensure fresh permissions are loaded
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

            return redirect()
                ->route('permissions.index')
                ->with('success', 'Permission deleted successfully.')
                ->with('refresh_permissions', true);
        } catch (\Exception $e) {
            return redirect()
                ->route('permissions.index')
                ->with('error', 'Failed to delete permission. Please try again.');
        }
    }
}
