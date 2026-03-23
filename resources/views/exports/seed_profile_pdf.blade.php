<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Seed Profile Report - Vigour Seeds</title>
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
            color: #37692F; /* White is required for readability on dark green */
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
        
        .notes {
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
        
        .seed-header {
            background: linear-gradient(135deg, #37692F 0%, #2a5624 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .seed-main-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .seed-name {
            font-size: 20px;
            font-weight: 700;
            margin: 0;
        }
        
        .seed-id {
            font-size: 14px;
            font-weight: 600;
            background: rgba(255,255,255,0.2);
            padding: 4px 12px;
            border-radius: 15px;
        }

        .transaction-inbound { color: #10b981; font-weight: 600; }
        .transaction-outbound { color: #ef4444; font-weight: 600; }
        .transaction-adjustment { color: #f59e0b; font-weight: 600; }

        /* Summary Box Styles (from partner sample) */
        .summary {
            margin-top: 0; /* Adjusted to sit right after a table */
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
        <h2 class="report-title">Seed Profile Report</h2>
    </div>

    <div class="report-info">
        <div class="info-item">
            <div class="info-label">Generated On</div>
            <div class="info-value">{{ now()->format('F d, Y - h:i A') }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Stock on Hand</div>
            <div class="info-value">{{ number_format($stockOnHand, 2) }} kg</div>
        </div>
        <div class="info-item">
            <div class="info-label">Price per kg</div>
            <div class="info-value">Php {{ number_format($seed->price_per_unit, 2) }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Active Contracts</div>
            <div class="info-value">{{ $activeContractsCount }}</div>
        </div>
    </div>

    <div class="seed-header">
        <div class="seed-main-info">
            <div>
                <h1 class="seed-name">{{ $seed->seed_variety }}</h1>
                <div style="font-size: 12px; opacity: 0.9;">
                    Growth Cycle: {{ $seed->growth_cycle }} Days
                </div>
            </div>
            <div class="seed-id">Seed #{{ $seed->id }}</div>
        </div>
    </div>

    <div class="section-title">Seed Specifications</div>
    <table class="kv-table">
        <tr>
            <td style="width: 20%; font-weight: 600;">Seed Variety</td>
            <td style="width: 30%">{{ $seed->seed_variety }}</td>
            <td style="width: 20%; font-weight: 600;">Status</td>
            <td style="width: 30%">
                <span class="badge badge-{{ $seed->status }}">
                    {{ ucfirst($seed->status) }}
                </span>
            </td>
        </tr>
        <tr>
            <td style="font-weight: 600;">Produces</td>
            <td>{{ $seed->cornProduct->name ?? 'N/A' }}</td>
            <td style="font-weight: 600;">Price per kg</td>
            <td>Php {{ number_format($seed->price_per_unit, 2) }}</td>
        </tr>
        <tr>
            <td style="font-weight: 600;">Growth Cycle</td>
            <td>{{ $seed->growth_cycle }} Days</td>
            <td style="font-weight: 600;">Soil Type</td>
            <td style="text-transform: capitalize;">{{ $seed->soil_type }}</td>
        </tr>
        <tr>
            <td style="font-weight: 600;">Storage Requirements</td>
            <td colspan="3">{{ $seed->storage_requirements }}</td>
        </tr>
        <tr>
            <td style="font-weight: 600;">Date Added</td>
            <td>{{ \Carbon\Carbon::parse($seed->created_at)->format('F d, Y') }}</td>
            <td style="font-weight: 600;">Last Updated</td>
            <td>{{ \Carbon\Carbon::parse($seed->updated_at)->format('F d, Y') }}</td>
        </tr>
    </table>

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
                <div class="stat-number">{{ number_format($transactions->where('qty', '>', 0)->sum('qty'), 2) }}</div>
                <div class="stat-label">Total Inbound</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format(abs($transactions->where('qty', '<', 0)->sum('qty')), 2) }}</div>
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
        No inventory transactions recorded for this seed.
    </div>
    @endif


    <div class="section-title">Active Contracts ({{ $contracts->count() }} contracts)</div>
    @if($contracts->count() > 0)
    <table>
        <thead>
            <tr>
                <th style="width: 25%">Contract</th>
                <th style="width: 20%">Partner</th>
                <th style="width: 15%">Committed Qty</th>
                <th style="width: 15%">Planting Date</th>
                <th style="width: 15%">Agreed Cycles</th>
                <th style="width: 10%">Buyback</th>
            </tr>
        </thead>
        <tbody>
            @foreach($contracts as $commitment)
            <tr>
                <td>{{ $commitment->contract->contract_name }}</td>
                <td>{{ $commitment->contract->partner->name }}</td>
                <td>{{ number_format($commitment->seed_quantity, 2) }} {{ $commitment->unit }}</td>
                <td>{{ \Carbon\Carbon::parse($commitment->planting_date)->format('M d, Y') }}</td>
                <td>{{ $commitment->agreed_cycles }}</td>
                <td>{{ number_format($commitment->expected_buyback_amount, 2) }} {{ $commitment->buyback_unit }}</td>
            </tr>
            @endforeach
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
                <div class="stat-number">{{ number_format($contracts->sum('seed_quantity'), 2) }}</div>
                <div class="stat-label">Total Seed Committed (kg)</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format($contracts->sum('expected_buyback_amount'), 2) }}</div>
                <div class="stat-label">Total Expected Buyback (kg)</div>
            </div>
        </div>
    </div>

    @else
    <div style="text-align: center; padding: 20px; color: #6b7280; font-style: italic; background: #f8f9fa; border-radius: 6px; margin-bottom: 25px;">
        No active contracts for this seed.
    </div>
    @endif

    @if($seed->notes)
    <div class="section-title">Notes & Observations</div>
    <div class="notes">
        {{ $seed->notes }}
    </div>
    @endif

    <div class="footer">
        <strong>Vigour Seeds - Seed Management System</strong><br>
        This report contains confidential seed information. For authorized use only.<br>
        Generated by: {{ $user->first_name ?? 'System' }} {{ $user->last_name ?? '' }} • 
        Document ID: VS-SEED-{{ $seed->id }}-{{ now()->format('Ymd-His') }}
    </div>
</body>
</html>