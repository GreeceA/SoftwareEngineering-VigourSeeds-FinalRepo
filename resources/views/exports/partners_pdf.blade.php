<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Partner Directory - Vigour Seeds</title>
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
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: none;
        }
        td {
            padding: 10px 8px;
            border-bottom: 1px solid #e9ecef;
            font-size: 10px;
            vertical-align: middle;
        }
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        tr:hover {
            background-color: #e9ecef;
        }
        .partner-name {
            font-weight: 600;
            color: #1f2937;
        }
        .partner-email {
            color: #6b7280;
            font-size: 9px;
        }
        .type-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: 500;
            text-align: center;
            min-width: 60px;
        }
        .type-individual {
            background-color: #3b82f6;
            color: white;
        }
        .type-organization {
            background-color: #8b5cf6;
            color: white;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: 500;
            text-align: center;
            min-width: 55px;
        }
        .status-active {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        .status-inactive {
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
            font-size: 18px;
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
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">VIGOUR SEEDS</h1>
        <h2 class="report-title">Partner Directory Report</h2>
    </div>
    <div class="report-info">
        <div class="info-item">
            <div class="info-label">Generated On</div>
            <div class="info-value">{{ now()->format('F d, Y - h:i A') }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Total Partners</div>
            <div class="info-value">{{ $partners->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Active Partners</div>
            <div class="info-value">{{ $partners->where('status', 'active')->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Report Type</div>
            <div class="info-value">Partner Directory</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 12%; text-align: center;">Partner ID</th>
                <th style="width: 20%">Partner Name</th>
                <th style="width: 20%">Partner Email</th>
                <th style="width: 14%">Type</th>
                <th style="width: 14%">Status</th>
                <th style="width: 10%">Total Farms</th>
                <th style="width: 10%">Partner Since</th>
            </tr>
        </thead>
        <tbody>
            @foreach($partners as $partner)
            <tr>
                <td class="text-center">#{{ $partner->id }}</td>
                <td>
                    <div class="partner-name">{{ $partner->name }}</div>
                </td>
                <td>
                    <div class="partner-email">{{ $partner->email }}</div>
                </td>
                <td>
                    <span class="type-badge type-{{ $partner->partner_type }}">
                        {{ ucfirst($partner->partner_type) }}
                    </span>
                </td>
                <td>
                    <span class="status-badge status-{{ $partner->status }}">
                        {{ ucfirst($partner->status) }}
                    </span>
                </td>
                <td>
                    {{ \App\Models\PartnerFarm::where('partner_id', $partner->id)->count() }}
                </td>
                <td>
                    {{ \Carbon\Carbon::parse($partner->created_at)->format('M d, Y') }}
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-title">Partner Summary</div>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">{{ $partners->count() }}</div>
                <div class="stat-label">Total Partners</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $partners->where('status', 'active')->count() }}</div>
                <div class="stat-label">Active</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $partners->where('status', 'inactive')->count() }}</div>
                <div class="stat-label">Inactive</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $partners->where('partner_type', 'individual')->count() }}</div>
                <div class="stat-label">Individuals</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $partners->where('partner_type', 'organization')->count() }}</div>
                <div class="stat-label">Organizations</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <strong>Vigour Seeds - Partner Directory</strong><br>
        This report contains confidential partner information. For authorized use only.<br>
        Generated by: {{ auth()->user()->first_name ?? 'System' }} {{ auth()->user()->last_name ?? '' }} • 
        Page 1 of 1 • 
        Document ID: VS-PARTNER-{{ now()->format('Ymd-His') }}
    </div>
</body>
</html>