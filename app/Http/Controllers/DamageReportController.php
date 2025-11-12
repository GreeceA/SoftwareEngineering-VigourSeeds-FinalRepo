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
        
        // Check if field visit is still ongoing
        $fieldVisit = $report->fieldVisit;
        if ($fieldVisit->status !== 'ongoing') {
            return back()->with('error', 'Cannot edit reports from completed or cancelled field visits.');
        }
        
        $report->update($request->validated());

        // Check if request is from the report show page or field visit show page
        $referer = $request->headers->get('referer');
        
        // If coming from damage-reports.show, stay on that page
        if (str_contains($referer, 'damage-reports/' . $id)) {
            return redirect()
                ->route('damage-reports.show', $id)
                ->with('success', 'Damage report updated successfully.');
        }
        
        // Otherwise, go back to field visit show page (default behavior)
        return redirect()
            ->route('field-visits.show', $report->field_visit_ID)
            ->with('success', 'Damage report updated successfully.');
    }

    public function destroy($id)
    {
        $damageReport = DamageReport::findOrFail($id);
        $fieldVisitId = $damageReport->field_visit_ID;
        
        // Check if field visit is still ongoing
        $fieldVisit = $damageReport->fieldVisit;
        if ($fieldVisit->status !== 'ongoing') {
            return back()->with('error', 'Cannot delete reports from completed or cancelled field visits.');
        }
        
        $damageReport->delete();
        
        return redirect()
            ->route('field-visits.show', $fieldVisitId)
            ->with('success', 'Damage report deleted successfully.');
    }
}