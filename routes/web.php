<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



// Google OAuth Routes

Route::get('/auth/google', [GoogleController::class, 'redirectToGoogle'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback'])->name('google.callback');
Route::get('/auth/google/link', [GoogleController::class, 'redirectToGoogleForLinking'])->name('google.link')->middleware('auth');

// Registration Google Connect Routes (no auth required during registration)
Route::get('/register/google-connect', [App\Http\Controllers\Auth\RegisteredUserController::class, 'showGoogleConnect'])
    ->name('register.google-connect');
Route::post('/register/skip-google', [App\Http\Controllers\Auth\RegisteredUserController::class, 'skipGoogleConnect'])
    ->name('register.skip-google');
Route::get('/register/google', [GoogleController::class, 'redirectToGoogle'])->name('register.google.redirect');

require __DIR__.'/auth.php';

//User Management Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::get('/users/roles', [UserController::class, 'roles'])->name('users.roles');
    Route::get('/users/permissions', [UserController::class, 'permissions'])->name('users.permissions');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
});


Route::post('/users/{user}/deactivate', [UserController::class, 'deactivate'])->name('users.deactivate');
Route::post('/users/{user}/activate', [UserController::class, 'activate'])->name('users.activate');