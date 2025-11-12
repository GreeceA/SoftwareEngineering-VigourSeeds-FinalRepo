<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Item Information Report - Vigour Seeds</title>
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
        .item-name {
            font-weight: 600;
            color: #1f2937;
        }
        .item-description {
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
        .status-active {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        .status-archived {
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
            text-align: center;
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
        .type-equipment {
            background-color: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
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
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">VIGOUR SEEDS</h1>
        <h2 class="report-title">Item Information Report</h2>
    </div>
    
    <div class="report-info">
        <div class="info-item">
            <div class="info-label">Generated On</div>
            <div class="info-value">{{ now()->format('F d, Y - h:i A') }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Total Items</div>
            <div class="info-value">{{ $items->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Active Items</div>
            <div class="info-value">{{ $items->where('status', 'active')->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Report Type</div>
            <div class="info-value">Item Directory</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 5%;" class="text-center">ID</th>
                <th style="width: 18%;">Item Details</th>
                <th style="width: 8%;">Type</th>
                <th style="width: 8%;">Status</th>
                <th style="width: 10%;" class="text-right">Stock on Hand</th>
                <th style="width: 10%;" class="text-right">Price</th>
                <th style="width: 10%;">Date Added</th>
                <th style="width: 8%;" class="text-center">Pending Orders</th>
            </tr>
        </thead>
        <tbody>
            @forelse($items as $item)
            <tr>
                <td class="text-center">#{{ $item->id }}</td>
                
                <td>
                    <div class="item-name">{{ $item->name }}</div>
                    <div class="item-description">
                        {{ $item->description ?? 'No description available' }}
                    </div>
                </td>
                
                <td class="text-center">
                    <span class="type-badge type-{{ $item->type }}">
                        {{ ucfirst($item->type) }}
                    </span>
                </td>
                
                <td>
                    <span class="status-badge status-{{ $item->status }}">
                        {{ ucfirst($item->status) }}
                    </span>
                </td>
                
                <td class="text-right">
                    {{ number_format($item->stock_on_hand ?? 0, 2) }} {{ $item->base_unit }}
                </td>
                
                <td class="text-right">
                    Php {{ number_format($item->price_per_unit, 2) }} / {{ $item->base_unit }}
                </td>
                
                <td>
                    {{ \Carbon\Carbon::parse($item->created_at)->format('M d, Y') }}
                </td>

                <td class="text-center">
                    {{ $item->pending_orders_count }}
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="8" class="text-center" style="padding: 20px;">
                    No items found.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-title">Item Summary</div>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">{{ $items->count() }}</div>
                <div class="stat-label">Total Items</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $items->where('status', 'active')->count() }}</div>
                <div class="stat-label">Active</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $items->where('status', 'archived')->count() }}</div>
                <div class="stat-label">Archived</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $items->where('type', 'fertilizer')->count() }}</div>
                <div class="stat-label">Fertilizers</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $items->where('type', 'pesticide')->count() }}</div>
                <div class="stat-label">Pesticides</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">
                    Php {{ number_format($totalStockValue, 2) }}
                </div>
                <div class="stat-label">Total Stock Value</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <strong>Vigour Seeds - Item Directory</strong><br>
        This report contains confidential company information. For authorized use only.<br>
        Generated by: {{ auth()->user()->first_name ?? 'System' }} {{ auth()->user()->last_name ?? '' }} • 
        Page 1 of 1 • 
        Document ID: VS-ITEM-{{ now()->format('Ymd-His') }}
    </div>
</body>
</html>