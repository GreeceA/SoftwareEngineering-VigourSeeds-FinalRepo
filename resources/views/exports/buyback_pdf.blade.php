<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Buyback Overview - Vigour Seeds</title>
    <style>
        body { font-family: 'Poppins', Arial, sans-serif; font-size: 11px; color: #333; margin: 0; padding: 20px; background: #fff; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #37692F; padding-bottom: 20px; }
        .company-name { color: #37692F; font-size: 28px; font-weight: 800; margin: 0; }
        .report-title { color: #333; font-size: 18px; font-weight: 600; margin: 5px 0 0 0; }
        .summary-cards { display: flex; gap: 24px; margin: 30px 0; }
        .card { flex: 1; background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.07); padding: 18px; border-left: 4px solid #37692F; }
        .card-title { font-size: 12px; color: #666; margin-bottom: 6px; }
        .card-value { font-size: 22px; font-weight: 700; color: #37692F; }
        .card-unit { font-size: 10px; color: #888; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 25px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
        thead { background: #37692F; color: #fff; }
        th, td { padding: 10px 6px; font-size: 10px; }
        th { font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        tr:nth-child(even) { background-color: #f8f9fa; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .progress-bar { background: #e5e7eb; border-radius: 8px; height: 8px; width: 100px; display: inline-block; vertical-align: middle; margin-right: 6px; }
        .progress-fill { height: 8px; border-radius: 8px; display: inline-block; }
        .status-pill { padding: 3px 10px; border-radius: 12px; font-size: 10px; font-weight: 600; display: inline-block; }
        .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 9px; padding-top: 15px; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">VIGOUR SEEDS</h1>
        <h2 class="report-title">Buyback Overview</h2>
        <div style="font-size:12px; color:#666; margin-top:8px;">
            Generated On: {{ $generationDate }}<br>
            Total Contracts: {{ $contracts->count() }}
        </div>
    </div>
    <div class="summary-cards">
        <div class="card" style="border-left-color:#3b82f6;">
            <div class="card-title">Total Expected</div>
            <div class="card-value">{{ number_format($totalExpected, 2) }}</div>
            <div class="card-unit">kg</div>
        </div>
        <div class="card" style="border-left-color:#10b981;">
            <div class="card-title">Total Received</div>
            <div class="card-value">{{ number_format($totalActual, 2) }}</div>
            <div class="card-unit">kg</div>
        </div>
        <div class="card" style="border-left-color:#f59e42;">
            <div class="card-title">Remaining</div>
            <div class="card-value">{{ number_format($totalRemaining, 2) }}</div>
            <div class="card-unit">kg</div>
        </div>
        <div class="card" style="border-left-color:#8b5cf6;">
            <div class="card-title">Fulfillment Rate</div>
            <div class="card-value">{{ $totalExpected > 0 ? number_format($overallFulfillment, 1) : '-' }}%</div>
        </div>
    </div>
    <table>
        <thead>
            <tr>
                <th>Contract</th>
                <th>Partner & Farm</th>
                <th>Expected</th>
                <th>Received</th>
                <th>Remaining</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Buyback Price</th>
            </tr>
        </thead>
        <tbody>
            @forelse($contracts as $contract)
            @php
                $expectedValue = $contract->expected_kg * $contract->buyback_price;
                $fulfillment = $contract->expected_kg > 0 ? ($contract->actual_kg / $contract->expected_kg) * 100 : 0;
                $statusColor = $contract->status === 'active' ? '#10b981'
                    : ($contract->status === 'terminated' ? '#ef4444'
                    : ($contract->status === 'suspended' ? '#f59e42'
                    : ($contract->status === 'completed' ? '#3b82f6' : '#6b7280')));
                $statusLabel = ucfirst($contract->status);
            @endphp
            <tr>
                <td>
                    <strong>{{ $contract->contract_number }}-{{ $contract->id }}</strong><br>
                    <span style="font-size:9px;">Php {{ number_format($contract->buyback_price, 2) }}/kg</span>
                </td>
                <td>
                    <strong>{{ $contract->partner_name }}</strong><br>
                    <span style="font-size:9px;">{{ $contract->farm_name }}</span>
                </td>
                <td>
                    {{ number_format($contract->expected_buyback_amount, 2) }} {{ $contract->buyback_unit }}<br>
                    <span style="font-size:9px;">-> {{ number_format($contract->expected_kg, 2) }} kg</span><br>
                    <span style="font-size:9px;">-> Php {{ number_format($expectedValue, 2) }}</span>
                </td>
                <td>
                    <span style="color:#10b981; font-weight:600;">{{ number_format($contract->actual_kg, 2) }} kg</span>
                </td>
                <td>
                    <span style="color:#f59e42; font-weight:600;">{{ number_format($contract->remaining_kg, 2) }} kg</span>
                </td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="background:{{ $fulfillment >= 100 ? '#10b981' : ($fulfillment >= 75 ? '#3b82f6' : ($fulfillment >= 50 ? '#f59e42' : '#ef4444')) }}; width:{{ min($fulfillment,100) }}%;"></div>
                    </div>
                    <span style="font-size:10px; font-weight:600;">{{ number_format($fulfillment, 0) }}%</span>
                </td>
                <td>
                    <span class="status-pill" style="background:{{ $statusColor }}; color:#fff;">{{ $statusLabel }}</span>
                </td>
                <td>
                    Php {{ number_format($contract->buyback_price, 2) }}/kg
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="8" class="text-center" style="padding: 20px;">No Contracts Found</td>
            </tr>
            @endforelse
        </tbody>
    </table>
    <div class="footer">
        <strong>Vigour Seeds - Buyback Ledger</strong><br>
        This report contains confidential company information. For authorized use only.<br>
        Generated by: {{ $user->first_name ?? 'System' }} {{ $user->last_name ?? '' }} • 
        Document ID: VS-BUYBACK-{{ now()->format('Ymd-His') }}
    </div>
</body>
</html>