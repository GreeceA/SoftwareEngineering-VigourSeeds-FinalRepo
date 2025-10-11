<?php

namespace App\Http\Controllers;

use App\Models\Seed;
use App\Http\Requests\SeedRequest; 
use Illuminate\Http\Request;
use Inertia\Inertia;

class SeedController extends Controller
{
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
                $query->orderBy('id', 'desc');
            })
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        return Inertia::render('Seeds/Index', [
            'seeds' => $seeds,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_dir', 'per_page'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Seeds/Create');
    }

    public function store(SeedRequest $request) 
    {
        $validated = $request->validated(); 

        $validated['status'] = 'active'; 
        Seed::create($validated);

        return redirect()->route('seeds.index')->with('success', 'Seed created successfully!');
    }

    public function show(Seed $seed)
    {
        return Inertia::render('Seeds/Show', [
            'seed' => $seed
        ]);
    }

    public function edit(Seed $seed)
    {
        return Inertia::render('Seeds/Edit', [
            'seed' => $seed
        ]);
    }

    public function update(SeedRequest $request, Seed $seed) 
    {
        $validated = $request->validated();

        $seed->update($validated);

        return redirect()->route('seeds.index')->with('success', 'Seed updated successfully!');
    }

    public function archive(Seed $seed)
    {
        $seed->update(['status' => 'archived']);

        return back()->with('success', 'Seed archived successfully!');
    }

    public function restore(Seed $seed)
    {
        $seed->update(['status' => 'active']);

        return back()->with('success', 'Seed restored successfully!');
    }

    public function checkVariety(Request $request)
    {
        $request->validate([
            'seed_variety' => [
                'required',
                'string',
                Rule::unique('seeds', 'seed_variety')->ignore($request->seedId),
            ],
        ]);

        return response()->json(['message' => 'Variety is unique.'], 200);
    }
}

