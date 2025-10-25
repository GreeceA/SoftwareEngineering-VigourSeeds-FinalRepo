<?php

namespace App\Http\Controllers;

use App\Http\Requests\SeedRequest;
use App\Models\Seed;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class SeedController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view seeds', only: ['index', 'show']),
            new Middleware('permission:create seeds', only: ['create', 'store']),
            new Middleware('permission:edit seeds', only: ['edit', 'update']),
            new Middleware('permission:archive seeds', only: ['archive', 'restore']),
        ];
    }

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
                $sortBy = in_array($request->sort_by, ['seed_variety', 'price_per_unit', 'growth_cycle', 'id'])
                    ? $request->sort_by
                    : 'id';
                $sortDir = in_array($request->sort_dir, ['asc', 'desc'])
                    ? $request->sort_dir
                    : 'desc';
                $query->orderBy($sortBy, $sortDir);
            }, function ($query) {
                $query->orderBy('id', 'desc');
            })
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        return Inertia::render('Seeds/Index', [
            'seeds' => $seeds,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_dir', 'per_page']),
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
            'seed' => $seed,
        ]);
    }

    public function edit(Seed $seed)
    {
        return Inertia::render('Seeds/Edit', [
            'seed' => $seed,
        ]);
    }

    public function update(SeedRequest $request, Seed $seed)
    {
        $validated = $request->validated();

        // Always keep the current status (do not change it from the form)
        $validated['status'] = $seed->status;

        $seed->update($validated);
        return redirect()->route('seeds.index')->with('success', 'Seed updated successfully!');
    }

    // Status Modification

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

    // AJAX Uniqueness Check

    public function checkVariety(Request $request)
    {
        $exists = Seed::where('seed_variety', $request->seed_variety)
            ->when($request->seedId, function ($query) use ($request) {
                $query->where('id', '!=', $request->seedId);
            })
            ->exists();

        if ($exists) {
            return response()->json([
                'errors' => [
                    'seed_variety' => ['A seed variety with this name already exists. Please enter a different variety name.'],
                ],
            ], 422);
        }
        return response()->json(['message' => 'Variety is unique.'], 200);
    }
}