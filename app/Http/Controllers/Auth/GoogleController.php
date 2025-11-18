<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Spatie\Permission\Models\Role;

class GoogleController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirectToGoogle()
    {
        \Log::info('Redirecting to Google OAuth');
        // Use stateless() if you have session issues
        return Socialite::driver('google')
            ->redirectUrl(config('services.google.redirect'))
            ->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')
                ->redirectUrl(config('services.google.redirect'))
                ->stateless()
                ->user();

            // Split full name into first and last
            $fullName = $googleUser->getName();
            $nameParts = explode(' ', $fullName, 2); // split into max 2 parts
            $firstName = $nameParts[0] ?? '';
            $lastName = $nameParts[1] ?? ''; // blank if no last name

            // Check if user exists
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // User exists - only update Google-specific fields, preserve existing name
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => $user->email_verified_at ?? now(),
                    // Don't update first_name and last_name if user already exists
                    // This preserves the names entered during registration
                ]);
                
                // Check if user is deactivated
                if ($user->status === 'inactive') {
                    return redirect()->route('login')->with('error', 'Your account has been deactivated. Please contact an administrator.');
                }
            } else {
                // New user - use Google name as fallback
                $user = User::create([
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $googleUser->getEmail(),
                    'password' => bcrypt(uniqid()),
                    'role' => 'employee',
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => now(),
                ]);

                // Assign Spatie role for new users
                Role::firstOrCreate(['name' => 'employee']);
                $user->assignRole('employee');
            }

            Auth::login($user, true);

            return redirect()->route('dashboard');

        } catch (\Exception $e) {
            \Log::error('Google OAuth Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            if (strpos($e->getMessage(), 'redirect_uri_mismatch') !== false) {
                return redirect()->route('login')->with('error', 'Google OAuth redirect URI is misconfigured.');
            }

            return redirect()->route('login')->with('error', 'Google login failed: ' . $e->getMessage());
        }
    }

    /**
     * Redirect to Google OAuth for linking account during registration
     */
    public function redirectToGoogleForLinking()
    {
        \Log::info('Redirecting to Google OAuth for account linking');
        return Socialite::driver('google')
            ->redirectUrl(config('services.google.redirect'))
            ->redirect();
    }

}
