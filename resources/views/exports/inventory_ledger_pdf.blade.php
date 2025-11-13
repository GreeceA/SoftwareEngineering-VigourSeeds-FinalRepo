<!-- filepath: c:\xampp\htdocs\dashboard\SoftwareEngineering-VigourSeeds-FinalRepo\resources\views\exports\inventory_ledger_pdf.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Inventory Ledger Report - Vigour Seeds</title>
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
        .txn-badge {
            display: inline-block;
            padding: 3px 6px;
            border-radius: 10px;
            font-size: 7px;
            font-weight: 600;
            text-align: center;
            min-width: 45px;
        }
        .txn-inbound {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        .txn-outbound {
            background-color: #dbeafe;
            color: #1e40af;
            border: 1px solid #bfdbfe;
        }
        .txn-adjustment {
            background-color: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
        }
        .qty-positive {
            color: #065f46;
            font-weight: 600;
        }
        .qty-negative {
            color: #991b1b;
            font-weight: 600;
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
        <h2 class="report-title">Inventory Ledger Report</h2>
    </div>
    
    <div class="report-info">
        <div class="info-item">
            <div class="info-label">Generated On</div>
            <div class="info-value">{{ $generationDate }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Total Transactions</div>
            <div class="info-value">{{ $transactions->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Inbound</div>
            <div class="info-value">{{ $transactions->where('transaction_type', 'inbound')->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Outbound</div>
            <div class="info-value">{{ $transactions->where('transaction_type', 'outbound')->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Adjustments</div>
            <div class="info-value">{{ $transactions->where('transaction_type', 'adjustment')->count() }}</div>
        </div>
    </div>

    @if($hasFilters)
    <div class="filters-applied">
        <div class="filter-title">📋 Filters Applied:</div>
        @if($filters['product_type'])
            <span class="filter-item"><strong>Product Type:</strong> {{ ucfirst($filters['product_type']) }}</span>
        @endif
        @if($filters['transaction_type'])
            <span class="filter-item"><strong>Transaction Type:</strong> {{ ucfirst($filters['transaction_type']) }}</span>
        @endif
        @if($filters['date_from'])
            <span class="filter-item"><strong>From:</strong> {{ \Carbon\Carbon::parse($filters['date_from'])->format('M d, Y') }}</span>
        @endif
        @if($filters['date_to'])
            <span class="filter-item"><strong>To:</strong> {{ \Carbon\Carbon::parse($filters['date_to'])->format('M d, Y') }}</span>
        @endif
        @if($filters['search'])
            <span class="filter-item"><strong>Search:</strong> "{{ $filters['search'] }}"</span>
        @endif
    </div>
    @endif

    <table>
        <thead>
            <tr>
                <th style="width: 12%;">Date & Time</th>
                <th style="width: 10%;" class="text-center">Type</th>
                <th style="width: 18%;">Product</th>
                <th style="width: 10%;" class="text-right">Quantity</th>
                <th style="width: 12%;">Reference</th>
                <th style="width: 12%;">User</th>
                <th style="width: 26%;">Notes</th>
            </tr>
        </thead>
        <tbody>
            @forelse($transactions as $txn)
            <tr>
                <td>{{ \Carbon\Carbon::parse($txn->created_at)->format('M d, Y h:i A') }}</td>
                
                <td class="text-center">
                    <span class="txn-badge txn-{{ $txn->transaction_type }}">
                        {{ ucfirst($txn->transaction_type) }}
                    </span>
                </td>
                
                <td>
                    <strong>{{ $txn->product_name }}</strong><br>
                    <span style="font-size: 7px; color: #6b7280;">{{ ucfirst($txn->product_type) }}</span>
                </td>
                
                <td class="text-right">
                    @if($txn->transaction_type === 'inbound')
                        <span class="qty-positive">+{{ number_format(abs($txn->qty), 2) }} {{ $txn->unit }}</span>
                    @elseif($txn->transaction_type === 'outbound')
                        <span class="qty-negative">-{{ number_format(abs($txn->qty), 2) }} {{ $txn->unit }}</span>
                    @else
                        @if($txn->qty > 0)
                            <span class="qty-positive">+{{ number_format(abs($txn->qty), 2) }} {{ $txn->unit }}</span>
                        @else
                            <span class="qty-negative">{{ number_format($txn->qty, 2) }} {{ $txn->unit }}</span>
                        @endif
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
                
                <td>{{ $txn->user_name ?? '-' }}</td>
                
                <td style="font-size: 7px;">{{ $txn->notes ?? '-' }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="7" class="text-center" style="padding: 20px;">
                    No transactions found.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-title">Transaction Summary</div>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">{{ $transactions->count() }}</div>
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
                <div class="stat-number">{{ $transactions->where('transaction_type', 'adjustment')->count() }}</div>
                <div class="stat-label">Adjustments</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $transactions->where('product_type', 'Seed')->count() }}</div>
                <div class="stat-label">Seed Transactions</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ $transactions->where('product_type', 'item')->count() }}</div>
                <div class="stat-label">Item Transactions</div>
            </div>
        </div>
    </div>

    <div class="footer">
        <strong>Vigour Seeds - Inventory Ledger</strong><br>
        This report contains confidential company information. For authorized use only.<br>
        Generated by: {{ $user->first_name ?? 'System' }} {{ $user->last_name ?? '' }} • 
        Page 1 of 1 • 
        Document ID: VS-LEDGER-{{ now()->format('Ymd-His') }}
    </div>
</body>
</html>