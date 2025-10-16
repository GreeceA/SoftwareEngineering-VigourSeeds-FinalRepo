<?php

namespace App\Http\Controllers;

use App\Models\DamageReport;
use App\Http\Requests\UpdateDamageReportRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DamageReportController extends Controller
{
    public function index(Request $request)
    {
        $query = DamageReport::with(['fieldVisit.contract', 'fieldVisit.farm']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('notes', 'like', "%{$search}%");
        }

        $reports = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Reports/Index', [
            'reports' => $reports,
            'reportType' => 'damage',
            'filters' => $request->only(['search']),
        ]);
    }

    public function show($id)
    {
        $report = DamageReport::with([
            'fieldVisit.contract',
            'fieldVisit.farm',
            'fieldVisit.assignee'
        ])->findOrFail($id);

        return Inertia::render('Reports/Show', [
            'report' => $report,
            'reportType' => 'damage',
        ]);
    }

    public function edit($id)
    {
        $report = DamageReport::with('fieldVisit')->findOrFail($id);

        return Inertia::render('Reports/Edit', [
            'report' => $report,
            'reportType' => 'damage',
        ]);
    }

    public function update(UpdateDamageReportRequest $request, $id)
    {
        $report = DamageReport::findOrFail($id);
        $report->update($request->validated());

        return redirect()
            ->route('damage-reports.show', $id)
            ->with('success', 'Damage report updated successfully.');
    }

    public function destroy($id)
    {
        $report = DamageReport::findOrFail($id);
        $fieldVisitId = $report->field_visit_ID;
        $report->delete();

        return redirect()
            ->route('field-visits.show', $fieldVisitId)
            ->with('success', 'Damage report deleted successfully.');
    }
}