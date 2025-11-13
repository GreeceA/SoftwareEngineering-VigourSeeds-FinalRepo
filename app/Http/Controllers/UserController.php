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
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use App\Exports\UsersExport;
use Barryvdh\DomPDF\Facade\Pdf;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view users', only: ['index']),
            new Middleware('permission:edit users', only: ['edit']),
            new Middleware('permission:create users', only: ['create']),
            new Middleware('permission:deactivate users', only: ['destroy', 'deactivate', 'reactivate']),
        ];
    }
   
    public function index(Request $request)
    {
        $sortBy = $request->input('sort_by', 'id');
        $sortDir = $request->input('sort_dir', 'desc');
        $perPage = $request->input('per_page', 10);
        $status = $request->input('status', '');
        $search = $request->input('search', '');

        $query = User::with('roles')
            ->select('id', DB::raw("CONCAT(first_name, ' ', last_name) as name"), 'email', 'role', 'status', 'created_at', 'avatar')
            ->withCount('fieldVisits');

        // Search functionality
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where(DB::raw("CONCAT(first_name, ' ', last_name)"), 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($status && in_array($status, ['active', 'inactive'])) {
            $query->where('status', $status);
        }

        // Only allow sorting by allowed columns
        if (in_array($sortBy, ['name', 'email', 'role', 'status', 'created_at'])) {
            $query->orderBy($sortBy, $sortDir);
        } else {
            $query->orderBy('id', 'desc');
        }

        $users = $query->paginate($perPage)->withQueryString();

        $users->getCollection()->transform(function ($user) {
            if ($user->avatar) {
                // If it's already a full URL, keep it; otherwise convert to full URL
                if (!str_starts_with($user->avatar, 'http')) {
                    $user->avatar = asset($user->avatar);
                }
            }
            return $user;
        });

        // Only prepend "me" on the first page
        if ($users->currentPage() === 1) {
            $currentUser = $request->user();
            if (!$users->getCollection()->contains(function ($user) use ($currentUser) {
                return (string)$user->id === (string)$currentUser->id;
            })) {
                $me = User::with('roles')
                    ->select('id', DB::raw("CONCAT(first_name, ' ', last_name) as name"), 'email', 'role', 'status', 'created_at', 'avatar')
                    ->find($currentUser->id);

                if ($me) {
                    if ($me->avatar && !str_starts_with($me->avatar, 'http')) {
                        $me->avatar = asset($me->avatar);
                    }
                    $users->getCollection()->prepend($me);
                }
            }
        }

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only(['sort_by', 'sort_dir', 'per_page']),
        ]);
    }

    public function create()
    {
        $roles = Role::all();
        return Inertia::render('Users/Create', [
            'roles' => $roles->map(fn($role) => ['id' => $role->id, 'name' => $role->name])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => ['required', 'string', 'max:50', 'regex:/^[A-Za-z\s\'\-]+$/'],
            'last_name'  => ['required', 'string', 'max:50', 'regex:/^[A-Za-z\s\'\-]+$/'],
            'roles'      => ['required', 'array'],
            'roles.*'    => ['exists:roles,name'],
            'email'      => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'   => ['required', 'confirmed', Rules\Password::defaults()],
            'avatar'     => ['nullable', 'image', 'max:2048'],
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'status'     => 'active',
        ]);

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = '/storage/' . $avatarPath;
        }

        $user->save();
        
        // Assign roles using Spatie
        $user->syncRoles($request->roles);

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
            'roles' => $roles->map(fn($role) => ['id' => $role->id, 'name' => $role->name]),
            'userRoles' => $user->roles->map(fn($role) => ['id' => $role->id, 'name' => $role->name])
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
            'roles'      => ['required', 'array'],
            'roles.*'    => ['exists:roles,id'],
        ]);

        try {
            $user->update([
                'first_name' => $request->first_name,
                'last_name'  => $request->last_name,
            ]);
            // Sync roles
            $user->syncRoles($request->roles);

            // Clear the permission cache to ensure fresh permissions are loaded
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

            return redirect()->route('users.index')
                ->with('success', 'User updated successfully')
                ->with('refresh_permissions', true);
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
    
    public function export(Request $request)
    {
        $format = $request->query('format', 'csv');
        
        if ($format === 'pdf') {
            // Get all users with roles
            $users = User::with('roles')
                ->select('id', 'first_name', 'last_name', 'email', 'status', 'created_at')
                ->orderBy('id', 'asc')
                ->get();
            
            // Generate PDF
            $pdf = Pdf::loadView('exports.users_pdf', compact('users'));
            
            // Download PDF
            return $pdf->download('VigourSeed_UserInfoList_' . now()->format('Y-m-d') . '.pdf');
        }
    }

}