<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Validator;

class PermissionController extends Controller
{
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
            return redirect()->route('permissions.index')->with('success', 'Permission added successfully.');
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
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $id,
        ]);

        $permission = Permission::findOrFail($id);

        try {
            $permission->update([
                'name' => $request->name,
            ]);

            return redirect()
                ->route('permissions.index')
                ->with('success', 'Permission updated successfully.');
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
            $permission->delete();

            return redirect()
                ->route('permissions.index')
                ->with('success', 'Permission deleted successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->route('permissions.index')
                ->with('error', 'Failed to delete permission. Please try again.');
        }
    }
}
