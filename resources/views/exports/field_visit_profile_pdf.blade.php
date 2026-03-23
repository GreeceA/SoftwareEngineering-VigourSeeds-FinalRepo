<!-- filepath: resources/views/exports/field_visit_profile_pdf.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Field Visit Report - Vigour Seeds</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
        body { font-family: 'Poppins', Arial, sans-serif; font-size: 11px; color: #333; margin: 0; padding: 20px; background: #fff; }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #37692F; }
        .company-name { color: #37692F; font-size: 28px; font-weight: 800; margin: 0; }
        .report-title { color: #333; font-size: 18px; font-weight: 600; margin: 5px 0 0 0; }
        .info-box { display: flex; justify-content: space-between; margin: 25px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #37692F; }
        .info-item { flex: 1; text-align: center; }
        .info-label { font-size: 10px; color: #666; text-transform: uppercase; margin-bottom: 4px; }
        .info-value { font-size: 14px; font-weight: 600; color: #37692F; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 10px; font-weight: 500; }
        .badge-ongoing { background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd; }
        .badge-completed { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
        .badge-cancelled { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .section-title { font-size: 16px; font-weight: 700; color: #37692F; margin-top: 30px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }
        .kv-table { width: 100%; margin-bottom: 25px; border-collapse: collapse; }
        .kv-table td { padding: 8px 12px; font-size: 11px; border-bottom: 1px solid #e9ecef; }
        .kv-table tr:last-child td { border-bottom: none; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
        thead { background: #37692F; color: #fff; }
        th, td { padding: 8px 6px; font-size: 10px; border-bottom: 1px solid #e9ecef; }
        th { font-weight: 600; }
        tr:nth-child(even) { background-color: #f8f9fa; }
        .notes { background: #f8f9fa; border-left: 4px solid #37692F; padding: 15px; margin-top: 10px; font-size: 11px; border-radius: 6px; line-height: 1.5; }
        .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 9px; padding-top: 15px; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">VIGOUR SEEDS</h1>
        <h2 class="report-title">Field Visit Report</h2>
        <div style="margin-top: 8px; font-size: 13px; font-weight: 600; color: #37692F;">
            Visit #{{ $visit->field_visit_ID }}
        </div>
    </div>

    <div class="info-box">
        <div class="info-item">
            <div class="info-label">Visit Date</div>
            <div class="info-value">{{ \Carbon\Carbon::parse($visit->date_visit)->format('M d, Y') }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Visit Status</div>
            <div class="info-value">
                <span class="badge badge-{{ $visit->status }}">
                    {{ ucfirst($visit->status) }}
                </span>
            </div>
        </div>
        <div class="info-item">
            <div class="info-label">Growth Reports</div>
            <div class="info-value">{{ $visit->growthReports->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Damage Reports</div>
            <div class="info-value">{{ $visit->damageReports->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Generated On</div>
            <div class="info-value">{{ now()->format('F d, Y - h:i A') }}</div>
        </div>
    </div>

    <div class="section-title">Visit Details</div>
    <table class="kv-table">
        <tr>
            <td style="width: 20%; font-weight: 600;">Visit ID</td>
            <td style="width: 30%">#{{ $visit->field_visit_ID }}</td>
            <td style="width: 20%; font-weight: 600;">Visit Date</td>
            <td style="width: 30%">{{ \Carbon\Carbon::parse($visit->date_visit)->format('F d, Y') }}</td>
        </tr>
        <tr>
            <td style="font-weight: 600;">Status</td>
            <td>
                <span class="badge badge-{{ $visit->status }}">
                    {{ ucfirst($visit->status) }}
                </span>
            </td>
            <td style="font-weight: 600;">Technician</td>
            <td>{{ $visit->user->first_name ?? 'N/A' }} {{ $visit->user->last_name ?? '' }}</td>
        </tr>
        <tr>
            <td style="font-weight: 600;">Contract</td>
            <td>{{ $visit->contract->contract_name ?? 'N/A' }}</td>
            <td style="font-weight: 600;">Partner</td>
            <td>{{ $visit->contract->partner->name ?? 'N/A' }}</td>
        </tr>
        <tr>
            <td style="font-weight: 600;">Farm Visited</td>
            <td>{{ $visit->farm->location_name ?? 'N/A' }}</td>
            <td style="font-weight: 600;">Farm Address</td>
            <td>{{ $visit->farm->address ?? 'N/A' }}</td>
        </tr>
    </table>

    <div class="section-title">Growth & Development Report</div>
    <table>
        <thead>
            <tr>
                <th>Growth Stage</th>
                <th>Observed Status</th>
                <th>Technician's Notes</th>
            </tr>
        </thead>
        <tbody>
            @forelse($visit->growthReports as $report)
            <tr>
                <td>{{ $report->stage }}</td>
                <td>{{ ucfirst($report->status) }}</td>
                <td>{{ $report->notes }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="3" style="text-align: center; padding: 20px; color: #6b7280;">
                    No growth reports filed for this visit.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="section-title">Pest & Damage Report</div>
    <table>
        <thead>
            <tr>
                <th>Growth Stage</th>
                <th>Damage Type</th>
                <th>Severity</th>
                <th>Technician's Notes</th>
            </tr>
        </thead>
        <tbody>
            @forelse($visit->damageReports as $report)
            <tr>
                <td>{{ $report->stage }}</td>
                <td>{{ $report->type_damage }}</td>
                <td>{{ ucfirst($report->severity_damage) }}</td>
                <td>{{ $report->notes }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="4" style="text-align: center; padding: 20px; color: #6b7280;">
                    No damage reports filed for this visit.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="section-title">Technician's Overall Remarks</div>
    <div class="notes">
        {{ $visit->remarks ?? 'No remarks provided.' }}
    </div>

    <div class="footer">
        <strong>Vigour Seeds - Field Visit System</strong><br>
        This report contains confidential company information. For authorized use only.<br>
        Generated by: {{ auth()->user()->first_name ?? 'System' }} {{ auth()->user()->last_name ?? '' }}<br>
        Document ID: VS-FV-{{ $visit->field_visit_ID }}-{{ now()->format('Ymd') }}
    </div>
</body>
</html>