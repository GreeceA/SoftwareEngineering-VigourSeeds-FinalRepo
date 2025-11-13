<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerRequest;
use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Barryvdh\DomPDF\Facade\Pdf;

class PartnerController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view partners', only: ['index', 'show']),
            new Middleware('permission:create partners', only: ['create', 'store']),
            new Middleware('permission:edit partners', only: ['edit', 'update']),
            new Middleware('permission:archive partners', only: ['deactivate', 'reactivate']),
        ];
    }

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

        $partners->getCollection()->transform(function ($partner) {
            if ($partner->avatar && !str_starts_with($partner->avatar, 'http')) {
                $partner->avatar = asset($partner->avatar);
            }
            // Add contracts array for frontend modal
            $partner->contracts = $partner->contracts()->get()->map(function ($contract) {
                return [
                    'id' => $contract->id,
                    'name' => $contract->contract_name,
                    'status' => $contract->status,
                    'start_date' => $contract->signing_date,
                    'end_date' => $contract->expiration_date,
                    'value' => $contract->buyback_price_per_unit,
                ];
            });
            return $partner;
        });

        return Inertia::render('Partners/Index', [
            'partners' => $partners,
            'filters' => $request->only(['search', 'status', 'partner_type', 'per_page', 'sort_by', 'sort_dir']),
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
                    'name' => $contact['name'],
                    'email' => $contact['email'] ?? null,
                    'phone_number' => $contact['phone_number'] ?? null,
                ]);
            }
        }

        // Store Farms
        if ($request->farms && is_array($request->farms)) {
            foreach ($request->farms as $farm) {
                $partner->farms()->create([
                    'location_name' => $farm['location_name'],
                    'address' => $farm['address'],
                    'area_size' => $farm['area_size'] ?? null,
                    'soil_type' => $farm['soil_type'] ?? null,
                ]);
            }
        }

        return redirect()->route('partners.index')->with('success', 'Partner created successfully.');
    }

    // Display the specified partner.
    public function show(Partner $partner)
    {
        $partner->load(['contactPersons', 'farms', 'contracts']); // Add 'contracts' relationship

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
                'farms' => $partner->farms->map(function ($f) {
                    return [
                        'location_name' => $f->location_name,
                        'address' => $f->address,
                        'area_size' => $f->area_size,
                        'soil_type' => $f->soil_type,
                    ];
                }),
                'contracts' => $partner->contracts->map(function ($contract) {
                    return [
                        'id' => $contract->id,
                        'name' => $contract->contract_name,
                        'status' => $contract->status,
                        'start_date' => $contract->signing_date,
                        'end_date' => $contract->expiration_date,
                        'value' => $contract->buyback_price_per_unit, // or another field for contract value
                    ];
                }),
            ],
        ]);
    }

    public function edit(Partner $partner)
    {
        $partner->load(['contactPersons', 'farms.contracts']);

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
                'farms' => $partner->farms->map(function ($f) {
                    return [
                        'location_name' => $f->location_name,
                        'address' => $f->address,
                        'area_size' => $f->area_size,
                        'soil_type' => $f->soil_type,
                        'contract_id' => $f->contracts->isNotEmpty() ? $f->contracts->first()->id : null,
                    ];
                }),
            ],
        ]);
    }

    public function update(PartnerRequest $request, Partner $partner)
    {
        $partner->update($request->validated());

        // Contacts
        $partner->contactPersons()->delete();

        if ($request->partner_type === 'organization' && $request->contact_persons) {
            foreach ($request->contact_persons as $contact) {
                $partner->contactPersons()->create([
                    'name' => $contact['name'],
                    'email' => $contact['email'] ?? null,
                    'phone_number' => $contact['phone_number'] ?? null,
                ]);
            }
        }

        // Farms
        foreach ($partner->farms as $farm) {
            // Check if farm is used in any contract
            $isUsed = $farm->contracts()->exists();
            if (!$isUsed) {
                $farm->delete();
            }
            // If used, skip deletion
        }

        if ($request->farms && is_array($request->farms)) {
            foreach ($request->farms as $farmData) {
                // Only create new farm if not already existing
                if (empty($farmData['id'])) {
                    $partner->farms()->create([
                        'location_name' => $farmData['location_name'],
                        'address' => $farmData['address'],
                        'area_size' => $farmData['area_size'] ?? null,
                        'soil_type' => $farmData['soil_type'] ?? null,
                    ]);
                }
            }
        }

        return redirect()->route('partners.index')->with('success', 'Partner updated successfully.');
    }

    public function destroy(Partner $partner)
    {
        // $partner->delete();

        // return redirect()->route('partners.index')
        //     ->with('success', 'Partner deleted successfully.');
    }

    // Status Modification
    public function deactivate(Partner $partner)
    {
        // Check for ongoing contracts
        $ongoingStatuses = ['draft', 'under_review', 'active', 'suspended'];
        $hasOngoingContract = $partner->contracts()->whereIn('status', $ongoingStatuses)->exists();

        if ($hasOngoingContract) {
            return redirect()->back()->with('error', 'Cannot archive partner: There are ongoing contracts (draft, under review, active, or suspended).');
        }

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

    public function export(Request $request)
    {
        $format = $request->query('format', 'pdf');

        // Get all partners
        $partners = Partner::select('id', 'name', 'email', 'partner_type', 'phone', 'status', 'created_at')
            ->orderBy('id', 'asc')
            ->get();

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('exports.partners_pdf', compact('partners'))
                ->setPaper('a4', 'landscape');
            return $pdf->download('VigourSeed_PartnerList_' . now()->format('Y-m-d') . '.pdf');
        }
    }

    public function exportProfile(Partner $partner)
    {
        $partner->load(['contactPersons', 'farms']);

        $pdf = Pdf::loadView('exports.partner_profile_pdf', [
            'partner' => $partner,
            'contacts' => $partner->contactPersons,
            'farms' => $partner->farms,
            'user' => auth()->user(),
        ])->setPaper('a4', 'landscape');

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="VigourSeed_Partner_' . $partner->id . '_' . now()->format('Y-m-d') . '.pdf"');
    }
}