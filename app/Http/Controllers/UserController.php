<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', DB::raw("CONCAT(first_name, ' ', last_name) as name"), 'email', 'role', 'status', 'created_at')
            ->get();

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
            'first_name' => ['required', 'string', 'max:255'],
            'last_name'  => ['required', 'string', 'max:255'],
            'role'       => ['required', 'in:Employee,Manager'],
            'email'      => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'   => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'role'       => $request->role,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function roles()
    {
        return Inertia::render('Users/Roles');
    }

    public function permissions()
    {
        return Inertia::render('Users/Permissions');
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