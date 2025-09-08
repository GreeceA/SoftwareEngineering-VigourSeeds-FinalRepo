<?php

namespace App\Http\Controllers;

use App\Models\Seed;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class SeedController extends Controller
{
    /**
     * Display a listing of seeds.
     */
    public function index(Request $request)
    {
        $seeds = Seed::query()
            ->when($request->search, function ($query) use ($request) {
                $query->search($request->search);
            })
            ->when($request->status, function ($query) use ($request) {
                if ($request->status === 'active') {
                    $query->active();
                } elseif ($request->status === 'archived') {
                    $query->archived();
                }
            })
            ->when($request->sort_by, function ($query) use ($request) {
                $sortBy = in_array($request->sort_by, ['seed_variety', 'price_per_unit', 'growth_cycle', 'id']) ? $request->sort_by : 'id';
                $sortDir = in_array($request->sort_dir, ['asc', 'desc']) ? $request->sort_dir : 'desc';
                $query->orderBy($sortBy, $sortDir);
            }, function ($query) {
                $query->orderBy('id', 'desc'); // Default: newest first
            })
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        return Inertia::render('Seeds/Index', [
            'seeds' => $seeds,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_dir', 'per_page'])
        ]);
    }

    /**
     * Show the form for creating a new seed.
     */
    public function create()
    {
        return Inertia::render('Seeds/Create');
    }

    /**
     * Store a newly created seed in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'seed_variety' => 'required|string|max:255',
            'price_per_unit' => 'required|numeric|min:0|max:99999999.99',
            'growth_cycle' => 'required|integer|min:1|max:365',
            'storage_requirements' => 'required|string|max:255',
            'soil_type_preference' => 'required|string|max:255',
            'notes' => 'nullable|string'
        ]);

        $validated['status'] = 'active'; 
        Seed::create($validated);

        return redirect()->route('seeds.index')->with('success', 'Seed created successfully!');
    }

    /**
     * Display the specified seed.
     */
    public function show(Seed $seed)
    {
        return Inertia::render('Seeds/Show', [
            'seed' => $seed
        ]);
    }

    /**
     * Show the form for editing the specified seed.
     */
    public function edit(Seed $seed)
    {
        return Inertia::render('Seeds/Edit', [
            'seed' => $seed
        ]);
    }

    /**
     * Update the specified seed in storage.
     */
    public function update(Request $request, Seed $seed)
    {
        $validated = $request->validate([
            'seed_variety' => 'required|string|max:255',
            'status' => ['required', Rule::in(['active', 'archived'])],
            'price_per_unit' => 'required|numeric|min:0|max:99999999.99',
            'growth_cycle' => 'required|integer|min:1|max:365',
            'storage_requirements' => 'required|string|max:255',
            'soil_type_preference' => 'required|string|max:255',
            'notes' => 'nullable|string'
        ]);

        $seed->update($validated);

        return redirect()->route('seeds.index')->with('success', 'Seed updated successfully!');
    }

    /**
     * Archive the specified seed.
     */
    public function archive(Seed $seed)
    {
        $seed->update(['status' => 'archived']);

        return back()->with('success', 'Seed archived successfully!');
    }

    /**
     * Restore the specified seed.
     */
    public function restore(Seed $seed)
    {
        $seed->update(['status' => 'active']);

        return back()->with('success', 'Seed restored successfully!');
    }
    
    
}