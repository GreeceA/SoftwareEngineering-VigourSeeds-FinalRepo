<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

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
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => $user->email_verified_at ?? now(),
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                ]);
            } else {
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

}
