<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerRequest;
use App\Models\Partner;
use Illuminate\Http\Request;
use Inertia\Inertia;


class PartnerController extends Controller
{
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
            'filters' => $request->only(['search', 'status', 'partner_type']),
            'auth' => [
                'user' => $request->user(),
            ],
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
            'partner' => $partner,
        ]);
    }

    public function edit(Partner $partner)
    {
        return Inertia::render('Partners/Edit', [
            'partner' => $partner,
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