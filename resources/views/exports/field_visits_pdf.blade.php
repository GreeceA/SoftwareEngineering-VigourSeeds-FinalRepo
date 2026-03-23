<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Field Visit Report - Vigour Seeds</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        body {
            font-family: 'Poppins', Arial, sans-serif;
            font-size: 11px;
            color: #333;
            margin: 0;
            padding: 20px;
            background-color: #fff;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #37692F;
        }
        .company-name {
            color: #37692F;
            font-size: 28px;
            font-weight: 800;
            margin: 0;
            letter-spacing: 0.5px;
        }
        .report-title {
            color: #333;
            font-size: 18px;
            font-weight: 600;
            margin: 5px 0 0 0;
        }
        .report-info {
            display: flex;
            justify-content: space-between;
            margin: 25px 0;
            padding: 15px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 8px;
            border-left: 4px solid #37692F;
        }
        .info-item {
            flex: 1;
            text-align: center;
        }
        .info-label {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .info-value {
            font-size: 14px;
            font-weight: 600;
            color: #37692F;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        thead {
            background: linear-gradient(135deg, #37692F 0%, #2a5624 100%);
        }
        th {
            color: #37692F;
            padding: 12px 6px;
            text-align: left;
            font-weight: 600;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: none;
        }
        td {
            padding: 10px 6px;
            border-bottom: 1px solid #e9ecef;
            font-size: 9px;
            vertical-align: middle;
        }
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        tr:hover {
            background-color: #e9ecef;
        }
        .contract-name {
            font-weight: 600;
            color: #1f2937;
        }
        .partner-name {
            color: #6b7280;
            font-size: 8px;
            margin-top: 2px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 8px;
            font-weight: 500;
            text-align: center;
            min-width: 50px;
        }
        .status-ongoing {
            background-color: #dbeafe;
            color: #1e40af;
            border: 1px solid #bfdbfe;
        }
        .status-completed {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        .status-cancelled {
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }
        .summary {
            margin-top: 30px;
            padding: 15px;
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border-radius: 8px;
            border-left: 4px solid #10b981;
        }
        .summary-title {
            font-size: 12px;
            font-weight: 600;
            color: #065f46;
            margin-bottom: 8px;
        }
        .summary-stats {
            display: flex;
            justify-content: space-around;
            text-align: center;
        }
        .stat-item {
            flex: 1;
        }
        .stat-number {
            font-size: 16px;
            font-weight: 700;
            color: #065f46;
        }
        .stat-label {
            font-size: 9px;
            color: #047857;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 9px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
        }
        .text-center { 
            text-align: center; 
        }
        .text-right { 
            text-align: right; 
        }
        .filters-info {
            margin-top: 5px;
            font-size: 9px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">VIGOUR SEEDS</h1>
        <h2 class="report-title">Field Visit Report</h2>
    </div>
    
    <div class="report-info">
        <div class="info-item">
            <div class="info-label">Generated On</div>
            <div class="info-value">{{ $generationDate }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Total Visits</div>
            <div class="info-value">{{ $visits->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Active Visits</div>
            <div class="info-value">{{ $visits->where('status', 'ongoing')->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Report Type</div>
            <div class="info-value">Field Visit Log</div>
        </div>
    </div>

    <!-- Filters Applied Section -->
    @if(collect($filters)->filter()->isNotEmpty())
    <div class="report-info" style="margin-top: -10px;">
        <div class="info-item">
            <div class="info-label">Filters Applied</div>
            <div class="info-value">
                @foreach($filters as $key => $value)
                    @if($value)
                        <div class="filters-info">
                            {{ ucfirst(str_replace('_', ' ', $key)) }}: <strong>{{ $value }}</strong>
                        </div>
                    @endif
                @endforeach
            </div>
        </div>
    </div>
    @endif

    <table>
        <thead>
            <tr>
                <th style="width: 8%;" class="text-center">VISIT ID</th>
                <th style="width: 12%;">VISIT DATE</th>
                <th style="width: 25%;">CONTRACT DETAILS</th>
                <th style="width: 15%;">TECHNICIAN</th>
                <th style="width: 8%;">STATUS</th>
                <th style="width: 8%;" class="text-center">GROWTH REPORTS</th>
                <th style="width: 8%;" class="text-center">DAMAGE REPORTS</th>
            </tr>
        </thead>
        <tbody>
            @forelse($visits as $visit)
            <tr>
                <td class="text-center">#{{ $visit->field_visit_ID }}</td>
                
                <td>
                    {{ \Carbon\Carbon::parse($visit->date_visit)->format('M d, Y') }}
                </td>
                
                <td>
                    <div class="contract-name">{{ $visit->contract->contract_name ?? 'N/A' }}</div>
                    <div class="partner-name">
                        Partner: {{ $visit->contract->partner->name ?? 'N/A' }}
                    </div>
                </td>
                
                <td>
                    {{ $visit->assignee ? $visit->assignee->first_name . ' ' . $visit->assignee->last_name : 'N/A' }}
                </td>
                
                <td>
                    <span class="status-badge status-{{ $visit->status }}">
                        {{ ucfirst($visit->status) }}
                    </span>
                </td>
                
                <td class="text-center">
                    {{ $visit->growth_reports_count }}
                </td>

                <td class="text-center">
                    {{ $visit->damage_reports_count }}
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="7" class="text-center" style="padding: 20px;">
                    No field visits found.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-title">Field Visit Summary</div>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">{{ $visits->count() }}</div>
                <div class="stat-label">Total Visits</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $visits->where('status', 'ongoing')->count() }}</div>
                <div class="stat-label">Ongoing</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $visits->where('status', 'completed')->count() }}</div>
                <div class="stat-label">Completed</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $visits->where('status', 'cancelled')->count() }}</div>
                <div class="stat-label">Cancelled</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $visits->sum('growth_reports_count') }}</div>
                <div class="stat-label">Growth Reports</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $visits->sum('damage_reports_count') }}</div>
                <div class="stat-label">Damage Reports</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <strong>Vigour Seeds - Field Visit Directory</strong><br>
        This report contains confidential company information. For authorized use only.<br>
        Generated by: {{ $user->first_name ?? 'System' }} {{ $user->last_name ?? '' }} • 
        Page 1 of 1 • 
        Document ID: VS-FIELDVISIT-{{ now()->format('Ymd-His') }}
    </div>
</body>
</html>