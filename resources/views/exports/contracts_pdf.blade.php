<!-- filepath: resources/views/exports/contracts-pdf.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Contract Directory Report - Vigour Seeds</title>
    <style>
        body { font-family: 'Poppins', Arial, sans-serif; font-size: 11px; color: #333; margin: 0; padding: 20px; background: #fff; }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #37692F; }
        .company-name { color: #37692F; font-size: 28px; font-weight: 800; margin: 0; }
        .report-title { color: #333; font-size: 18px; font-weight: 600; margin: 5px 0 0 0; }
        .report-info { display: flex; justify-content: space-between; margin: 25px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #37692F; }
        .info-item { flex: 1; text-align: center; }
        .info-label { font-size: 10px; color: #666; text-transform: uppercase; margin-bottom: 4px; }
        .info-value { font-size: 14px; font-weight: 600; color: #37692F; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; border-radius: 8px; overflow: hidden; }
        thead { background: #37692F; }
        th { color: #fff; padding: 10px 6px; text-align: left; font-weight: 600; font-size: 9px; text-transform: uppercase; border: none; }
        td { padding: 10px 6px; border-bottom: 1px solid #e9ecef; font-size: 9px; vertical-align: middle; }
        tr:nth-child(even) { background: #f8f9fa; }
        tr:hover { background: #e9ecef; }
        .status-badge { display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 8px; font-weight: 500; min-width: 50px; }
        .status-active { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
        .status-completed { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
        .status-draft, .status-under_review { background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; }
        .status-cancelled { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .status-suspended { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .status-terminated { background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; }
        .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 9px; padding-top: 15px; border-top: 1px solid #e5e7eb; }
        .filters-info { font-size: 9px; color: #6b7280; margin-top: 5px; }
        .summary { margin-top: 30px; padding: 15px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981; }
        .summary-title { font-size: 12px; font-weight: 600; color: #065f46; margin-bottom: 8px; }
        .summary-stats { display: flex; justify-content: space-around; text-align: center; }
        .stat-item { flex: 1; }
        .stat-number { font-size: 16px; font-weight: 700; color: #065f46; }
        .stat-label { font-size: 9px; color: #047857; text-transform: uppercase; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">VIGOUR SEEDS</h1>
        <h2 class="report-title">Contract Directory Report</h2>
    </div>
    <div class="report-info">
        <div class="info-item">
            <div class="info-label">Generated On</div>
            <div class="info-value">{{ $generationDate }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Total Contracts</div>
            <div class="info-value">{{ $contracts->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Active Contracts</div>
            <div class="info-value">{{ $contracts->where('status', 'active')->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Report Type</div>
            <div class="info-value">Contract Directory</div>
        </div>
    </div>
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
                <th>CONTRACT ID</th>
                <th>CONTRACT NAME</th>
                <th>PARTNER</th>
                <th>STATUS</th>
                <th>EFFECTIVE TERM</th>
                <th>SEED COMMITTED</th>
                <th>EXPECTED BUYBACK</th>
                <th>DELIVERED BUYBACK</th>
            </tr>
        </thead>
        <tbody>
            @forelse($contracts as $contract)
            <tr>
                <td>#{{ $contract->id }}</td>
                <td>{{ $contract->contract_name }}</td>
                <td>{{ $contract->partner->name ?? 'N/A' }}</td>
                <td>
                    <span class="status-badge status-{{ $contract->status }}">
                        {{ strtoupper(str_replace('_', ' ', $contract->status)) }}
                    </span>
                </td>
                <td>
                    {{ \Carbon\Carbon::parse($contract->effective_date)->format('M Y') ?? 'N/A' }}
                    -
                    {{ \Carbon\Carbon::parse($contract->expiration_date)->format('M Y') ?? 'N/A' }}
                </td>
                <td>
                    @php
                        $seedNames = $contract->seedCommitments->pluck('seed.seed_variety')->filter()->unique();
                    @endphp
                    {{ $seedNames->count() > 1 ? 'Multiple' : ($seedNames->first() ?? 'N/A') }}
                </td>
                <td>
                    @php
                        $expectedKg = 0;
                        foreach ($contract->seedCommitments as $commitment) {
                            $amount = $commitment->expected_buyback_amount ?? 0;
                            $unit = $commitment->buyback_unit ?? 'kg';
                            if ($unit === 'kg') $expectedKg += $amount;
                            elseif ($unit === 'sack') $expectedKg += $amount * 50;
                            elseif ($unit === 'ton') $expectedKg += $amount * 1000;
                        }
                    @endphp
                    {{ number_format($expectedKg, 2) }} kg
                </td>
                <td>
                    @php
                        $deliveredKg = 0;
                        foreach ($contract->buybackTransactions as $tx) {
                            $qty = $tx->qty ?? 0;
                            $unit = $tx->unit ?? 'kg';
                            if ($unit === 'kg') $deliveredKg += $qty;
                            elseif ($unit === 'sack') $deliveredKg += $qty * 50;
                            elseif ($unit === 'ton') $deliveredKg += $qty * 1000;
                        }
                    @endphp
                    {{ number_format($deliveredKg, 2) }} kg
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="8" style="padding: 20px; text-align: center;">
                    No contracts found.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-title">Contract Summary</div>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">{{ $contracts->count() }}</div>
                <div class="stat-label">Total Contracts</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $contracts->where('status', 'active')->count() }}</div>
                <div class="stat-label">Active</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $contracts->where('status', 'completed')->count() }}</div>
                <div class="stat-label">Completed</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $contracts->whereIn('status', ['draft', 'under_review'])->count() }}</div>
                <div class="stat-label">Draft/Review</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format($contracts->sum('total_expected_buyback'), 2) }}</div>
                <div class="stat-label">Expected Buyback (kg)</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format($contracts->sum('total_delivered_buyback'), 2) }}</div>
                <div class="stat-label">Delivered Buyback (kg)</div>
            </div>
        </div>
    </div>
    <div class="footer">
        <strong>Vigour Seeds - Contract Directory</strong><br>
        This report contains confidential company information. For authorized use only.<br>
        Generated by: {{ $user->first_name ?? 'System' }} {{ $user->last_name ?? '' }} • 
        Page 1 of 1 • 
        Document ID: VS-CONTRACTS-{{ now()->format('Ymd-His') }}
    </div>
</body>
</html>