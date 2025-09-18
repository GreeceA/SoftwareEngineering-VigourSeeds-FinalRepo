<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;


class RoleController extends Controller implements HasMiddleware
{
    // Core roles that cannot be deleted
    protected const PROTECTED_ROLES = ['admin', 'manager', 'employee'];

    public static function middleware(): array
    {
        return [
            new Middleware('permission:view roles', only: ['index']),
            new Middleware('permission:edit roles', only: ['edit']),
            new Middleware('permission:create roles', only: ['create']),
            new Middleware('permission:delete roles', only: ['destroy']),
        ];
    }

    public function index() 
        {
            $roles = Role::with('permissions')->orderBy('created_at', 'desc')->paginate(10);
            return Inertia::render('Roles/List', [
                'roles' => $roles,
                'flash' => session()->get('flash', [])
            ]);
        }

        public function create()
        {
            $permissions = Permission::orderBy('name','ASC')->get();
            return Inertia::render('Roles/Create', [
                'permissions' => $permissions
            ]);
        }

        public function store(Request $request)
        {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:roles,name',
                'permissions' => 'array'
            ]);

            $role = Role::create(['name' => $validated['name']]);

            if($request->has('permissions')) {
                $role->syncPermissions($request->permissions);
            }

            // Clear the permission cache to ensure fresh permissions are loaded
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

            return redirect()
                ->route('roles.index')
                ->with('success', 'Role created successfully.')
                ->with('refresh_permissions', true);
        }

        public function edit(Role $role)
        {
            return Inertia::render('Roles/Edit', [
                'role' => $role->load('permissions'),
                'permissions' => Permission::orderBy('name', 'ASC')->get()
            ]);
        }

        public function update(Request $request, Role $role)
        {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
                'permissions' => 'array'
            ]);

            $role->update(['name' => $validated['name']]);
            
            if($request->has('permissions')) {
                $role->syncPermissions($request->permissions);
            }

            // Clear the permission cache to ensure fresh permissions are loaded
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

            return redirect()
                ->route('roles.index')
                ->with('success', 'Role updated successfully.')
                ->with('refresh_permissions', true);
        }

        public function destroy(Role $role)
        {
            try {
                // Prevent deletion of protected roles
                if (in_array($role->name, self::PROTECTED_ROLES)) {
                    return redirect()
                        ->route('roles.index')
                        ->with('error', 'Cannot delete core system role: ' . $role->name);
                }
                
                $role->delete();

                // Clear the permission cache to ensure fresh permissions are loaded
                app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

                return redirect()
                    ->route('roles.index')
                    ->with('success', 'Role deleted successfully.')
                    ->with('refresh_permissions', true);
            } catch (\Exception $e) {
                return redirect()
                    ->route('roles.index')
                    ->with('error', 'Cannot delete this role.');
            }
        }

}
