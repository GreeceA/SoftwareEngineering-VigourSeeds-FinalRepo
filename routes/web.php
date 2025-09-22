<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


// Controllers
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\PartnerController;

// -----------------
// Public Routes
// -----------------
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// -----------------
// Authenticated Routes
// -----------------
Route::middleware(['auth'])->group(function () {
    // Dashboard
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))
        ->name('dashboard');

    // Profile
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

    // Permissions (VIEW ONLY - create/edit/delete managed by developers)
    Route::get('permissions', [PermissionController::class, 'index'])->name('permissions.index');

    // Roles
    Route::resource('roles', RoleController::class)->except(['show']);

    // Users
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('/create', [UserController::class, 'create'])->name('create');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('edit');
        Route::put('/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');

        // Roles & Permissions
        Route::get('/roles', [UserController::class, 'roles'])->name('roles');
        Route::get('/permissions', [UserController::class, 'permissions'])->name('permissions');

        // Activation
        Route::post('/{user}/deactivate', [UserController::class, 'deactivate'])->name('deactivate');
        Route::post('/{user}/reactivate', [UserController::class, 'reactivate'])->name('reactivate');
    });

    // Partners
    Route::resource('partners', PartnerController::class)->except(['show']);
    
});

// -----------------
// Google OAuth Routes
// -----------------
Route::prefix('auth/google')->name('google.')->group(function () {
    Route::get('/', [GoogleController::class, 'redirectToGoogle'])->name('redirect');
    Route::get('/callback', [GoogleController::class, 'handleGoogleCallback'])->name('callback');
    Route::get('/link', [GoogleController::class, 'redirectToGoogleForLinking'])
        ->middleware('auth')
        ->name('link');
});

// -----------------
// Registration + Google Connect (No Auth Required)
// -----------------
Route::prefix('register')->name('register.')->group(function () {
    Route::get('/google-connect', [App\Http\Controllers\Auth\RegisteredUserController::class, 'showGoogleConnect'])
        ->name('google-connect');
    Route::post('/skip-google', [App\Http\Controllers\Auth\RegisteredUserController::class, 'skipGoogleConnect'])
        ->name('skip-google');
    Route::get('/google', [GoogleController::class, 'redirectToGoogle'])
        ->name('google.redirect');
});

// -----------------
// Auth Routes (Breeze/Fortify/etc.)
// -----------------
require __DIR__.'/auth.php';
