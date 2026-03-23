<?php

namespace App\Http\Controllers;

use App\Models\Seed;
use Inertia\Inertia;
use App\Models\Contract;
use App\Models\Item;
use App\Models\Partner;
use App\Models\PartnerOrder;
use App\Models\FieldVisit;
use App\Models\BuybackTransaction;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $isAdmin = $user->hasRole('admin');

        $totalSeeds = Seed::count();
        $activeContracts = Contract::active()->count();

        $lowStockSeeds = Seed::all()->filter(function ($seed) {
            return $seed->getCurrentStock() < 700 && $seed->getCurrentStock() >= 200;
        })->count();

        $lowStockItems = Item::all()->filter(function ($item) {
            return $item->getCurrentStock() < 700 && $item->getCurrentStock() >= 200;
        })->count();

        $lowStock = $lowStockSeeds + $lowStockItems;

        $partnersCount = Partner::count();

        // Collect recent activities from different models
        $activities = collect();

        // Contract activities (created/updated in last 7 days)
        $recentContracts = collect([]);
        if ($user->can('view contracts')) {
            $contractQuery = Contract::with('partner')
                ->where(function($query) {
                    $query->where('created_at', '>=', now()->subDays(7))
                          ->orWhere('updated_at', '>=', now()->subDays(7));
                });
            
            // Filter by user if not admin and column exists
            if (!$isAdmin && \Schema::hasColumn('contracts', 'created_by')) {
                $contractQuery->where('created_by', $user->id);
            }
            
            $recentContracts = $contractQuery->get()
                ->map(function ($contract) {
                    $isNew = $contract->created_at->diffInHours(now()) < 24;
                    return [
                        'type' => $isNew ? 'contract_created' : 'contract_updated',
                        'color' => $contract->status === 'active' ? 'green' : 
                                  ($contract->status === 'under_review' ? 'blue' : 
                                  ($contract->status === 'cancelled' ? 'red' : 'gray')),
                        'message' => $isNew 
                            ? "New contract '{$contract->contract_name}' created with {$contract->partner->name}"
                            : "Contract '{$contract->contract_name}' updated to {$contract->status}",
                        'timestamp' => $contract->updated_at,
                        'link' => route('contracts.show', $contract->id)
                    ];
                });
        }

        // Partner Order activities
        $orderQuery = PartnerOrder::with('partner')
            ->where('created_at', '>=', now()->subDays(7));
        
        // Filter by user if not admin
        if (!$isAdmin && \Schema::hasColumn('partner_orders', 'created_by')) {
            $orderQuery->where('created_by', $user->id);
        }
        
        $recentOrders = $orderQuery->get()
            ->map(function ($order) {
                return [
                    'type' => 'order_received',
                    'color' => 'green',
                    'message' => "New order #{$order->id} received from {$order->partner->name}",
                    'timestamp' => $order->created_at,
                    'link' => route('partner-orders.show', $order->id)
                ];
            });

        // Field Visit activities
        $recentVisits = collect([]);
        if ($user->can('view contracts')) {
            $visitQuery = FieldVisit::with('contract')
                ->where(function($query) {
                    $query->where('created_at', '>=', now()->subDays(7))
                          ->orWhere(function($q) {
                              $q->where('status', 'completed')
                                ->where('updated_at', '>=', now()->subDays(7));
                          });
                });
            
            // Filter by user if not admin (field_visits uses user_ID column)
            if (!$isAdmin) {
                $visitQuery->where('user_ID', $user->id);
            }
            
            $recentVisits = $visitQuery->get()
                ->map(function ($visit) {
                    return [
                        'type' => 'field_visit',
                        'color' => $visit->status === 'completed' ? 'green' : 
                                  ($visit->status === 'ongoing' ? 'blue' : 'yellow'),
                        'message' => "Field visit for contract #{$visit->contract_id} " . 
                                    ($visit->status === 'completed' ? 'completed' : $visit->status),
                        'timestamp' => $visit->updated_at,
                        'link' => route('field-visits.show', $visit->field_visit_ID)
                    ];
                });
        }

        // Buyback Transaction activities
        $recentBuybacks = collect([]);
        if ($user->can('view contracts')) {
            $buybackQuery = BuybackTransaction::with('contract')
                ->where('created_at', '>=', now()->subDays(7));
            
            // Filter by user if not admin
            if (!$isAdmin && \Schema::hasColumn('buyback_transactions', 'created_by')) {
                $buybackQuery->where('created_by', $user->id);
            }
            
            $recentBuybacks = $buybackQuery->get()
                ->map(function ($buyback) {
                    return [
                        'type' => 'buyback',
                        'color' => 'purple',
                        'message' => "Buyback transaction of {$buyback->qty} {$buyback->unit} for contract #{$buyback->contract_id}",
                        'timestamp' => $buyback->created_at,
                        'link' => route('contracts.show', $buyback->contract_id)
                    ];
                });
        }

        // Low stock alerts (only for admins)
        $lowStockAlerts = collect([]);
        if ($isAdmin) {
            $lowStockAlerts = Seed::all()
                ->filter(function ($seed) {
                    return $seed->getCurrentStock() < 700 && $seed->getCurrentStock() >= 200;
                })
                ->take(3)
                ->map(function ($seed) {
                    return [
                        'type' => 'low_stock',
                        'color' => 'yellow',
                        'message' => "{$seed->seed_name} running low (Stock: {$seed->getCurrentStock()})",
                        'timestamp' => now()->subHours(rand(1, 48)),
                        'link' => route('seeds.show', $seed->id)
                    ];
                });
        }

        // Merge all activities and sort by timestamp
        $recentActivities = $activities
            ->concat($recentContracts)
            ->concat($recentOrders)
            ->concat($recentVisits)
            ->concat($recentBuybacks)
            ->concat($lowStockAlerts)
            ->sortByDesc('timestamp')
            ->take(15)
            ->values();

        return Inertia::render('Dashboard', [
            'totalSeeds' => $totalSeeds,
            'activeContracts' => $activeContracts,
            'lowStock' => $lowStock,
            'partnersCount' => $partnersCount,
            'recentActivities' => $recentActivities,
        ]);
    }
}