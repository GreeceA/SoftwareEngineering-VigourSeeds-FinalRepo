<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
#google auth----------------
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
#----------------------------

use Illuminate\Http\Request;

class GoogleController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirectToGoogle()
    {
        \Log::info('Redirecting to Google OAuth for login/registration');
        return Socialite::driver('google')->redirect();
    }

    /**
     * Redirect to Google OAuth for account linking (when user is already logged in)
     */
    public function redirectToGoogleForLinking()
    {
        \Log::info('Redirecting to Google OAuth for account linking', ['user_id' => Auth::id()]);
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback()
    {
        try {
            \Log::info('Google OAuth callback initiated');
            
            // Use stateless for callback to avoid OAuth state issues
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            \Log::info('Google user data retrieved', [
                'google_id' => $googleUser->getId(),
                'email' => $googleUser->getEmail(),
                'name' => $googleUser->getName()
            ]);
            
            // Check if this is for account linking by checking if user is authenticated
            $isLinking = Auth::check();
            
            if ($isLinking) {
                \Log::info('User is already authenticated, linking Google account');
                
                // User is already logged in and wants to link Google account
                $user = Auth::user();
                
                // Check if this Google account is already linked to another user
                $existingGoogleUser = User::where('google_id', $googleUser->getId())->first();
                if ($existingGoogleUser && $existingGoogleUser->id !== $user->id) {
                    \Log::warning('Google account already linked to another user');
                    return redirect()->route('register.google-connect')->with('error', 'This Google account is already linked to another user.');
                }
                
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => $user->email_verified_at ?? now(),
                ]);
                
                \Log::info('Google account linked successfully', ['user_id' => $user->id]);
                return redirect()->route('dashboard')->with('success', 'Google account linked successfully!');
            }
            
            \Log::info('Processing regular login/registration flow');
            
            // Regular login/registration flow
            $user = User::where('email', $googleUser->getEmail())->first();
            
            if ($user) {
                \Log::info('Existing user found, updating Google info', ['user_id' => $user->id]);
                
                // User exists, update their Google info and ensure email is verified
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => $user->email_verified_at ?? now(),
                ]);
                
                Auth::login($user, true);
                \Log::info('Existing user logged in successfully', ['user_id' => $user->id]);
            } else {
                \Log::info('Creating new user from Google data');
                
                // Create new user with email already verified (since it's from Google)
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'email_verified_at' => now(), // Mark as verified since it's from Google
                    'password' => bcrypt(uniqid()), // Random password since they'll use Google
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                ]);
                
                if (!$user) {
                    \Log::error('Failed to create user from Google data');
                    return redirect()->route('login')->with('error', 'Failed to create account. Please try again.');
                }
                
                Auth::login($user, true);
                \Log::info('New user created and logged in successfully', ['user_id' => $user->id]);
            }

            // Ensure user is actually authenticated before redirecting
            if (!Auth::check()) {
                \Log::error('User authentication failed after Google OAuth');
                return redirect()->route('login')->with('error', 'Authentication failed. Please try again.');
            }

            // Redirect to dashboard after successful login
            \Log::info('Google OAuth successful, redirecting to dashboard', ['user_id' => $user->id]);
            return redirect()->route('dashboard');
            
        } catch (\Exception $e) {
            \Log::error('Google OAuth failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
            
            // Check if it's a redirect URI mismatch error
            if (strpos($e->getMessage(), 'redirect_uri_mismatch') !== false) {
                return redirect()->route('login')->with('error', 'Google OAuth configuration error. Please contact support.');
            }
            
            return redirect()->route('login')->with('error', 'Google authentication failed: ' . $e->getMessage());
        }
    }
}
