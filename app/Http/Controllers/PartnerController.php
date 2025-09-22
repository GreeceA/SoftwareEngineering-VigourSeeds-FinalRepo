<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerRequest;
use App\Models\Partner;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PartnerController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view partners', only: ['index', 'show']),
            new Middleware('permission:create partners', only: ['create', 'store']),
            new Middleware('permission:edit partners', only: ['edit', 'update']),
            new Middleware('permission:archive partners', only: ['destroy', 'deactivate', 'reactivate']),
        ];
    }
    public function index(Request $request)
    {
        $partners = Partner::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->partner_type, function ($query, $type) {
                $query->where('partner_type', $type);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Partners/Index', [
            'partners' => $partners,
<<<<<<< Updated upstream
            'filters' => $request->only(['search', 'status', 'partner_type']),
            'auth' => [
                'user' => $request->user(),
            ],
=======
            'filters' => $request->only(['search', 'status', 'partner_type', 'per_page', 'sort_by', 'sort_dir']),
>>>>>>> Stashed changes
        ]);
    }

    public function create()
    {
        return Inertia::render('Partners/Create');
    }

    public function store(PartnerRequest $request)
    {
        Partner::create($request->validated());

        return redirect()->route('partners.index')
            ->with('success', 'Partner created successfully.');
    }

    public function show(Partner $partner)
    {
        return Inertia::render('Partners/Show', [
<<<<<<< Updated upstream
            'partner' => $partner,
=======
            'partner' => [
                ...$partner->toArray(),
                'contact_persons' => $partner->contactPersons->map(function ($c) {
                    return [
                        'name' => $c->name,
                        'email' => $c->email,
                        'phone_number' => $c->phone_number,
                    ];
                }),
            ],
>>>>>>> Stashed changes
        ]);
    }

    public function edit(Partner $partner)
    {
        return Inertia::render('Partners/Edit', [
<<<<<<< Updated upstream
            'partner' => $partner,
=======
            'partner' => [
                ...$partner->toArray(),
                'contact_persons' => $partner->contactPersons->map(function ($c) {
                    return [
                        'name' => $c->name,
                        'email' => $c->email,
                        'phone_number' => $c->phone_number,
                    ];
                }),
            ],
>>>>>>> Stashed changes
        ]);
    }

    public function update(PartnerRequest $request, Partner $partner)
    {
        $partner->update($request->validated());

        return redirect()->route('partners.index')
            ->with('success', 'Partner updated successfully.');
    }

    public function destroy(Partner $partner)
    {
        $partner->delete();

        return redirect()->route('partners.index')
            ->with('success', 'Partner deleted successfully.');
    }
}