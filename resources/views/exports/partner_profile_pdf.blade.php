<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Partner Profile Report - Vigour Seeds</title>
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
        
        .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #37692F;
            margin-top: 30px;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .kv-table {
            width: 100%;
            margin-bottom: 25px;
            border-collapse: collapse;
        }
        
        .kv-table td {
            padding: 8px 12px;
            font-size: 11px;
            border-bottom: 1px solid #e9ecef;
        }
        
        .kv-table tr:last-child td {
            border-bottom: none;
        }
        
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 500;
            text-align: center;
            min-width: 70px;
        }
        
        .badge-active {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        
        .badge-inactive {
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }
        
        .badge-individual {
            background-color: #3b82f6;
            color: white;
        }
        
        .badge-organization {
            background-color: #8b5cf6;
            color: white;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        
        thead {
            background: linear-gradient(135deg, #37692F 0%, #2a5624 100%);
        }
        
        th {
            color: #fff;
            padding: 12px 10px;
            text-align: left;
            font-weight: 600;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: none;
        }
        
        td {
            padding: 10px;
            border-bottom: 1px solid #e9ecef;
            font-size: 10px;
            vertical-align: middle;
        }
        
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        .contact-name {
            font-weight: 600;
            color: #1f2937;
        }
        
        .farm-name {
            font-weight: 600;
            color: #1f2937;
        }
        
        .notes {
            background: #f8f9fa;
            border-left: 4px solid #37692F;
            padding: 15px;
            margin-top: 10px;
            font-size: 11px;
            border-radius: 6px;
            line-height: 1.5;
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
            margin-bottom: 10px;
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
        
        .partner-header {
            background: linear-gradient(135deg, #37692F 0%, #2a5624 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .partner-main-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .partner-name {
            font-size: 20px;
            font-weight: 700;
            margin: 0;
        }
        
        .partner-id {
            font-size: 14px;
            font-weight: 600;
            background: rgba(255,255,255,0.2);
            padding: 4px 12px;
            border-radius: 15px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">VIGOUR SEEDS</h1>
        <h2 class="report-title">Partner Profile Report</h2>
    </div>

    <div class="report-info">
        <div class="info-item">
            <div class="info-label">Generated On</div>
            <div class="info-value">{{ now()->format('F d, Y - h:i A') }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Report Type</div>
            <div class="info-value">Partner Profile</div>
        </div>
        <div class="info-item">
            <div class="info-label">Total Contacts</div>
            <div class="info-value">{{ $contacts->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Total Farms</div>
            <div class="info-value">{{ $farms->count() }}</div>
        </div>
    </div>

    <!-- Partner Header -->
    <div class="partner-header">
        <div class="partner-main-info">
            <div>
                <h1 class="partner-name">{{ $partner->name }}</h1>
                <div style="font-size: 12px; opacity: 0.9;">
                    {{ $partner->partner_type === 'organization' ? 'Organization Partner' : 'Individual Partner' }}
                </div>
            </div>
            <div class="partner-id">Partner #{{ $partner->id }}</div>
        </div>
    </div>

    <!-- Basic Information -->
    <div class="section-title">Basic Information</div>
    <table class="kv-table">
        <tr>
            <td style="width: 20%; font-weight: 600;">Partner Name</td>
            <td style="width: 30%">{{ $partner->name }}</td>
            <td style="width: 20%; font-weight: 600;">Partner Type</td>
            <td style="width: 30%">
                <span class="badge badge-{{ $partner->partner_type }}">
                    {{ ucfirst($partner->partner_type) }}
                </span>
            </td>
        </tr>
        <tr>
            <td style="font-weight: 600;">Status</td>
            <td>
                <span class="badge badge-{{ $partner->status }}">
                    {{ ucfirst($partner->status) }}
                </span>
            </td>
            <td style="font-weight: 600;">Partner Since</td>
            <td>{{ \Carbon\Carbon::parse($partner->created_at)->format('F d, Y') }}</td>
        </tr>
        <tr>
            <td style="font-weight: 600;">Email Address</td>
            <td>{{ $partner->email ?? 'N/A' }}</td>
            <td style="font-weight: 600;">Phone Number</td>
            <td>{{ $partner->phone ?? 'N/A' }}</td>
        </tr>
        <tr>
            <td style="font-weight: 600;">Main Address</td>
            <td colspan="3">{{ $partner->address ?? 'N/A' }}</td>
        </tr>
        @if($partner->partner_type === 'organization')
        <tr>
            <td style="font-weight: 600;">Registration Number</td>
            <td>{{ $partner->registration_number ?? 'N/A' }}</td>
            <td style="font-weight: 600;">Tax ID</td>
            <td>{{ $partner->tax_id ?? 'N/A' }}</td>
        </tr>
        @endif
    </table>

    <!-- Contact Persons -->
    <div class="section-title">Contact Persons ({{ $contacts->count() }})</div>
    @if($contacts->count() > 0)
    <table>
        <thead>
            <tr>
                <th style="width: 25%">Contact Name</th>
                <th style="width: 30%">Email Address</th>
                <th style="width: 25%">Phone Number</th>
                <th style="width: 20%">Position</th>
            </tr>
        </thead>
        <tbody>
            @foreach($contacts as $contact)
            <tr>
                <td>
                    <div class="contact-name">{{ $contact->name }}</div>
                </td>
                <td>{{ $contact->email ?? 'N/A' }}</td>
                <td>{{ $contact->phone_number ?? 'N/A' }}</td>
                <td>{{ $contact->position ?? 'Contact' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <div style="text-align: center; padding: 20px; color: #6b7280; font-style: italic; background: #f8f9fa; border-radius: 6px;">
        No contact persons registered for this partner.
    </div>
    @endif

    <!-- Registered Farms -->
    <div class="section-title">Registered Farms ({{ $farms->count() }})</div>
    @if($farms->count() > 0)
    <table>
        <thead>
            <tr>
                <th style="width: 20%">Farm Name</th>
                <th style="width: 30%">Address</th>
                <th style="width: 15%">Area Size</th>
                <th style="width: 15%">Soil Type</th>
                <th style="width: 20%">Coordinates</th>
            </tr>
        </thead>
        <tbody>
            @foreach($farms as $farm)
            <tr>
                <td>
                    <div class="farm-name">{{ $farm->location_name ?? 'Unnamed Farm' }}</div>
                </td>
                <td>{{ $farm->address ?? 'N/A' }}</td>
                <td>{{ number_format($farm->area_size, 2) }} hectares</td>
                <td>
                    @if($farm->soil_type)
                    <span style="text-transform: capitalize;">{{ $farm->soil_type }}</span>
                    @else
                    N/A
                    @endif
                </td>
                <td>
                    @if($farm->latitude && $farm->longitude)
                    {{ number_format($farm->latitude, 4) }}, {{ number_format($farm->longitude, 4) }}
                    @else
                    N/A
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <div style="text-align: center; padding: 20px; color: #6b7280; font-style: italic; background: #f8f9fa; border-radius: 6px;">
        No farms registered for this partner.
    </div>
    @endif

    <!-- Farm Summary -->
    @if($farms->count() > 0)
    <div class="summary">
        <div class="summary-title">Farm Summary</div>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">{{ $farms->count() }}</div>
                <div class="stat-label">Total Farms</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format($farms->sum('area_size'), 2) }} ha</div>
                <div class="stat-label">Total Area</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format($farms->avg('area_size'), 2) }} ha</div>
                <div class="stat-label">Average Size</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">
                    @php
                        $soilTypes = $farms->pluck('soil_type')->filter()->unique()->count();
                    @endphp
                    {{ $soilTypes }}
                </div>
                <div class="stat-label">Soil Types</div>
            </div>
        </div>
    </div>
    @endif

    <!-- Notes & Observations -->
    @if($partner->notes)
    <div class="section-title">Notes & Observations</div>
    <div class="notes">
        {{ $partner->notes }}
    </div>
    @endif

    <div class="footer">
        <strong>Vigour Seeds - Partner Management System</strong><br>
        This report contains confidential partner information. For authorized use only.<br>
        Generated by: {{ $user->first_name ?? 'System' }} {{ $user->last_name ?? '' }} • 
        Document ID: VS-PARTNER-{{ $partner->id }}-{{ now()->format('Ymd-His') }}
    </div>
</body>
</html>