<!-- filepath: c:\xampp\htdocs\dashboard\SoftwareEngineering-VigourSeeds-FinalRepo\resources\views\exports\partner_orders_pdf.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Partner Orders Report - Vigour Seeds</title>
    <style>
        body {
            font-family: 'Poppins', Arial, sans-serif;
            font-size: 10px;
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
            font-size: 9px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .info-value {
            font-size: 13px;
            font-weight: 600;
            color: #37692F;
        }
        .filters-applied {
            margin: 15px 0;
            padding: 10px;
            background: #e0f2fe;
            border-radius: 6px;
            border-left: 3px solid #0284c7;
        }
        .filter-title {
            font-size: 10px;
            font-weight: 600;
            color: #075985;
            margin-bottom: 5px;
        }
        .filter-item {
            display: inline-block;
            font-size: 9px;
            color: #0c4a6e;
            margin-right: 15px;
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
            padding: 10px 4px;
            text-align: left;
            font-weight: 600;
            font-size: 8px;
            text-transform: uppercase;
            border: none;
        }
        td {
            padding: 8px 4px;
            border-bottom: 1px solid #e9ecef;
            font-size: 8px;
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
            padding: 3px 6px;
            border-radius: 10px;
            font-size: 7px;
            font-weight: 600;
            text-align: center;
            min-width: 55px;
        }
        .status-pending {
            background-color: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
        }
        .status-partially_fulfilled {
            background-color: #dbeafe;
            color: #1e40af;
            border: 1px solid #bfdbfe;
        }
        .status-fulfilled {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        .status-cancelled {
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }
        .contract-badge {
            display: inline-block;
            padding: 2px 5px;
            border-radius: 8px;
            font-size: 7px;
            font-weight: 500;
        }
        .contract-active {
            background-color: #d1fae5;
            color: #065f46;
        }
        .contract-suspended {
            background-color: #fef3c7;
            color: #92400e;
        }
        .contract-terminated {
            background-color: #fee2e2;
            color: #991b1b;
        }
        .contract-completed {
            background-color: #dbeafe;
            color: #1e40af;
        }
        .progress-bar {
            background: #e5e7eb;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-fill {
            background: #10b981;
            height: 100%;
            border-radius: 4px;
        }
        .summary {
            margin-top: 30px;
            padding: 15px;
            background: #f0fdf4;
            border-radius: 8px;
            border-left: 4px solid #10b981;
        }
        .summary-title {
            font-size: 11px;
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
            font-size: 14px;
            font-weight: 700;
            color: #065f46;
        }
        .stat-label {
            font-size: 8px;
            color: #047857;
            text-transform: uppercase;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 8px;
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
        <h2 class="report-title">Partner Orders Report</h2>
    </div>
    
    <div class="report-info">
        <div class="info-item">
            <div class="info-label">Generated On</div>
            <div class="info-value">{{ $generationDate }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Total Orders</div>
            <div class="info-value">{{ $orders->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Pending</div>
            <div class="info-value">{{ $orders->where('status', 'pending')->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Fulfilled</div>
            <div class="info-value">{{ $orders->where('status', 'fulfilled')->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Total Value</div>
            <div class="info-value">Php {{ number_format($totalValue, 2) }}</div>
        </div>
    </div>

    @if($hasFilters)
    <div class="filters-applied">
        <div class="filter-title">📋 Filters Applied:</div>
        @if($filters['status'])
            <span class="filter-item"><strong>Order Status:</strong> {{ ucfirst(str_replace('_', ' ', $filters['status'])) }}</span>
        @endif
        @if($filters['partner_id'])
            <span class="filter-item"><strong>Partner:</strong> {{ $partnerName }}</span>
        @endif
        @if($filters['contract_status'])
            <span class="filter-item"><strong>Contract Status:</strong> {{ ucfirst($filters['contract_status']) }}</span>
        @endif
    </div>
    @endif

    <table>
        <thead>
            <tr>
                <th style="width: 12%;">Order Details</th>
                <th style="width: 12%;">Partner</th>
                <th style="width: 10%;">Contract</th>
                <th style="width: 8%;" class="text-center">Order Status</th>
                <th style="width: 8%;" class="text-center">Contract Status</th>
                <th style="width: 6%;" class="text-center">Items</th>
                <th style="width: 12%;">Fulfillment</th>
                <th style="width: 10%;" class="text-right">Total Value</th>
            </tr>
        </thead>
        <tbody>
            @forelse($orders as $order)
            <tr>
                <td>
                    <strong>{{ $order->order_number ?? 'PO-' . $order->id }}</strong><br>
                    <span style="font-size: 7px; color: #6b7280;">
                        {{ \Carbon\Carbon::parse($order->order_date)->format('M d, Y') }}
                    </span>
                </td>
                
                <td>
                    <strong>{{ $order->partner->name ?? 'N/A' }}</strong><br>
                    <span style="font-size: 7px; color: #6b7280;">
                        {{ $order->partner->phone ?? '' }}
                    </span>
                </td>
                
                <td>
                    @if($order->contract)
                        <strong style="font-size: 7px;">{{ $order->contract->contract_number }}</strong><br>
                        <span style="font-size: 6px; color: #6b7280;">{{ $order->contract->contract_name }}</span>
                    @else
                        <span style="color: #9ca3af;">No Contract</span>
                    @endif
                </td>
                
                <td class="text-center">
                    <span class="status-badge status-{{ $order->status }}">
                        {{ ucfirst(str_replace('_', ' ', $order->status)) }}
                    </span>
                </td>
                
                <td class="text-center">
                    @if($order->contract)
                        <span class="contract-badge contract-{{ $order->contract->status }}">
                            {{ ucfirst($order->contract->status) }}
                        </span>
                    @else
                        -
                    @endif
                </td>
                
                <td class="text-center">
                    {{ $order->lines->count() }}
                </td>
                
                <td>
                    @php
                        $fulfillment = $order->fulfillment_percentage ?? 0;
                    @endphp
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: {{ $fulfillment }}%"></div>
                    </div>
                    <span style="font-size: 7px; color: #6b7280;">{{ number_format($fulfillment, 1) }}%</span>
                </td>
                
                <td class="text-right">
                    <strong> {{ number_format($order->total_value, 2) }}</strong>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="8" class="text-center" style="padding: 20px;">
                    No partner orders found.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-title">Order Summary</div>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">{{ $orders->count() }}</div>
                <div class="stat-label">Total Orders</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $orders->where('status', 'pending')->count() }}</div>
                <div class="stat-label">Pending</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $orders->where('status', 'partially_fulfilled')->count() }}</div>
                <div class="stat-label">Partially Fulfilled</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $orders->where('status', 'fulfilled')->count() }}</div>
                <div class="stat-label">Fulfilled</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $orders->where('status', 'cancelled')->count() }}</div>
                <div class="stat-label">Cancelled</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">Php {{ number_format($totalValue, 2) }}</div>
                <div class="stat-label">Total Value</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <strong>Vigour Seeds - Partner Orders</strong><br>
        This report contains confidential company information. For authorized use only.<br>
        Generated by: {{ $user->first_name ?? 'System' }} {{ $user->last_name ?? '' }} • 
        Page 1 of 1 • 
        Document ID: VS-PO-{{ now()->format('Ymd-His') }}
    </div>
</body>
</html>