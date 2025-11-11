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
use App\Http\Controllers\FieldVisitController;
use App\Http\Controllers\GrowthReportController;
use App\Http\Controllers\DamageReportController;
use App\Http\Controllers\InventoryTransactionController;
use App\Http\Controllers\PartnerOrderController;
use App\Http\Controllers\BuybackController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\DashboardController;



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
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');


    // Profile
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');
    
    // Email Verification
    // Show verification notice (uses EmailVerificationPromptController::__invoke)
    Route::get('/verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    // Resend verification link
    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // Verify email (signed URL)
    Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
        $request->fulfill();
        return Redirect::route('profile.edit');
    })->middleware(['auth', 'signed'])->name('verification.verify');

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

    Route::get('/users/export', [UserController::class, 'export'])
    ->middleware(['auth', 'permission:view users'])
    ->name('users.export');
    
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
    Route::post('contracts/{contract}/status', [ContractController::class, 'changeStatus'])
      ->name('contracts.change-status');
    Route::get('partners/search', [ContractController::class, 'searchPartners'])
        ->name('partners.search');
    Route::post('/contracts/{contract}/cancel', [ContractController::class, 'destroy'])->name('contracts.cancel');
    Route::get('/contracts/preview-pdf/{filename}', [ContractController::class, 'previewDocxAsPdf']);
        // Download routes - Contract files
            Route::get('/contracts/download-pdf/{filename}', [ContractController::class, 'downloadAsPdf']);
            Route::get('/contracts/download-docx/{filename}', [ContractController::class, 'downloadAsDocx']);
    Route::post('contracts/{contract}/email', [ContractController::class, 'sendEmail'])
      ->name('contracts.sendEmail');
    Route::get('/partner-portal/contracts/{id}', [ContractController::class, 'showPartner'])->name('partner.contracts.show');
    Route::post('/partner-portal/contracts/{id}/verify', [ContractController::class, 'verifyPartner'])->name('partner.contracts.verify');
    Route::post('contracts/check-name', [ContractController::class, 'checkNameUnique'])
      ->name('contracts.checkNameUnique');
    Route::get('/contracts/{contract}/report', [ContractController::class, 'exportReport'])
        ->name('contracts.report')
        ->middleware(['permission:view contracts']);

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

    // Field Visits + Reports
    Route::resource('field-visits', FieldVisitController::class);
    Route::post('field-visits/{id}/complete', [FieldVisitController::class, 'complete'])
        ->name('field-visits.complete');
    Route::post('field-visits/{id}/cancel', [FieldVisitController::class, 'cancel'])
        ->name('field-visits.cancel');
    Route::post('field-visits/{id}/growth-reports', [FieldVisitController::class, 'addGrowthReport'])
        ->name('field-visits.growth-reports.store');
    Route::post('field-visits/{id}/damage-reports', [FieldVisitController::class, 'addDamageReport'])
        ->name('field-visits.damage-reports.store');
    // Growth Reports Resource Routes (limited actions)
    Route::resource('growth-reports', GrowthReportController::class)
        ->only(['index', 'show', 'edit', 'update', 'destroy']);
    // Damage Reports Resource Routes (limited actions)
    Route::resource('damage-reports', DamageReportController::class)
        ->only(['index', 'show', 'edit', 'update', 'destroy']);


    // Inventory Transactions
    // Inventory Dashboard
    Route::get('/inventory/dashboard', [InventoryTransactionController::class, 'dashboard'])
        ->name('inventory.dashboard');
    
    // Inventory Ledger (All Transactions)
    Route::get('/inventory/ledger', [InventoryTransactionController::class, 'index'])
        ->name('inventory.ledger');
    
    // Stock-In (Inbound)
    Route::get('/inventory/inbound', [InventoryTransactionController::class, 'createInbound'])
        ->name('inventory.inbound.create');
    Route::post('/inventory/inbound', [InventoryTransactionController::class, 'storeInbound'])
        ->name('inventory.inbound.store');
    
    // Stock-Out (Outbound)
    Route::get('/inventory/outbound', [InventoryTransactionController::class, 'createOutbound'])->name('inventory.outbound.create');
    Route::post('/inventory/outbound', [InventoryTransactionController::class, 'storeOutbound'])->name('inventory.outbound.store');
    
    // Inventory Adjustments
    Route::get('/inventory/adjustment/create', [InventoryTransactionController::class, 'createAdjustment'])
        ->name('inventory.adjustment.create');
    Route::post('/inventory/adjustment', [InventoryTransactionController::class, 'storeAdjustment'])
        ->name('inventory.adjustment.store');
    
    // Show specific product (wildcard route - MUST BE LAST)
    Route::get('/inventory/{productType}/{productId}', [InventoryTransactionController::class, 'show'])
    ->name('inventory.show');

    
        
    // ============================================
    // PARTNER ORDERS ROUTES
    // ============================================
    
    // List all partner orders
    Route::get('/partner-orders', [PartnerOrderController::class, 'index'])
        ->name('partner-orders.index');
    
    // Create new partner order
    Route::get('/partner-orders/create', [PartnerOrderController::class, 'create'])
        ->name('partner-orders.create');
    Route::post('/partner-orders', [PartnerOrderController::class, 'store'])
        ->name('partner-orders.store');
    
    // Generate order from contract
    Route::post('/partner-orders/generate-from-contract', [PartnerOrderController::class, 'generateFromContract'])
        ->name('partner-orders.generate-from-contract');
    
    // View specific partner order
    Route::get('/partner-orders/{partnerOrder}', [PartnerOrderController::class, 'show'])
        ->name('partner-orders.show');
    
    // Update partner order status
    Route::put('/partner-orders/{partnerOrder}/status', [PartnerOrderController::class, 'updateStatus'])
        ->name('partner-orders.update-status');
    
    // Cancel partner order
    Route::put('/partner-orders/{partnerOrder}/cancel', [PartnerOrderController::class, 'cancel'])
        ->name('partner-orders.cancel');
    
    // ============================================
    // BUYBACK ROUTES
    // ============================================
    
    // Buyback overview
    Route::get('/buybacks', [BuybackController::class, 'index'])
        ->name('buybacks.index');
    
    // Record buyback delivery
    Route::get('/buybacks/inbound', [BuybackController::class, 'createInbound'])
        ->name('buybacks.inbound.create');
    Route::post('/buybacks/inbound', [BuybackController::class, 'storeInbound'])
        ->name('buybacks.inbound.store');
    
    // View buyback details for contract
    Route::get('/buybacks/contract/{contract}', [BuybackController::class, 'show'])
        ->name('buybacks.show');
    
    // Get buyback history (AJAX)
    Route::get('/buybacks/contract/{contractId}/history', [BuybackController::class, 'getContractHistory'])
        ->name('buybacks.contract.history');


    }); //end

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
