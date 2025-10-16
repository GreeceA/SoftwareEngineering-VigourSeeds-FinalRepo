<?php

namespace App\Http\Controllers;

use App\Models\GrowthReport;
use App\Http\Requests\UpdateGrowthReportRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GrowthReportController extends Controller
{
    public function index(Request $request)
    {
        $query = GrowthReport::with(['fieldVisit.contract', 'fieldVisit.farm']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('notes', 'like', "%{$search}%");
        }

        $reports = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Reports/Index', [
            'reports' => $reports,
            'reportType' => 'growth',
            'filters' => $request->only(['search']),
        ]);
    }

    public function show($id)
    {
        $report = GrowthReport::with([
            'fieldVisit.contract',
            'fieldVisit.farm',
            'fieldVisit.assignee'
        ])->findOrFail($id);

        return Inertia::render('Reports/Show', [
            'report' => $report,
            'reportType' => 'growth',
        ]);
    }

    public function edit($id)
    {
        $report = GrowthReport::with('fieldVisit')->findOrFail($id);

        return Inertia::render('Reports/Edit', [
            'report' => $report,
            'reportType' => 'growth',
        ]);
    }

    public function update(UpdateGrowthReportRequest $request, $id)
    {
        $report = GrowthReport::findOrFail($id);
        $report->update($request->validated());

        return redirect()
            ->route('growth-reports.show', $id)
            ->with('success', 'Growth report updated successfully.');
    }

    public function destroy($id)
    {
        $report = GrowthReport::findOrFail($id);
        $fieldVisitId = $report->field_visit_ID;
        $report->delete();

        return redirect()
            ->route('field-visits.show', $fieldVisitId)
            ->with('success', 'Growth report deleted successfully.');
    }
}