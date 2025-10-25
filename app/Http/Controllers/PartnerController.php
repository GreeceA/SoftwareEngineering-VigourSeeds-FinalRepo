<?php

namespace App\Http\Controllers;

use App\Http\Requests\PartnerRequest;
use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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
            new Middleware('permission:archive partners', only: ['deactivate', 'reactivate']), // ← Change this line
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
        Partner::create($request->validated());

        return redirect()->route('partners.index')
            ->with('success', 'Partner created successfully.');
    }

    // Display the specified partner.
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
        // $partner->delete();

        // return redirect()->route('partners.index')
        //     ->with('success', 'Partner deleted successfully.');
    }

    //  Status Modification 
    public function deactivate(Partner $partner)
    {
        $partner->update(['status' => 'inactive']);

        return redirect()->route('partners.index')
            ->with('success', 'Partner archived successfully.');
    }

    public function reactivate(Partner $partner)
    {
        $partner->update(['status' => 'active']);

        return redirect()->route('partners.index')
            ->with('success', 'Partner reactivated successfully.');
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