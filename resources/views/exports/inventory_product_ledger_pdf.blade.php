<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Inventory Ledger - {{ $product['name'] }}</title>
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
        .product-details {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
            padding: 15px;
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border-radius: 8px;
            border-left: 4px solid #10b981;
        }
        .detail-item {
            flex: 1;
            text-align: center;
        }
        .detail-label {
            font-size: 10px;
            color: #047857;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .detail-value {
            font-size: 14px;
            font-weight: 600;
            color: #065f46;
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
        .transaction-type {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: 500;
            text-align: center;
            min-width: 70px;
        }
        .type-inbound {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        .type-outbound {
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }
        .quantity-positive {
            color: #065f46;
            font-weight: 600;
        }
        .quantity-negative {
            color: #991b1b;
            font-weight: 600;
        }
        .running-balance {
            font-weight: 600;
            color: #1f2937;
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
        .text-center {
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="company-name">VIGOUR SEEDS</h1>
        <h2 class="report-title">Inventory Ledger Report</h2>
    </div>
    
    <div class="report-info">
        <div class="info-item">
            <div class="info-label">Generated On</div>
            <div class="info-value">{{ $generationDate }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Generated By</div>
            <div class="info-value">{{ $user->name }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Total Transactions</div>
            <div class="info-value">{{ count($transactions) }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Report Type</div>
            <div class="info-value">Inventory Ledger</div>
        </div>
    </div>
    
    <div class="product-details">
        <div class="detail-item">
            <div class="detail-label">Product Name</div>
            <div class="detail-value">{{ $product['name'] }}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Product Type</div>
            <div class="detail-value">{{ $product['type'] }}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Unit</div>
            <div class="detail-value">{{ $product['unit'] }}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Current Stock</div>
            <div class="detail-value">{{ number_format($product['current_stock'], 2) }} {{ $product['unit'] }}</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 15%">Date & Time</th>
                <th style="width: 10%">Type</th>
                <th style="width: 12%">Quantity</th>
                <th style="width: 12%">Running Balance</th>
                <th style="width: 12%">User</th>
                <th style="width: 20%">Notes</th>
                <th style="width: 19%">Reference</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($transactions as $txn)
            <tr>
                <td>{{ \Carbon\Carbon::parse($txn->created_at)->format('M d, Y h:i A') }}</td>
                <td>
                    <span class="transaction-type type-{{ $txn->transaction_type }}">
                        {{ ucfirst($txn->transaction_type) }}
                    </span>
                </td>
                <td class="{{ $txn->transaction_type === 'inbound' ? 'quantity-positive' : 'quantity-negative' }}">
                    @if($txn->transaction_type === 'inbound') + @elseif($txn->transaction_type === 'outbound') - @endif
                    {{ number_format($txn->qty_converted ?? $txn->qty, 2) }} {{ $txn->unit_converted ?? $product['unit'] }}
                </td>
                <td class="running-balance">
                    {{ number_format($txn->running_balance, 2) }} {{ $txn->unit_converted ?? $product['unit'] }}
                </td>
                <td>{{ $txn->user_name ?? '-' }}</td>
                <td>{{ $txn->notes ?? '-' }}</td>
                <td>
                    @if($txn->partner_order_id)
                        Order #{{ $txn->partner_order_id }}
                    @elseif($txn->contract_id)
                        Contract #{{ $txn->contract_id }}
                    @else
                        -
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="7" class="text-center">No transactions found.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-title">Transaction Summary</div>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">{{ count($transactions) }}</div>
                <div class="stat-label">Total Transactions</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $transactions->where('transaction_type', 'inbound')->count() }}</div>
                <div class="stat-label">Inbound</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $transactions->where('transaction_type', 'outbound')->count() }}</div>
                <div class="stat-label">Outbound</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format($product['current_stock'], 2) }}</div>
                <div class="stat-label">Current Stock</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <strong>Vigour Seeds - Inventory Ledger</strong><br>
        This report contains confidential inventory information. For authorized use only.<br>
        Generated by: {{ $user->name }} • 
        Page 1 of 1 • 
        Document ID: VS-INV-{{ now()->format('Ymd-His') }}
    </div>
</body>
</html>