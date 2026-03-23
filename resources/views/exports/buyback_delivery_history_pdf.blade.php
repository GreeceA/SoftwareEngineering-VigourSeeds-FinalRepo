<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Buyback Delivery Transaction History - Vigour Seeds</title>
    <style>
        body { font-family: 'Poppins', Arial, sans-serif; font-size: 11px; color: #333; margin: 0; padding: 20px; background: #fff; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #37692F; padding-bottom: 20px; }
        .company-name { color: #37692F; font-size: 28px; font-weight: 800; margin: 0; }
        .report-title { color: #333; font-size: 18px; font-weight: 600; margin: 5px 0 0 0; }
        .info { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #37692F; }
        .info-row { display: flex; flex-wrap: wrap; gap: 24px; }
        .info-block { flex: 1; min-width: 180px; }
        .info-label { font-size: 10px; color: #666; text-transform: uppercase; margin-bottom: 4px; }
        .info-value { font-size: 14px; font-weight: 600; color: #37692F; }
        .section-title { font-size: 16px; font-weight: 700; color: #37692F; margin-top: 30px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 25px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
        thead { background: #37692F; color: #fff; }
        th, td { padding: 10px 6px; font-size: 10px; }
        th { font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        tr:nth-child(even) { background-color: #f8f9fa; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .summary { margin-top: 0; margin-bottom: 25px; padding: 15px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #10b981; }
        .summary-title { font-size: 12px; font-weight: 600; color: #065f46; margin-bottom: 10px; }
        .summary-stats { display: flex; justify-content: space-around; text-align: center; }
        .stat-item { flex: 1; }
        .stat-number { font-size: 18px; font-weight: 700; color: #065f46; }
        .stat-label { font-size: 9px; color: #047857; text-transform: uppercase; letter-spacing: 0.5px; }
        .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 9px; padding-top: 15px; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">VIGOUR SEEDS</h1>
        <h2 class="report-title">Buyback Delivery Transaction History</h2>
    </div>
    <div class="info">
        <div class="info-row">
            <div class="info-block">
                <div class="info-label">Generated On</div>
                <div class="info-value">{{ $generationDate }}</div>
            </div>
            <div class="info-block">
                <div class="info-label">Contract</div>
                <div class="info-value">{{ $contractNumber }}</div>
            </div>
            <div class="info-block">
                <div class="info-label">Partner</div>
                <div class="info-value">{{ $partnerName }}</div>
            </div>
            <div class="info-block">
                <div class="info-label">Farm</div>
                <div class="info-value">{{ $farmName }}</div>
            </div>
            <div class="info-block">
                <div class="info-label">Fulfillment</div>
                <div class="info-value">{{ number_format($fulfillmentPercentage, 1) }}%</div>
            </div>
        </div>
    </div>
    <div class="section-title">Buyback Summary</div>
    <table>
        <thead>
            <tr>
                <th>Expected</th>
                <th>Received</th>
                <th>Remaining</th>
                <th>Buyback Price</th>
                <th>Total Value</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ number_format($expectedTotalKg, 2) }} kg</td>
                <td>{{ number_format($actualTotalKg, 2) }} kg</td>
                <td>{{ number_format($remainingKg, 2) }} kg</td>
                <td>Php {{ number_format($buybackPrice, 2) }}/kg</td>
                <td>Php {{ number_format($totalValue, 2) }}</td>
            </tr>
        </tbody>
    </table>
    <div class="section-title">Delivery Transaction History ({{ count($transactions) }} records)</div>
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Value</th>
                <th>Delivered By</th>
                <th>Notes</th>
            </tr>
        </thead>
        <tbody>
            @forelse($transactions as $txn)
            <tr>
                <td>{{ \Carbon\Carbon::parse($txn['delivery_date'])->format('M d, Y') }}</td>
                <td>{{ $txn['corn_product_name'] }}</td>
                <td class="text-right">{{ number_format($txn['qty'], 2) }} {{ $txn['unit'] }}</td>
                <td class="text-right">Php {{ number_format($txn['total_value'], 2) }}</td>
                <td>{{ $txn['created_by'] }}</td>
                <td>{{ $txn['notes'] ?? '-' }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="6" class="text-center" style="padding: 20px;">No delivery transactions found.</td>
            </tr>
            @endforelse
        </tbody>
    </table>
    <div class="summary">
        <div class="summary-title">Transaction Summary</div>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">{{ count($transactions) }}</div>
                <div class="stat-label">Total Deliveries</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format($actualTotalKg, 2) }} kg</div>
                <div class="stat-label">Total Delivered</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">Php {{ number_format($totalValue, 2) }}</div>
                <div class="stat-label">Total Value</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format($fulfillmentPercentage, 1) }}%</div>
                <div class="stat-label">Fulfillment Rate</div>
            </div>
        </div>
    </div>
    <div class="footer">
        <strong>Vigour Seeds - Buyback Delivery Management</strong><br>
        This report contains confidential transaction information. For authorized use only.<br>
        Generated by: {{ $user->first_name ?? 'System' }} {{ $user->last_name ?? '' }} • 
        Document ID: VS-BUYBACK-DELIVERY-{{ $contractId }}-{{ now()->format('Ymd-His') }}
    </div>
</body>
</html>