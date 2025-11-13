<!-- filepath: resources/views/exports/inventory_dashboard_pdf.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Inventory Dashboard Report - Vigour Seeds</title>
    <style>
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
            background: #f8f9fa;
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
            border-radius: 8px;
            overflow: hidden;
        }
        thead {
            background: #37692F;
        }
        th {
            color: #fff;
            padding: 12px 6px;
            text-align: left;
            font-weight: 600;
            font-size: 9px;
            text-transform: uppercase;
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
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 8px;
            font-weight: 500;
            min-width: 50px;
        }
        .status-good {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        .status-low {
            background-color: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
        }
        .status-critical {
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }
        .type-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 10px;
            font-size: 8px;
            font-weight: 500;
        }
        .type-seed {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        .type-fertilizer {
            background-color: #dbeafe;
            color: #1e40af;
            border: 1px solid #bfdbfe;
        }
        .type-pesticide {
            background-color: #e0e7ff;
            color: #5b21b6;
            border: 1px solid #c7d2fe;
        }
        .summary {
            margin-top: 30px;
            padding: 15px;
            background: #f0fdf4;
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
        }
        .shortfall-section {
            margin-top: 30px;
            padding: 15px;
            background: #fef2f2;
            border-radius: 8px;
            border-left: 4px solid #ef4444;
        }
        .shortfall-title {
            font-size: 12px;
            font-weight: 600;
            color: #991b1b;
            margin-bottom: 8px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 9px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">VIGOUR SEEDS</h1>
        <h2 class="report-title">Inventory Dashboard Report</h2>
    </div>
    
    <div class="report-info">
        <div class="info-item">
            <div class="info-label">Generated On</div>
            <div class="info-value">{{ $generationDate }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Total Products</div>
            <div class="info-value">{{ $inventory->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Good Stock</div>
            <div class="info-value">{{ $inventory->where('status', 'good')->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Critical Stock</div>
            <div class="info-value">{{ $inventory->where('status', 'critical')->count() }}</div>
        </div>
    </div>

    @if($shortfalls->count() > 0)
    <div class="shortfall-section">
        <div class="shortfall-title">⚠️ Stock Shortfall Alert ({{ $shortfalls->count() }} items)</div>
        <table style="margin-top: 10px;">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Type</th>
                    <th class="text-right">On Hand</th>
                    <th class="text-right">Committed</th>
                    <th class="text-right">Shortfall</th>
                </tr>
            </thead>
            <tbody>
                @foreach($shortfalls as $item)
                <tr>
                    <td>{{ $item['name'] }}</td>
                    <td><span class="type-badge type-{{ strtolower($item['type']) }}">{{ $item['type'] }}</span></td>
                    <td class="text-right">{{ number_format($item['on_hand'], 2) }} {{ $item['unit'] }}</td>
                    <td class="text-right">{{ number_format($item['committed'], 2) }} {{ $item['unit'] }}</td>
                    <td class="text-right" style="color: #991b1b; font-weight: 600;">{{ number_format($item['shortfall'], 2) }} {{ $item['unit'] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <table>
        <thead>
            <tr>
                <th>Product Name</th>
                <th>Type</th>
                <th class="text-right">Current Stock</th>
                <th class="text-center">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($inventory as $item)
            <tr>
                <td>{{ $item['name'] }}</td>
                <td class="text-center">
                    <span class="type-badge type-{{ strtolower($item['type']) }}">
                        {{ ucfirst($item['type']) }}
                    </span>
                </td>
                <td class="text-right">
                    @if($item['current_stock'] !== null)
                        {{ number_format($item['current_stock'], 2) }} {{ $item['unit'] }}
                    @else
                        -
                    @endif
                </td>
                <td class="text-center">
                    @if($item['status'])
                        <span class="status-badge status-{{ $item['status'] }}">
                            {{ ucfirst($item['status']) }}
                        </span>
                    @else
                        -
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="4" class="text-center" style="padding: 20px;">
                    No inventory items found.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-title">Inventory Summary</div>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">{{ $inventory->count() }}</div>
                <div class="stat-label">Total Items</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $inventory->where('status', 'good')->count() }}</div>
                <div class="stat-label">Good Stock</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $inventory->where('status', 'low')->count() }}</div>
                <div class="stat-label">Low Stock</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $inventory->where('status', 'critical')->count() }}</div>
                <div class="stat-label">Critical Stock</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $inventory->where('type', 'Seed')->count() }}</div>
                <div class="stat-label">Seeds</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $inventory->where('type', 'fertilizer')->count() + $inventory->where('type', 'pesticide')->count() }}</div>
                <div class="stat-label">Items</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <strong>Vigour Seeds - Inventory Dashboard</strong><br>
        This report contains confidential company information. For authorized use only.<br>
        Generated by: {{ $user->first_name ?? 'System' }} {{ $user->last_name ?? '' }} • 
        Page 1 of 1 • 
        Document ID: VS-INVENTORY-{{ now()->format('Ymd-His') }}
    </div>
</body>
</html>