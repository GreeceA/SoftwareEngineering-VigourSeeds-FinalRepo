<?php

namespace App\Http\Controllers;

use App\Models\FieldVisit;
use App\Models\Contract;
use App\Models\User;
use App\Models\GrowthReport;
use App\Models\DamageReport;
use App\Http\Requests\StoreFieldVisitRequest;
use App\Http\Requests\UpdateFieldVisitRequest;
use App\Http\Requests\StoreGrowthReportRequest;
use App\Http\Requests\StoreDamageReportRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class FieldVisitController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view field visit', only: ['index', 'show']),
            new Middleware('permission:create field visit', only: ['create', 'store', 'addGrowthReport', 'addDamageReport']),
            new Middleware('permission:edit field visit', only: ['edit', 'update', 'complete', 'cancel', 'destroy']),
        ];
    }

    public function index(Request $request)
    {
        $query = FieldVisit::with(['contract:id,contract_name', 'assignee:id,first_name,last_name'])
            ->withCount(['growthReports', 'damageReports']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('contract', function ($q) use ($search) {
                    $q->where('contract_name', 'like', "%{$search}%");
                })
                ->orWhere('remarks', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by contract
        if ($request->filled('contract_id')) {
            $query->where('contract_ID', $request->contract_id);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->where('date_visit', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('date_visit', '<=', $request->date_to);
        }

        $fieldVisits = $query->orderBy('date_visit', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('FieldVisits/Index', [
            'fieldVisits' => $fieldVisits,
            'filters' => $request->only(['search', 'status', 'contract_id', 'date_from', 'date_to']),
            'contracts' => Contract::select('id', 'contract_name')->get(),
        ]);
    }

    public function create()
    {
        // Only show active contracts
        $contracts = Contract::with(['partner', 'farm'])
            ->where('status', 'active')
            ->orderBy('contract_name')
            ->get();

        $users = User::select('id', 'first_name', 'last_name', 'email')
            ->orderBy('first_name')
            ->get();

        return Inertia::render('FieldVisits/FieldVisitForm', [
            'auth' => ['user' => auth()->user()],
            'contracts' => $contracts,
            'users' => $users,
        ]);
    }

    public function store(StoreFieldVisitRequest $request)
    {
        DB::transaction(function () use ($request) {
            FieldVisit::create($request->validated());
        });

        return redirect()
            ->route('field-visits.index')
            ->with('success', 'Field visit created successfully.');
    }

    public function show($id)
    {
        $fieldVisit = FieldVisit::with([
            'contract.farm', // <-- add this line
            'assignee',
            'growthReports',
            'damageReports'
        ])->findOrFail($id);

        // Attach farm directly for easier access in JS
        $farm = $fieldVisit->contract && $fieldVisit->contract->farm
            ? $fieldVisit->contract->farm
            : null;

        return Inertia::render('FieldVisits/Show', [
            'fieldVisit' => $fieldVisit,
            'farm' => $farm, // <-- pass farm as a separate prop if you want
        ]);
    }

    public function edit($id)
    {
        $fieldVisit = FieldVisit::findOrFail($id);

        if (method_exists($fieldVisit, 'canBeEdited') && ! $fieldVisit->canBeEdited()) {
            return redirect()
                ->route('field-visits.show', $id)
                ->with('error', 'Completed field visits cannot be edited.');
        }

        return Inertia::render('FieldVisits/Edit', [
            'fieldVisit' => $fieldVisit,
            'contracts' => Contract::with('farm')->select('id', 'contract_name', 'farm_id')->get(),
            'users' => User::select('id', 'first_name', 'last_name')->get(),
        ]);
    }

    public function update(UpdateFieldVisitRequest $request, $id)
    {
        $fieldVisit = FieldVisit::findOrFail($id);

        if (method_exists($fieldVisit, 'canBeEdited') && ! $fieldVisit->canBeEdited()) {
            return redirect()
                ->route('field-visits.show', $id)
                ->with('error', 'Completed field visits cannot be edited.');
        }

        $fieldVisit->update($request->validated());

        return redirect()
            ->route('field-visits.show', $id)
            ->with('success', 'Field visit updated successfully.');
    }

    public function destroy($id)
    {
        $fieldVisit = FieldVisit::findOrFail($id);
        $fieldVisit->delete();

        return redirect()
            ->route('field-visits.index')
            ->with('success', 'Field visit deleted successfully.');
    }

    public function complete($id)
    {
        $fieldVisit = FieldVisit::findOrFail($id);

        if ($fieldVisit->status === 'completed') {
            return back()->with('error', 'Field visit is already completed.');
        }

        if (! $fieldVisit->damageReports()->exists() && ! $fieldVisit->growthReports()->exists()) {
            return back()->with('error', 'Cannot complete: at least one Damage or Growth Report is required.');
        }

        $fieldVisit->update(['status' => 'completed']);

        return back()->with('success', 'Field visit completed successfully.');
    }

    public function cancel($id)
    {
        $fieldVisit = FieldVisit::findOrFail($id);

        if ($fieldVisit->status === 'cancelled') {
            return back()->with('error', 'Field visit is already cancelled.');
        }

        if ($fieldVisit->status === 'completed') {
            return back()->with('error', 'Completed field visits cannot be cancelled.');
        }

        $fieldVisit->update(['status' => 'cancelled']);

        return back()->with('success', 'Field visit cancelled successfully.');
    }

    public function addGrowthReport(StoreGrowthReportRequest $request, $fieldVisitId)
    {
        $fieldVisit = FieldVisit::findOrFail($fieldVisitId);

        if (method_exists($fieldVisit, 'canAddReports') && ! $fieldVisit->canAddReports()) {
            return back()->with('error', 'Reports can only be added to ongoing field visits.');
        }

        DB::transaction(function () use ($request, $fieldVisitId) {
            GrowthReport::create(array_merge(
                $request->validated(),
                ['field_visit_ID' => $fieldVisitId]
            ));
        });

        return redirect()
            ->route('field-visits.show', $fieldVisitId)
            ->with('success', 'Growth report added successfully.');
    }

    public function addDamageReport(StoreDamageReportRequest $request, $fieldVisitId)
    {
        $fieldVisit = FieldVisit::findOrFail($fieldVisitId);

        if (method_exists($fieldVisit, 'canAddReports') && ! $fieldVisit->canAddReports()) {
            return back()->with('error', 'Reports can only be added to ongoing field visits.');
        }

        DB::transaction(function () use ($request, $fieldVisitId) {
            DamageReport::create(array_merge(
                $request->validated(),
                ['field_visit_ID' => $fieldVisitId]
            ));
        });

        return redirect()
            ->route('field-visits.show', $fieldVisitId)
            ->with('success', 'Damage report added successfully.');
    }
}