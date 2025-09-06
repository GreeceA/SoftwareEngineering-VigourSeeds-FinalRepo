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
        $perPage = $request->input('per_page', 10);

        // Only allow sorting by these columns
        $allowedSorts = ['id', 'name', 'email', 'status', 'partner_type'];
        $sortBy = in_array($request->input('sort_by'), $allowedSorts) ? $request->input('sort_by') : 'id';
        $sortDir = $request->input('sort_dir') === 'asc' ? 'asc' : 'desc';

        $query = Partner::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($request->status && in_array($request->status, ['active', 'inactive']), function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->when($request->partner_type && in_array($request->partner_type, ['individual', 'organization']), function ($query) use ($request) {
                $query->where('partner_type', $request->partner_type);
            });

        $query->orderBy($sortBy, $sortDir);

        $partners = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Partners/Index', [
            'partners' => $partners,
            'filters' => $request->only(['search', 'status', 'partner_type', 'per_page', 'sort_by', 'sort_dir']),
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
        // Make sure the relation name matches your model
        $partner->load('contactPersons');

        return Inertia::render('Partners/Show', [
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
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    public function edit(Partner $partner)
    {
        $partner->load('contactPersons'); // Eloquent relation: contactPersons

        return Inertia::render('Partners/Edit', [
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
            'auth' => [
                'user' => auth()->user(),
            ],
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

