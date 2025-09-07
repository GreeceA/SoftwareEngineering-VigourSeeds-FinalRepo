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
            ->orderBy('seed_variety')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Seeds/Index', [
            'seeds' => $seeds,
            'filters' => $request->only(['search', 'status'])
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
            'status' => ['required', Rule::in(['active', 'archived'])],
            'price_per_unit' => 'required|numeric|min:0|max:99999999.99',
            'growth_cycle' => 'required|string|max:255',
            'storage_requirements' => 'required|string|max:255',
            'soil_type_preference' => 'required|string|max:255',
            'notes' => 'nullable|string'
        ]);

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
            'growth_cycle' => 'required|string|max:255',
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

    /**
     * Remove the specified seed from storage.
     */
    public function destroy(Seed $seed)
    {
        $seed->delete();
        
        return back()->with('success', 'Seed deleted successfully!');
    }
}