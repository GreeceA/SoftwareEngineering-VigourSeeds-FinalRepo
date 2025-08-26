<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;


class RoleController extends Controller
{
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

            return redirect()
                ->route('roles.index')
                ->with('success', 'Role created successfully.');
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

            return redirect()
                ->route('roles.index')
                ->with('success', 'Role updated successfully.');
        }

        public function destroy(Role $role)
        {
            try {
                $role->delete();
                return redirect()
                    ->route('roles.index')
                    ->with('success', 'Role deleted successfully.');
            } catch (\Exception $e) {
                return redirect()
                    ->route('roles.index')
                    ->with('error', 'Cannot delete this role.');
            }
        }

}
