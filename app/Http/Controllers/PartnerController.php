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
        $partner = Partner::create($request->validated());

        if ($request->partner_type === 'organization' && $request->contact_persons) {
            foreach ($request->contact_persons as $contact) {
                $partner->contacts()->create([
                    'name' => $contact['name'],
                    'email' => $contact['email'] ?? null,
                    'phone_number' => $contact['phone_number'] ?? null,
                ]);
            }
        }

        return redirect()->route('partners.index')->with('success', 'Partner created successfully.');
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

        // Remove old contacts
        $partner->contacts()->delete();

        if ($request->partner_type === 'organization' && $request->contact_persons) {
            foreach ($request->contact_persons as $contact) {
                $partner->contacts()->create([
                    'name' => $contact['name'],
                    'email' => $contact['email'] ?? null,
                    'phone_number' => $contact['phone_number'] ?? null,
                ]);
            }
        }

        return redirect()->route('partners.index')->with('success', 'Partner updated successfully.');
    }
    
    public function destroy(Partner $partner)
    {
        $partner->delete();

        return redirect()->route('partners.index')
            ->with('success', 'Partner deleted successfully.');
    }

    public function deactivate(Partner $partner)
    {
        $partner->status = 'inactive';
        $partner->save();

        return redirect()->back()->with('success', 'Partner deactivated successfully.');
    }

    public function reactivate(Partner $partner)
    {
        $partner->status = 'active';
        $partner->save();

        return redirect()->back()->with('success', 'Partner reactivated successfully.');
    }

    public function contacts()
    {
        return $this->hasMany(PartnerContact::class);
    }
}