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
use App\Http\Controllers\ContractController;
use App\Http\Controllers\SeedController;
use App\Http\Controllers\ItemController;




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

    // Permissions
    Route::resource('permissions', PermissionController::class)->except(['show']);

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
    Route::post('partners/{partner}/deactivate', [PartnerController::class, 'deactivate'])->name('partners.deactivate');
    Route::post('partners/{partner}/reactivate', [PartnerController::class, 'reactivate'])->name('partners.reactivate');
    Route::get('partners/{partner}', [PartnerController::class, 'show'])->name('partners.show');
        // Validation routes - Partner fields
        Route::post('/check/partner/name', [PartnerController::class, 'checkName'])->name('partners.checkName');
        Route::post('/check/partner/email', [PartnerController::class, 'checkEmail'])->name('partners.checkEmail');
        Route::post('/check/partner/registration', [PartnerController::class, 'checkRegistrationNumber'])->name('partners.checkRegistration');
        Route::post('/check/partner/taxid', [PartnerController::class, 'checkTaxId'])->name('partners.checkTaxId');

    // Contracts
    Route::resource('contracts', ContractController::class);
    Route::post('contracts/{contract}/change-status', [ContractController::class, 'changeStatus'])
        ->name('contracts.change-status');
    Route::get('partners/search', [ContractController::class, 'searchPartners'])
        ->name('partners.search');
    Route::post('/contracts/{contract}/cancel', [ContractController::class, 'destroy'])->name('contracts.cancel');
    Route::get('/contracts/preview-pdf/{filename}', [ContractController::class, 'previewDocxAsPdf']);
        // Download routes - Contract files
            Route::get('/contracts/download-pdf/{filename}', [ContractController::class, 'downloadAsPdf']);
            Route::get('/contracts/download-docx/{filename}', [ContractController::class, 'downloadAsDocx']);
    Route::post('/contracts/{contract}/send-email', [ContractController::class, 'sendEmail'])->name('contracts.sendEmail');
    Route::get('/partner-portal/contracts/{id}', [ContractController::class, 'showPartner'])->name('partner.contracts.show');
    Route::post('/partner-portal/contracts/{id}/verify', [ContractController::class, 'verifyPartner'])->name('partner.contracts.verify');
    
    // Seeds
    Route::resource('seeds', SeedController::class);
    Route::patch('seeds/{seed}/archive', [SeedController::class, 'archive'])->name('seeds.archive');
    Route::patch('seeds/{seed}/restore', [SeedController::class, 'restore'])->name('seeds.restore');
    Route::delete('seeds/{seed}', [SeedController::class, 'destroy'])->name('seeds.destroy');
    Route::get('/seeds/{seed}', [SeedController::class, 'show'])->name('seeds.show');
        // Validation routes - Seed fields
        Route::post('/check/seed/variety', [SeedController::class, 'checkVariety'])->name('seeds.checkVariety');

    // Items
    Route::resource('items', ItemController::class);
    Route::patch('items/{item}/archive', [ItemController::class, 'archive'])->name('items.archive');
    Route::patch('items/{item}/activate', [ItemController::class, 'activate'])->name('items.activate');
    Route::get('/items/{item}', [ItemController::class, 'show'])->name('items.show');
        // Validation routes - Item fields
        Route::post('/check/item/name', [ItemController::class, 'checkName'])->name('items.checkName');
    
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
