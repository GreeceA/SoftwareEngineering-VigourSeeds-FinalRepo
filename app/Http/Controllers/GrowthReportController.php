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

        // Check if field visit is still ongoing
        $fieldVisit = $report->fieldVisit;
        if ($fieldVisit->status !== 'ongoing') {
            return back()->with('error', 'Cannot edit reports from completed or cancelled field visits.');
        }

        $report->update($request->validated());

        // Check if request is from the report show page or field visit show page
        $referer = $request->headers->get('referer');

        // If coming from growth-reports.show, stay on that page
        if (str_contains($referer, 'growth-reports/' . $id)) {
            return redirect()
                ->route('growth-reports.show', $id)
                ->with('success', 'Growth report updated successfully.');
        }

        // Otherwise, go back to field visit show page (default behavior)
        return redirect()
            ->route('field-visits.show', $report->field_visit_ID)
            ->with('success', 'Growth report updated successfully.');
    }

    public function destroy($id)
    {
        $growthReport = GrowthReport::findOrFail($id);
        $fieldVisitId = $growthReport->field_visit_ID;

        // Check if field visit is still ongoing
        $fieldVisit = $growthReport->fieldVisit;
        if ($fieldVisit->status !== 'ongoing') {
            return back()->with('error', 'Cannot delete reports from completed or cancelled field visits.');
        }

        $growthReport->delete();

        return redirect()
            ->route('field-visits.show', $fieldVisitId)
            ->with('success', 'Growth report deleted successfully.');
    }
}