<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemRequest;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ItemController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view items', only: ['index', 'show']),
            new Middleware('permission:create items', only: ['create', 'store']),
            new Middleware('permission:edit items', only: ['edit', 'update']),
            new Middleware('permission:archive items', only: ['archive', 'activate', 'destroy']),
        ];
    }

    // Display a listing of the resource.
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        
        $sortable = ['id', 'name', 'price_per_unit'];
        $sortBy = in_array($request->get('sort_by'), $sortable) ? $request->get('sort_by') : 'id';
        $sortDir = $request->get('sort_dir') === 'asc' ? 'asc' : 'desc';

        $query = Item::query()
            // Filter by status if provided
            ->when($request->has('status') && in_array($request->status, ['active', 'archived']), function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            // Search functionality
            ->when($request->has('search') && $request->search, function ($query) use ($request) {
                $query->where(function($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                      ->orWhere('description', 'like', '%' . $request->search . '%');
                });
            })
            ->orderBy($sortBy, $sortDir);

        $items = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Items/Index', [
            'items' => $items,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_dir', 'per_page']),
        ]);
    }

    // Show the form for creating a new resource.
    public function create()
    {
        return Inertia::render('Items/Create');
    }

    // Store a newly created resource in storage.
    public function store(ItemRequest $request)
    {
        Item::create($request->validated());

        return redirect()->route('items.index')
            ->with('success', 'Item created successfully.');
    }

    // Display the specified resource.
    public function show(Item $item)
    {
        return Inertia::render('Items/Show', [
            'item' => $item,
        ]);
    }

    // Show the form for editing the specified resource.
    public function edit(Item $item)
    {
        return Inertia::render('Items/Edit', [
            'item' => $item,
        ]);
    }

    // Update the specified resource in storage.
    public function update(ItemRequest $request, Item $item)
    {
        $item->update($request->validated());

        return redirect()->route('items.index')
            ->with('success', 'Item updated successfully.');
    }

    // Remove the specified resource from storage (archives the item).
    public function destroy(Item $item)
    {
        $item->archive();

        return redirect()->route('items.index')
            ->with('success', 'Item archived successfully.');
    }

    // Archive the specified item.
    public function archive(Item $item)
    {
        $item->archive();

        return redirect()->back()
            ->with('success', 'Item archived successfully.');
    }

    // Activate the specified item.
    public function activate(Item $item)
    {
        $item->activate();

        return redirect()->back()
            ->with('success', 'Item activated successfully.');
    }

    // AJAX Uniqueness Check for Item Name.
    public function checkName(Request $request)
    {
        $exists = Item::where('name', $request->name)
            ->when($request->itemId, function ($query) use ($request) {
                $query->where('id', '!=', $request->itemId);
            })
            ->exists();

        if ($exists) {
            return response()->json([
                'errors' => [
                    'name' => ['An item with this name already exists. Please enter a different item name.'],
                ],
            ], 422);
        }
        
        return response()->json(['success' => true]);
    }
}