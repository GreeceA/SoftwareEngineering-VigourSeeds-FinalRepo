<?php

namespace App\Http\Controllers;

use App\Models\Seed;
use Inertia\Inertia;
use App\Models\Contract;
use App\Models\Item;
use App\Models\Partner;

class DashboardController extends Controller
{
    public function index()
    {
        $totalSeeds = Seed::count();
        $activeContracts = Contract::active()->count();

        $lowStockSeeds = Seed::all()->filter(function ($seed) {
            return $seed->getCurrentStock() < 700 && $seed->getCurrentStock() >= 200;
        })->count();

        $lowStockItems = Item::all()->filter(function ($item) {
            return $item->getCurrentStock() < 700 && $item->getCurrentStock() >= 200;
        })->count();

        $lowStock = $lowStockSeeds + $lowStockItems;

        $partnersCount = Partner::count(); // <-- Add this line

        return Inertia::render('Dashboard', [
            'totalSeeds' => $totalSeeds,
            'activeContracts' => $activeContracts,
            'lowStock' => $lowStock,
            'partnersCount' => $partnersCount, // <-- Pass to frontend
        ]);
    }
}