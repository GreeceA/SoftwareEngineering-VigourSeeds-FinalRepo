<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Contract Report - Vigour Seeds</title>
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
        
        .badge-inactive {
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }
        
        .badge-completed {
            background-color: #dbeafe;
            color: #1e40af;
            border: 1px solid #bfdbfe;
        }
        
        .badge-pending {
            background-color: #fef3c7;
            color: #92400e;
            border: 1px solid #fde68a;
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
        
        .contract-header {
            background: linear-gradient(135deg, #37692F 0%, #2a5624 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .contract-main-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .contract-name {
            font-size: 20px;
            font-weight: 700;
            margin: 0;
        }
        
        .contract-id {
            font-size: 14px;
            font-weight: 600;
            background: rgba(255,255,255,0.2);
            padding: 4px 12px;
            border-radius: 15px;
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
        
        .notes {
            background: #f8f9fa;
            border-left: 4px solid #37692F;
            padding: 15px;
            margin-top: 10px;
            font-size: 11px;
            border-radius: 6px;
            line-height: 1.5;
        }
        
        .progress-bar {
            width: 100%;
            background: #e5e7eb;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 5px;
        }
        
        .progress-fill {
            height: 100%;
            background: #10b981;
            transition: width 0.3s ease;
        }
        
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .text-green { color: #10b981; }
        .text-red { color: #ef4444; }
        .font-bold { font-weight: 700; }
    </style>

    @php
        function formatDateOnly($date) {
            if (!$date) return '-';
            try {
                return \Carbon\Carbon::parse($date)->format('M d, Y');
            } catch (\Exception $e) {
                return '-';
            }
        }
    @endphp
</head>
<body>
    <div class="header">
        <h1 class="company-name">VIGOUR SEEDS</h1>
        <h2 class="report-title">Contract Report</h2>
    </div>

    <div class="report-info">
        <div class="info-item">
            <div class="info-label">Generated On</div>
            <div class="info-value">{{ now()->format('F d, Y - h:i A') }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Contract Status</div>
            <div class="info-value">{{ ucfirst($contract->status) }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Buyback Fulfillment</div>
            <div class="info-value">{{ number_format($fulfillment_percentage, 1) }}%</div>
        </div>
        <div class="info-item">
            <div class="info-label">Total Value</div>
            <div class="info-value">Php {{ number_format($total_inflow_value + $total_outflow_value, 2) }}</div>
        </div>
    </div>

    <!-- Contract Header -->
    <div class="contract-header">
        <div class="contract-main-info">
            <div>
                <h1 class="contract-name">{{ $contract->contract_name }}</h1>
                <div style="font-size: 12px; opacity: 0.9;">
                    Contract Period: {{ formatDateOnly($contract->effective_date) }} to {{ formatDateOnly($contract->expiration_date) }}
                </div>
            </div>
            <div class="contract-id">Contract #{{ $contract->id }}</div>
        </div>
    </div>

    <!-- Contract Information -->
    <div class="section-title">Contract Information</div>
    <table class="kv-table">
        <tr>
            <td style="width: 20%; font-weight: 600;">Contract Name</td>
            <td style="width: 30%">{{ $contract->contract_name }}</td>
            <td style="width: 20%; font-weight: 600;">Contract ID</td>
            <td style="width: 30%">#{{ $contract->id }}</td>
        </tr>
        <tr>
            <td style="font-weight: 600;">Status</td>
            <td>
                <span class="badge badge-{{ $contract->status }}">
                    {{ ucfirst($contract->status) }}
                </span>
            </td>
            <td style="font-weight: 600;">Signing Date</td>
            <td>{{ formatDateOnly($contract->signing_date) }}</td>
        </tr>
        <tr>
            <td style="font-weight: 600;">Effective Date</td>
            <td>{{ formatDateOnly($contract->effective_date) }}</td>
            <td style="font-weight: 600;">Expiration Date</td>
            <td>{{ formatDateOnly($contract->expiration_date) }}</td>
        </tr>
        <tr>
            <td style="font-weight: 600;">Partner</td>
            <td>{{ $partner->name }}</td>
            <td style="font-weight: 600;">Partner Contact</td>
            <td>{{ $partner->phone ?? 'N/A' }}</td>
        </tr>
        @if($farm)
        <tr>
            <td style="font-weight: 600;">Farm Location</td>
            <td>{{ $farm->location_name }}</td>
            <td style="font-weight: 600;">Farm Area</td>
            <td>{{ number_format($farm->area_size, 2) }} hectares</td>
        </tr>
        @endif
    </table>

    @if($contract->notes)
    <div class="section-title">Contract Notes</div>
    <div class="notes">
        {{ $contract->notes }}
    </div>
    @endif

    <!-- Seed Commitments -->
    <div class="section-title">Seed Commitments ({{ $seedCommitments->count() }})</div>
    @if($seedCommitments->count() > 0)
    <table>
        <thead>
            <tr>
                <th style="width: 25%">Seed Variety</th>
                <th style="width: 10%" class="text-right">Quantity</th>
                <th style="width: 10%">Unit</th>
                <th style="width: 15%" class="text-right">Price</th>
                <th style="width: 15%">Planting Date</th>
                <th style="width: 10%">Cycles</th>
                <th style="width: 15%" class="text-right">Expected Buyback</th>
            </tr>
        </thead>
        <tbody>
            @foreach($seedCommitments as $item)
            <tr>
                <td>{{ $item->seed->seed_variety }}</td>
                <td class="text-right">{{ number_format($item->seed_quantity, 2) }}</td>
                <td>{{ $item->unit }}</td>
                <td class="text-right">Php {{ number_format($item->seed_price_at_contract, 2) }}</td>
                <td>{{ formatDateOnly($item->planting_date) }}</td>
                <td class="text-center">{{ $item->agreed_cycles }}</td>
                <td class="text-right">{{ number_format($item->expected_buyback_amount, 2) }} {{ $item->buyback_unit }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <div style="text-align: center; padding: 20px; color: #6b7280; font-style: italic; background: #f8f9fa; border-radius: 6px;">
        No seed commitments recorded for this contract.
    </div>
    @endif

    <!-- Buyback Summary -->
    <div class="summary">
        <div class="summary-title">Buyback Summary</div>
        <div class="summary-stats">
            <div class="stat-item">
                <div class="stat-number">{{ number_format($expected_kg, 2) }} kg</div>
                <div class="stat-label">Total Expected</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format($actual_kg, 2) }} kg</div>
                <div class="stat-label">Total Received</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format($remaining_kg, 2) }} kg</div>
                <div class="stat-label">Remaining</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">{{ number_format($fulfillment_percentage, 1) }}%</div>
                <div class="stat-label">Fulfillment Rate</div>
            </div>
        </div>
    </div>

    <!-- Partner Orders -->
    <div class="section-title">Partner Orders ({{ $partnerOrders->count() ?? 0 }})</div>
    @if(!empty($partnerOrders) && count($partnerOrders) > 0)
    <table>
        <thead>
            <tr>
                <th style="width: 15%">Order No.</th>
                <th style="width: 15%">Date</th>
                <th style="width: 15%">Status</th>
                <th style="width: 15%">Fulfillment</th>
                <th style="width: 20%" class="text-right">Total Value</th>
                <th style="width: 20%">Items</th>
            </tr>
        </thead>
        <tbody>
            @foreach($partnerOrders as $order)
            <tr>
                <td>{{ $order->order_number ?? 'PO-' . $order->id }}</td>
                <td>{{ formatDateOnly($order->order_date) }}</td>
                <td>
                    <span class="badge badge-{{ $order->status }}">
                        {{ ucfirst($order->status) }}
                    </span>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: {{ $order->getFulfillmentPercentage() }}%"></div>
                        </div>
                        <span style="font-size: 9px; font-weight: 600;">{{ round($order->getFulfillmentPercentage(), 1) }}%</span>
                    </div>
                </td>
                <td class="text-right font-bold">Php {{ number_format($order->getTotalValue(), 2) }}</td>
                <td style="font-size: 9px;">
                    @foreach($order->lines as $line)
                    {{ $line->product->seed_variety ?? $line->product->name ?? '' }} ({{ $line->qty }}{{ $line->unit }})<br>
                    @endforeach
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <div style="text-align: center; padding: 20px; color: #6b7280; font-style: italic; background: #f8f9fa; border-radius: 6px;">
        No partner orders found for this contract.
    </div>
    @endif

    <!-- Buyback Transactions -->
    <div class="section-title">Buyback Transactions ({{ $buybackTransactions->count() ?? 0 }})</div>
    @if($buybackTransactions && count($buybackTransactions) > 0)
    <table>
        <thead>
            <tr>
                <th style="width: 10%">Date</th>
                <th style="width: 15%" class="text-right">Quantity</th>
                <th style="width: 10%">Unit</th>
                <th style="width: 15%" class="text-right">Buyback Price</th>
                <th style="width: 15%" class="text-right">Total Value</th>
                <th style="width: 20%">Notes</th>
                <th style="width: 15%">Recorded By</th>
            </tr>
        </thead>
        <tbody>
            @foreach($buybackTransactions as $tx)
            <tr>
                <td>{{ formatDateOnly($tx->delivery_date) }}</td>
                <td class="text-right">{{ number_format($tx->qty, 2) }}</td>
                <td>{{ $tx->unit }}</td>
                <td class="text-right">Php {{ $tx->buyback_price ? number_format($tx->buyback_price, 4) : 'N/A' }}</td>
                <td class="text-right font-bold">Php {{ $tx->total_value ? number_format($tx->total_value, 2) : 'N/A' }}</td>
                <td style="font-size: 9px;">{{ $tx->notes ?? '-' }}</td>
                <td style="font-size: 9px;">{{ $tx->creator->name ?? ($tx->creator->first_name ?? '') . ' ' . ($tx->creator->last_name ?? '') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <div style="text-align: center; padding: 20px; color: #6b7280; font-style: italic; background: #f8f9fa; border-radius: 6px;">
        No buyback transactions recorded for this contract.
    </div>
    @endif

    <!-- Field Visits -->
    <div class="section-title">Field Visits ({{ $fieldVisits->count() ?? 0 }})</div>
    @if(!empty($fieldVisits) && count($fieldVisits) > 0)
    <table>
        <thead>
            <tr>
                <th style="width: 15%">Date</th>
                <th style="width: 15%">Status</th>
                <th style="width: 25%">Assignee</th>
                <th style="width: 45%">Remarks</th>
            </tr>
        </thead>
        <tbody>
            @foreach($fieldVisits as $visit)
            <tr>
                <td>{{ formatDateOnly($visit->date_visit) }}</td>
                <td>
                    <span class="badge badge-{{ $visit->status }}">
                        {{ ucfirst($visit->status) }}
                    </span>
                </td>
                <td>{{ $visit->assignee->name ?? ($visit->assignee->first_name ?? '') . ' ' . ($visit->assignee->last_name ?? '') }}</td>
                <td>{{ $visit->remarks ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <div style="text-align: center; padding: 20px; color: #6b7280; font-style: italic; background: #f8f9fa; border-radius: 6px;">
        No field visits recorded for this contract.
    </div>
    @endif

    <!-- Finance Summary -->
    <div class="section-title">Finance Summary</div>
    <table>
        <thead>
            <tr>
                <th style="width: 70%">Description</th>
                <th style="width: 30%" class="text-right">Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Total Value of Goods Provided (to Partner)</td>
                <td class="text-right text-red font-bold">- Php {{ number_format($total_outflow_value, 2) }}</td>
            </tr>
            <tr>
                <td>Total Value of Goods Received (from Partner)</td>
                <td class="text-right text-green font-bold">+ Php {{ number_format($total_inflow_value, 2) }}</td>
            </tr>
            <tr style="background: #f8f9fa; border-top: 2px solid #e5e7eb;">
                <td class="font-bold">Net Balance</td>
                <td class="text-right font-bold">
                    @if($net_balance > 0)
                        <span class="text-green">
                            Php {{ number_format(abs($net_balance), 2) }}
                            <br><small style="font-weight: normal;">(Payable to Partner)</small>
                        </span>
                    @elseif($net_balance < 0)
                        <span class="text-red">
                            - Php {{ number_format(abs($net_balance), 2) }}
                            <br><small style="font-weight: normal;">(Receivable from Partner)</small>
                        </span>
                    @else
                        <span>Php 0.00</span>
                    @endif
                </td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        <strong>Vigour Seeds - Contract Management System</strong><br>
        This report contains confidential contract information. For authorized use only.<br>
        Generated by: System User • 
        Document ID: VS-CONTRACT-{{ $contract->id }}-{{ now()->format('Ymd-His') }}
    </div>
</body>
</html>