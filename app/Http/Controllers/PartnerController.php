<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerRequest;
use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PartnerController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $allowedSorts = ['id', 'name', 'email', 'status', 'partner_type'];
        $sortBy = in_array($request->input('sort_by'), $allowedSorts)
            ? $request->input('sort_by')
            : 'id';
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
            })
            ->orderBy($sortBy, $sortDir);

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

        // Store Contact Persons for organizations
        if ($request->partner_type === 'organization' && $request->contact_persons) {
            foreach ($request->contact_persons as $contact) {
                $partner->contactPersons()->create([
                    'name'         => $contact['name'],
                    'email'        => $contact['email'] ?? null,
                    'phone_number' => $contact['phone_number'] ?? null,
                ]);
            }
        }

        // Store Farms
        if ($request->farms && is_array($request->farms)) {
            foreach ($request->farms as $farm) {
                $partner->farms()->create([
                    'location_name' => $farm['location_name'],
                    'address'       => $farm['address'],
                    'area_size'     => $farm['area_size'] ?? null,
                    'soil_type'     => $farm['soil_type'] ?? null,
                ]);
            }
        }

        return redirect()->route('partners.index')->with('success', 'Partner created successfully.');
    }

    // Display the specified partner.
    public function show(Partner $partner)
    {
        $partner->load(['contactPersons', 'farms']);

        return Inertia::render('Partners/Show', [
            'partner' => [
                ...$partner->toArray(),
                'contact_persons' => $partner->contactPersons->map(function ($c) {
                    return [
                        'name'         => $c->name,
                        'email'        => $c->email,
                        'phone_number' => $c->phone_number,
                    ];
                }),
                'farms' => $partner->farms->map(function ($f) {
                    return [
                        'location_name' => $f->location_name,
                        'address'       => $f->address,
                        'area_size'     => $f->area_size,
                        'soil_type'     => $f->soil_type,
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
        $partner->load(['contactPersons', 'farms']);

        return Inertia::render('Partners/Edit', [
            'partner' => [
                ...$partner->toArray(),
                'contact_persons' => $partner->contactPersons->map(function ($c) {
                    return [
                        'name'         => $c->name,
                        'email'        => $c->email,
                        'phone_number' => $c->phone_number,
                    ];
                }),
                'farms' => $partner->farms->map(function ($f) {
                    return [
                        'location_name' => $f->location_name,
                        'address'       => $f->address,
                        'area_size'     => $f->area_size,
                        'soil_type'     => $f->soil_type,
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

        // Contacts - Only delete those not in the new list
        $partner->contactPersons()->delete();

        if ($request->partner_type === 'organization' && $request->contact_persons) {
            foreach ($request->contact_persons as $contact) {
                $partner->contactPersons()->create([
                    'name'         => $contact['name'],
                    'email'        => $contact['email'] ?? null,
                    'phone_number' => $contact['phone_number'] ?? null,
                ]);
            }
        }

        // Farms - UPDATE existing farms instead of deleting them to preserve contracts
        if ($request->farms && is_array($request->farms)) {
            $submittedFarmIds = [];
            
            foreach ($request->farms as $farm) {
                if (isset($farm['id']) && $farm['id']) {
                    // Update existing farm
                    $existingFarm = $partner->farms()->find($farm['id']);
                    if ($existingFarm) {
                        $existingFarm->update([
                            'location_name' => $farm['location_name'],
                            'address'       => $farm['address'],
                            'area_size'     => $farm['area_size'] ?? null,
                            'soil_type'     => $farm['soil_type'] ?? null,
                        ]);
                        $submittedFarmIds[] = $farm['id'];
                    }
                } else {
                    // Create new farm
                    $newFarm = $partner->farms()->create([
                        'location_name' => $farm['location_name'],
                        'address'       => $farm['address'],
                        'area_size'     => $farm['area_size'] ?? null,
                        'soil_type'     => $farm['soil_type'] ?? null,
                    ]);
                    $submittedFarmIds[] = $newFarm->id;
                }
            }
            
            // Only delete farms that are NOT in the submitted list AND have NO contracts
            $partner->farms()
                ->whereNotIn('id', $submittedFarmIds)
                ->whereDoesntHave('contracts')
                ->delete();
        }

        return redirect()->route('partners.index')->with('success', 'Partner updated successfully.');
    }

    public function destroy(Partner $partner)
    {
        // $partner->delete();

        // return redirect()->route('partners.index')
        //     ->with('success', 'Partner deleted successfully.');
    }

    //  Status Modification 
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

    // AJAX Uniqueness Checks
    public function checkName(Request $request)
    {
        $partnerId = $request->input('partnerId');
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('partners')->ignore($partnerId),
            ],
        ], [
            'name.unique' => 'A partner with this name already exists. Please provide a different name.',
        ]);

        return response()->json(['status' => 'ok']);
    }

    public function checkEmail(Request $request)
    {
        $partnerId = $request->input('partnerId');
        $request->validate([
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('partners')->ignore($partnerId),
            ],
        ], [
            'email.unique' => 'This email address is already registered.',
        ]);

        return response()->json(['status' => 'ok']);
    }

    public function checkRegistrationNumber(Request $request)
    {
        $partnerId = $request->input('partnerId');
        $request->validate([
            'registration_number' => [
                'required',
                'string',
                'regex:/^\d{11}$/',
                Rule::unique('partners')->ignore($partnerId),
            ],
        ], [
            'registration_number.unique' => 'DTI Registration Number is already registered.',
        ]);

        return response()->json(['status' => 'ok']);
    }

    public function checkTaxId(Request $request)
    {
        $partnerId = $request->input('partnerId');
        $request->validate([
            'tax_id' => [
                'required',
                'regex:/^\d{3}-\d{3}-\d{3}-\d{3}$/',
                Rule::unique('partners')->ignore($partnerId),
            ],
        ], [
            'tax_id.unique' => 'Tax ID (TIN) is already registered.',
        ]);

        return response()->json(['status' => 'ok']);
    }
}