<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Item Profile Report - Vigour Seeds</title>
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
        
        .badge-archived {
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }
        
        .badge-fertilizer {
            background-color: #dbeafe;
            color: #1e40af;
            border: 1px solid #bfdbfe;
        }
        
        .badge-pesticide {
            background-color: #e0e7ff;
            color: #5b21b6;
            border: 1px solid #c7d2fe;
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
            color: #37692F;
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
        
        .description-box {
            background: #f8f9fa;
            border-left: 4px solid #37692F;
            padding: 15px;
            margin-top: 10px;
            font-size: 11px;
            border-radius: 6px;
            line-height: 1.5;
        }
        
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 9px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
        }
        
        .item-header {
            background: linear-gradient(135deg, #37692F 0%, #2a5624 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .item-main-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .item-name {
            font-size: 20px;
            font-weight: 700;
            margin: 0;
        }
        
        .item-id {
            font-size: 14px;
            font-weight: 600;
            background: rgba(255,255,255,0.2);
            padding: 4px 12px;
            border-radius: 15px;
        }

        .transaction-inbound { color: #10b981; font-weight: 600; }
        .transaction-outbound { color: #ef4444; font-weight: 600; }
        .transaction-adjustment { color: #f59e0b; font-weight: 600; }

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
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">VIGOUR SEEDS</h1>
        <h2 class="report-title">Item Profile Report</h2>
    </div>

    <div class="report-info">
        <div class="info-item">
            <div class="info-label">Generated On</div>
            <div class="info-value">{{ now()->format('F d, Y - h:i A') }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Stock on Hand</div>
            <div class="info-value">{{ number_format($stockOnHand, 2) }} {{ $item->base_unit }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Price</div>
            <div class="info-value">Php {{ number_format($item->price_per_unit, 2) }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Committed Stock</div>
            <div class="info-value">{{ number_format($committedStock, 2) }} {{ $item->base_unit }}</div>
        </div>
    </div>

    <div class="item-header">
        <div class="item-main-info">
            <div>
                <h1 class="item-name">{{ $item->name }}</h1>
                <div style="font-size: 12px; opacity: 0.9;">
                    {{ ucfirst($item->type) }} • {{ $item->base_unit }}
                </div>
            </div>
            <div class="item-id">Item #{{ $item->id }}</div>
        </div>
    </div>

    <div class="section-title">Item Specifications</div>
    <table class="kv-table">
        <tr>
            <td style="width: 20%; font-weight: 600;">Item Name</td>
            <td style="width: 30%">{{ $item->name }}</td>
            <td style="width: 20%; font-weight: 600;">Item ID</td>
            <td style="width: 30%">#{{ $item->id }}</td>
        </tr>
        <tr>
            <td style="font-weight: 600;">Status</td>
            <td>
                <span class="badge badge-{{ $item->status }}">
                    {{ ucfirst($item->status) }}
                </span>
            </td>
            <td style="font-weight: 600;">Item Type</td>
            <td>
                <span class="badge badge-{{ $item->type }}">
                    {{ ucfirst($item->type) }}
                </span>
            </td>
        </tr>
        <tr>
            <td style="font-weight: 600;">Price</td>
            <td>Php {{ number_format($item->price_per_unit, 2) }}</td>
            <td style="font-weight: 600;">Base Unit</td>
            <td>{{ $item->base_unit }}</td>
        </tr>
        <tr>
            <td style="font-weight: 600;">Date Added</td>
            <td>{{ \Carbon\Carbon::parse($item->created_at)->format('F d, Y') }}</td>
            <td style="font-weight: 600;">Last Updated</td>
            <td>{{ \Carbon\Carbon::parse($item->updated_at)->format('F d, Y') }}</td>
        </tr>
    </table>

    @if($item->description)
    <div class="section-title">Description</div>
    <div class="description-box">
        {{ $item->description }}
    </div>
    @endif

    <div class="section-title">Inventory Ledger ({{ $transactions->count() }} transactions)</div>
    @if($transactions->count() > 0)
    <table>
        <thead>
            <tr>
                <th style="width: 15%">Date</th>
                <th style="width: 15%">Type</th>
                <th style="width: 15%">Quantity</th>
                <th style="width: 20%">Related Document</th>
                <th style="width: 15%">User</th>
                <th style="width: 20%">Notes</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactions as $txn)
            <tr>
                <td>{{ \Carbon\Carbon::parse($txn->created_at)->format('M d, Y') }}</td>
                <td>
                    <span class="transaction-{{ $txn->transaction_type }}">
                        {{ ucfirst($txn->transaction_type) }}
                    </span>
                </td>
                <td>
                    @if($txn->transaction_type === 'inbound')
                        <span class="transaction-inbound">+{{ number_format($txn->qty, 2) }} {{ $txn->unit }}</span>
                    @elseif($txn->transaction_type === 'outbound')
                        <span class="transaction-outbound">{{ number_format($txn->qty, 2) }} {{ $txn->unit }}</span>
                    @else
                        <span class="transaction-adjustment">{{ $txn->qty > 0 ? '+' : '' }}{{ number_format($txn->qty, 2) }} {{ $txn->unit }}</span>
                    @endif
                </td>
                <td>
                    @if($txn->partner_order_id)
                        Order #{{ $txn->partner_order_id }}
                    @elseif($txn->contract_id)
                        Contract #{{ $txn->contract_id }}
                    @else
                        -
                    @endif
                </td>
                <td>{{ $txn->user->first_name ?? 'System' }} {{ $txn->user->last_name ?? '' }}</td>
                <td>{{ $txn->notes ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    
    <div class="summary">
        <div class="summary-title">Ledger Summary</div>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">{{ number_format($transactions->where('transaction_type', 'inbound')->sum('qty'), 2) }}</div>
                <div class="stat-label">Total Inbound</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format(abs($transactions->where('transaction_type', 'outbound')->sum('qty')), 2) }}</div>
                <div class="stat-label">Total Outbound</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format($stockOnHand, 2) }}</div>
                <div class="stat-label">Net Stock on Hand</div>
            </div>
        </div>
    </div>
    @else
    <div style="text-align: center; padding: 20px; color: #6b7280; font-style: italic; background: #f8f9fa; border-radius: 6px; margin-bottom: 25px;">
        No inventory transactions recorded for this item.
    </div>
    @endif

    <div class="section-title">Order History ({{ $orderHistory->count() }} orders)</div>
    @if($orderHistory->count() > 0)
    <table>
        <thead>
            <tr>
                <th style="width: 10%">Order ID</th>
                <th style="width: 20%">Partner</th>
                <th style="width: 15%">Order Status</th>
                <th style="width: 15%">Qty Ordered</th>
                <th style="width: 15%">Qty Delivered</th>
                <th style="width: 15%">Price at Order</th>
                <th style="width: 10%">Date</th>
            </tr>
        </thead>
        <tbody>
            @foreach($orderHistory as $order)
            <tr>
                <td>#{{ $order['order_id'] }}</td>
                <td>{{ $order['partner_name'] }}</td>
                <td>
                    <span style="text-transform: capitalize;">{{ str_replace('_', ' ', $order['order_status']) }}</span>
                </td>
                <td>{{ number_format($order['qty_ordered'], 2) }} {{ $item->base_unit }}</td>
                <td>{{ number_format($order['qty_delivered'], 2) }} {{ $item->base_unit }}</td>
                <td>Php {{ number_format($order['price_at_order'], 2) }}</td>
                <td>{{ \Carbon\Carbon::parse($order['order_date'])->format('M d, Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-title">Order Summary</div>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">{{ $orderHistory->count() }}</div>
                <div class="stat-label">Total Orders</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format($orderHistory->sum('qty_ordered'), 2) }}</div>
                <div class="stat-label">Total Units Ordered</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format($orderHistory->sum('qty_delivered'), 2) }}</div>
                <div class="stat-label">Total Units Delivered</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format($lifetimeUnitsSold, 2) }}</div>
                <div class="stat-label">Lifetime Units Sold</div>
            </div>
        </div>
    </div>
    @else
    <div style="text-align: center; padding: 20px; color: #6b7280; font-style: italic; background: #f8f9fa; border-radius: 6px; margin-bottom: 25px;">
        No order history for this item.
    </div>
    @endif

    <div class="footer">
        <strong>Vigour Seeds - Item Management System</strong><br>
        This report contains confidential item information. For authorized use only.<br>
        Generated by: {{ $user->first_name ?? 'System' }} {{ $user->last_name ?? '' }} • 
        Document ID: VS-ITEM-{{ $item->id }}-{{ now()->format('Ymd-His') }}
    </div>
</body>
</html>