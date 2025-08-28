<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles')
            ->select('id', DB::raw("CONCAT(first_name, ' ', last_name) as name"), 'email', 'role', 'status', 'created_at', 'avatar')
            ->latest()
            ->paginate(10);
            
        $users->getCollection()->transform(function ($user) {
        if ($user->avatar) {
            if (filter_var($user->avatar, FILTER_VALIDATE_URL)) {
                // Keep external URL as-is
                $user->avatar = $user->avatar;
            } else {
                // Local file
                $user->avatar = asset('storage/' . $user->avatar);
            }
        }
    return $user;
});


        return Inertia::render('Users/Index', [
            'users' => $users
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => ['required', 'string', 'max:50', 'regex:/^[A-Za-z\s\'\-]+$/'],
            'last_name'  => ['required', 'string', 'max:50', 'regex:/^[A-Za-z\s\'\-]+$/'],
            'role'       => ['required', 'in:Employee,Manager'],
            'email'      => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'   => ['required', 'confirmed', Rules\Password::defaults()],
            'avatar'     => ['nullable', 'image', 'max:2048'],
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'role'       => $request->role,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
        ]);

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $avatarPath;
        }

        $user->save();
        $user->assignRole($request->role);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        // Prevent editing deactivated accounts
        if ($user->status === 'inactive') {
            return redirect()->route('users.index')->with('error', 'Cannot edit deactivated accounts');
        }

        $roles = Role::all();

        return Inertia::render('Users/Edit', [
            'user' => $user->only(['id', 'first_name', 'last_name', 'email', 'role', 'status', 'created_at']),
            'roles' => $roles,
            'userRoles' => $user->roles->pluck('name')
        ]);
    }


    public function update(Request $request, User $user)
    {
        // Check if user is trying to update a deactivated account
        if ($user->status === 'inactive') {
            return back()->with('error', 'Cannot edit deactivated accounts');
        }

        $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name'  => ['required', 'string', 'max:255'],
            'role'       => ['required', 'in:Employee,Manager'],
        ]);

        try {
            $user->update([
                'first_name' => $request->first_name,
                'last_name'  => $request->last_name,
                'role'       => $request->role,
            ]);

            return back()->with('success', 'User updated successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update user');
        }
    }

    public function roles()
    {
        return Inertia::render('Users/Roles');
    }

    public function permissions()
    {
        return Inertia::render('Users/Permissions');
    }

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, string $id)
    // {
    //     $user = User::findOrFail($id);
        
    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'email' => 'required|email|unique:users,email,' . $user->id,
    //         'roles' => 'array'
    //     ]);

    //     $user->update([
    //         'name' => $validated['name'],
    //         'email' => $validated['email']
    //     ]);

    //     if($request->has('roles')) {
    //         $user->syncRoles($request->roles);
    //     }
        
    //     return redirect()
    //         ->route('users.index')
    //         ->with('success', 'User updated successfully.');
    // }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try {
            $user->delete();
            return redirect()
                ->route('users.index')
                ->with('success', 'User deleted successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->route('users.index')
                ->with('error', 'Failed to delete user.');
        }
    }

    public function deactivate(User $user)
    {
        try {
            // Check if user is trying to deactivate their own account
            if (Auth::id() === $user->id) {
                return back()->with('error', 'You cannot deactivate your own account');
            }

            // Set user status to inactive
            $user->status = 'inactive';
            $user->save();

            // Return back with success message
            return back()->with('success', 'User deactivated successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to deactivate user');
        }
    }

    public function reactivate(User $user)
    {
        try {
            // Check if user is trying to reactivate their own account
            if (Auth::id() === $user->id) {
                return back()->with('error', 'You cannot reactivate your own account');
            }

            // Set user status to active
            $user->status = 'active';
            $user->save();

            // Return back with success message
            return back()->with('success', 'User reactivated successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to reactivate user');
        }
    }

    public function activate(User $user)
    {
        try {
            $user->status = 'active';
            $user->save();

            return back()->with('success', 'User activated successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to activate user');
        }
    }
}