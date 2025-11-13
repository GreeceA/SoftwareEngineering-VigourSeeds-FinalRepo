<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = auth()->user();
        
        // Convert avatar to full URL - works with any APP_URL
        $avatarUrl = null;
        if ($user->avatar) {
            $avatarUrl = str_starts_with($user->avatar, 'http') 
                ? $user->avatar 
                : asset($user->avatar);
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $avatarUrl,
                'created_at' => $user->created_at,
                'email_verified_at' => $user->email_verified_at,
                'google_id' => $user->google_id,
                'can' => $user->getAllPermissions()->pluck('name')->toArray(),
            ],
            'auth' => [
                'user' => [
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'avatar' => $avatarUrl,
                    'created_at' => $user->created_at,
                    'email_verified_at' => $user->email_verified_at,
                    'google_id' => $user->google_id,
                    'can' => $user->getAllPermissions()->pluck('name')->toArray(),
                ]
            ]
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = auth()->user();

        // Delete old avatar if exists
        if ($user->avatar) {
            $oldAvatarPath = str_replace('/storage/', '', $user->avatar);
            $fullPath = storage_path('app/public/' . $oldAvatarPath);
            if (file_exists($fullPath)) {
                @unlink($fullPath);
            }
        }

        // Store new avatar
        $avatarPath = $request->file('avatar')->store('avatars', 'public');
        $user->avatar = '/storage/' . $avatarPath;
        $user->save();

        // Refresh the auth data to show new avatar immediately
        return redirect()->route('profile.edit')->with('status', 'Profile photo updated!');
    }
}