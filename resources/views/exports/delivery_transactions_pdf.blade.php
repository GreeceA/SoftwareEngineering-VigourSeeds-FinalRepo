<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Delivery Transaction History - Vigour Seeds</title>
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
        
        .order-header {
            background: linear-gradient(135deg, #37692F 0%, #2a5624 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 25px;
        }
        
        .order-main-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .order-number {
            font-size: 22px;
            font-weight: 700;
            margin: 0;
        }
        
        .partner-name {
            font-size: 13px;
            opacity: 0.9;
            margin-top: 4px;
        }
        
        .order-status {
            background: rgba(255,255,255,0.2);
            padding: 6px 14px;
            border-radius: 15px;
            font-size: 11px;
            font-weight: 600;
            text-transform: capitalize;
        }
        
        .order-details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-top: 15px;
        }
        
        .detail-box {
            background: rgba(255,255,255,0.1);
            padding: 10px;
            border-radius: 6px;
        }
        
        .detail-label {
            font-size: 9px;
            opacity: 0.8;
            margin-bottom: 4px;
        }
        
        .detail-value {
            font-size: 11px;
            font-weight: 600;
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
            color: white;
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
        
        .product-cell {
            font-weight: 600;
            color: #1f2937;
        }
        
        .quantity-cell {
            font-weight: 700;
            font-size: 10px;
        }
        
        .quantity-positive { color: #10b981; }
        .quantity-negative { color: #ef4444; }
        
        .value-cell {
            font-weight: 600;
            color: #059669;
        }
        
        .summary {
            margin-top: 0;
            margin-bottom: 25px;
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
        
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        
        tfoot {
            background: #f9fafb;
            font-weight: 600;
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
        
        .badge-fulfilled {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }

        .badge-pending {
            background-color: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
        }

        .badge-processing {
            background-color: #dbeafe;
            color: #1e40af;
            border: 1px solid #bfdbfe;
        }

        .badge-cancelled {
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">VIGOUR SEEDS</h1>
        <h2 class="report-title">Delivery Transaction History Report</h2>
    </div>

    <div class="report-info">
        <div class="info-item">
            <div class="info-label">Generated On</div>
            <div class="info-value">{{ now()->format('F d, Y - h:i A') }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Order Number</div>
            <div class="info-value">{{ $orderNumber }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Partner</div>
            <div class="info-value">{{ $partnerName }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Fulfillment Progress</div>
            <div class="info-value">{{ number_format($fulfillmentPercentage, 1) }}%</div>
        </div>
    </div>

    <div class="section-title">Order Information</div>
        <table class="kv-table">
            <tr>
                <td style="width: 20%; font-weight: 600;">Order Number</td>
                <td style="width: 30%">{{ $orderNumber }}</td>
                <td style="width: 20%; font-weight: 600;">Partner Name</td>
                <td style="width: 30%">{{ $partnerName }}</td>
            </tr>
            <tr>
                <td style="font-weight: 600;">Status</td>
                <td>
                    <span class="badge badge-{{ $orderStatus }}">
                        {{ ucfirst(str_replace('_', ' ', $orderStatus)) }}
                    </span>
                </td>
                <td style="font-weight: 600;">Farm Location</td>
                <td>
                    {{ $farmName ?? 'N/A' }}<br>
                    <span style="font-size: 9px; color: #6b7280;">{{ $farmLocation ?? '' }}</span>
                </td>
            </tr>
            <tr>
                <td style="font-weight: 600;">Partner Contact</td>
                <td>{{ $partnerContact ?? 'N/A' }}</td>
                <td style="font-weight: 600;">Order Date</td>
                <td>{{ $orderDate }}</td>
            </tr>
            @if($contractName)
            <tr>
                <td style="font-weight: 600;">Contract Period</td>
                <td>{{ $contractPeriod ?? 'N/A' }}</td>
                <td style="font-weight: 600;">Buyback Price</td>
                <td>Php {{ number_format($buybackPrice ?? 0, 2) }}/kg</td>
            </tr>
            @endif
            <tr>
                <td style="font-weight: 600;">Fulfillment Progress</td>
                <td colspan="3">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="flex-grow: 1; background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
                            <div style="background: #10b981; height: 100%; width: {{ $fulfillmentPercentage }}%;"></div>
                        </div>
                        <span style="font-weight: 600; color: #37692F; min-width: 50px;">{{ number_format($fulfillmentPercentage, 1) }}%</span>
                    </div>
                </td>
            </tr>
        </table>

    {{-- ORDER LINE ITEMS SECTION --}}
    <div class="section-title">Order Line Items</div>
    @if($orderLines->count() > 0)
    <table>
        <thead>
            <tr>
                <th style="width: 12%">Product Type</th>
                <th style="width: 25%">Product Name</th>
                <th style="width: 13%" class="text-right">Qty Ordered</th>
                <th style="width: 10%" class="text-center">Unit</th>
                <th style="width: 13%" class="text-right">Delivered</th>
                <th style="width: 13%" class="text-right">Price/Unit</th>
                <th style="width: 14%" class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($orderLines as $line)
            <tr>
                <td>
                    <span style="text-transform: capitalize; font-weight: 500;">
                        {{ $line['product_type'] }}
                    </span>
                </td>
                <td class="product-cell">{{ $line['product_name'] }}</td>
                <td class="text-right">{{ number_format($line['qty'], 2) }}</td>
                <td class="text-center">{{ $line['unit'] }}</td>
                <td class="text-right">{{ number_format($line['delivered_qty'], 2) }}</td>
                <td class="text-right">Php {{ number_format($line['price_per_unit'], 2) }}</td>
                <td class="text-right value-cell">Php {{ number_format($line['total_value'], 2) }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="6" class="text-right" style="padding: 10px 6px; font-weight: 700;">Total Order Value</td>
                <td class="text-right" style="padding: 10px 6px; font-weight: 700; color: #059669; font-size: 11px;">
                    Php {{ number_format($orderLines->sum('total_value'), 2) }}
                </td>
            </tr>
        </tfoot>
    </table>
    @endif

    {{-- DELIVERY TRANSACTIONS SECTION --}}
    <div class="section-title">Delivery Transaction History ({{ $transactions->count() }} transactions)</div>
    @if($transactions->count() > 0)
    <table>
        <thead>
            <tr>
                <th style="width: 15%">Date & Time</th>
                <th style="width: 22%">Product</th>
                <th style="width: 15%">Quantity</th>
                <th style="width: 13%">Value</th>
                <th style="width: 15%">Delivered By</th>
                <th style="width: 20%">Notes</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $txn)
            <tr>
                <td style="font-size: 9px;">
                    {{ \Carbon\Carbon::parse($txn['date'])->format('M d, Y') }}<br>
                    <span style="color: #9ca3af;">{{ \Carbon\Carbon::parse($txn['date'])->format('h:i A') }}</span>
                </td>
                <td class="product-cell">{{ $txn['product_name'] }}</td>
                <td class="quantity-cell {{ $txn['transaction_type'] === 'outbound' ? 'quantity-negative' : 'quantity-positive' }}">
                    {{ $txn['transaction_type'] === 'outbound' ? '-' : '+' }}{{ number_format($txn['quantity'], 2) }} {{ $txn['unit'] }}
                </td>
                <td class="value-cell">Php {{ number_format($txn['value'], 2) }}</td>
                <td style="font-size: 9px;">{{ $txn['delivered_by'] }}</td>
                <td style="font-size: 9px; font-style: italic; color: #6b7280;">{{ $txn['notes'] ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-title">Transaction Summary</div>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">{{ $transactions->count() }}</div>
                <div class="stat-label">Total Deliveries</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format($transactions->sum('quantity'), 2) }}</div>
                <div class="stat-label">Total Units Delivered</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">Php {{ number_format($transactions->sum('value'), 2) }}</div>
                <div class="stat-label">Total Delivery Value</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format($fulfillmentPercentage, 1) }}%</div>
                <div class="stat-label">Fulfillment Rate</div>
            </div>
        </div>
    </div>
    @else
    <div style="text-align: center; padding: 30px; color: #9ca3af; background: #f9fafb; border-radius: 8px;">
        <div style="font-size: 36px; margin-bottom: 10px;">📦</div>
        <p style="font-weight: 600; font-size: 12px; margin: 0;">No Delivery Transactions</p>
        <p style="font-size: 10px; margin-top: 4px;">No deliveries have been recorded for this order yet.</p>
    </div>
    @endif

    <div class="footer">
        <strong>Vigour Seeds - Delivery Management System</strong><br>
        This report contains confidential transaction information. For authorized use only.<br>
        Generated by: {{ $user->first_name ?? 'System' }} {{ $user->last_name ?? '' }} • 
        Document ID: VS-DELIVERY-{{ $orderId }}-{{ now()->format('Ymd-His') }}
    </div>
</body>
</html>