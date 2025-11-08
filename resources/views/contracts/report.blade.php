
@php
function toKg($amount, $unit) {
    if ($unit === 'kg') return $amount;
    if ($unit === 'sack') return $amount * 50;
    if ($unit === 'ton') return $amount * 1000;
    return $amount;
}

// Calculate expected buyback in kg
$expected_kg = 0;
foreach ($seedCommitments as $item) {
    $expected_kg += toKg($item->expected_buyback_amount, $item->buyback_unit);
}

// Calculate actual delivered in kg
$actual_kg = 0;
foreach ($buybackTransactions as $tx) {
    $actual_kg += toKg($tx->qty, $tx->unit);
}

$remaining_kg = max($expected_kg - $actual_kg, 0);
$fulfillment_percentage = $expected_kg > 0 ? round(($actual_kg / $expected_kg) * 100, 2) : 0;

function formatDateOnly($date) {
    return $date ? \Carbon\Carbon::parse($date)->format('Y-m-d') : '';
}

$total_outflow_value = 0;
foreach ($partnerOrders as $order) {
    $total_outflow_value += $order->getTotalValue();
}
$total_inflow_value = $contract->buybackTransactions->sum('total_value');
$net_balance = $total_inflow_value - $total_outflow_value;
@endphp


<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Contract Report</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        h1, h2, h3 { margin-bottom: 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px;}
        th, td { border: 1px solid #ccc; padding: 5px; }
        .section { margin-bottom: 30px; }
    </style>
</head>
<body>
    <h1>Contract Report: {{ $contract->contract_name }}</h1>
    <div class="section">
        <h2>Contract Details</h2>
        <p>ID: {{ $contract->id }}</p>
        <p>Status: {{ ucfirst($contract->status) }}</p>
        <p>Signing Date: {{ formatDateOnly($contract->signing_date) }}</p>
        <p>Effective Date: {{ formatDateOnly($contract->effective_date) }}</p>
        <p>Expiration Date: {{ formatDateOnly($contract->expiration_date) }}</p>
        <p>Notes: {{ $contract->notes }}</p>
    </div>

    <div class="section">
        <h2>Partner</h2>
        <p>Name: {{ $partner->name }}</p>
        <p>Email: {{ $partner->email }}</p>
        <p>Phone: {{ $partner->phone }}</p>
        <p>Address: {{ $partner->address }}</p>
    </div>

    @if($farm)
    <div class="section">
        <h2>Partner Farm</h2>
        <p>Name: {{ $farm->location_name }}</p>
        <p>Area Size: {{ $farm->area_size }}</p>
        <p>Soil Type: {{ $farm->soil_type }}</p>
        <p>Address: {{ $farm->address }}</p>
    </div>
    @endif

    <div class="section">
        <h2>Seed Commitments</h2>
        <table>
            <thead>
                <tr>
                    <th>Variety</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Price</th>
                    <th>Planting Date</th>
                    <th>Cycles</th>
                    <th>Expected Buyback</th>
                </tr>
            </thead>
            <tbody>
                @foreach($seedCommitments as $item)
                <tr>
                    <td>{{ $item->seed->seed_variety }}</td>
                    <td>{{ $item->seed_quantity }}</td>
                    <td>{{ $item->unit }}</td>
                    <td>{{ $item->seed_price_at_contract }}</td>
                    <td>{{ formatDateOnly($item->planting_date) }}</td>
                    <td>{{ $item->agreed_cycles }}</td>
                    <td>{{ $item->expected_buyback_amount }} {{ $item->buyback_unit }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Partner Orders</h2>
        <table>
            <thead>
                <tr>
                    <th>Order No.</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Fulfillment %</th>
                    <th>Total Value</th>
                </tr>
            </thead>
            <tbody>
                @if(!empty($partnerOrders) && count($partnerOrders) > 0)
                    @foreach($partnerOrders as $order)
                    <tr>
                        <td>{{ $order->order_number ?? 'PO-' . $order->id }}</td>
                        <td>{{ formatDateOnly($order->order_date) }}</td>
                        <td>{{ $order->status }}</td>
                        <td>{{ round($order->getFulfillmentPercentage(), 2) }}%</td>
                        <td>{{ number_format($order->getTotalValue(), 2) }}</td>
                    </tr>
                    <tr>
                        <td colspan="5">
                            <table width="100%" style="margin:10px 0;">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Qty</th>
                                        <th>Unit</th>
                                        <th>Delivered</th>
                                        <th>Price/Unit</th>
                                        <th>Total Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($order->lines as $line)
                                    <tr>
                                        <td>{{ $line->product->seed_variety ?? $line->product->name ?? '' }}</td>
                                        <td>{{ $line->qty }}</td>
                                        <td>{{ $line->unit }}</td>
                                        <td>{{ $line->delivered_qty }}</td>
                                        <td>{{ number_format($line->price_per_unit, 2) }}</td>
                                        <td>{{ number_format($line->getTotalValue(), 2) }}</td>
                                    </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="5">No partner orders found.</td>
                    </tr>
                @endif
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Field Visits</h2>
        @if(!empty($fieldVisits) && count($fieldVisits) > 0)
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Assignee</th>
                    <th>Remarks</th>
                </tr>
            </thead>
            <tbody>
                @foreach($fieldVisits as $visit)
                <tr>
                    <td>{{ formatDateOnly($visit->date_visit) }}</td>
                    <td>{{ $visit->status }}</td>
                    <td>{{ $visit->assignee->name ?? ($visit->assignee->first_name ?? '') . ' ' . ($visit->assignee->last_name ?? '') }}</td>
                    <td>{{ $visit->remarks }}</td>
                </tr>
                <tr>
                    <td colspan="4">
                        <!-- Growth Reports -->
                        <strong>Growth Reports:</strong>
                        @if($visit->growthReports && count($visit->growthReports) > 0)
                        <table width="100%" style="margin:10px 0;">
                            <thead>
                                <tr>
                                    <th>Stage</th>
                                    <th>Status</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($visit->growthReports as $gr)
                                <tr>
                                    <td>{{ $gr->stage }}</td>
                                    <td>{{ $gr->status }}</td>
                                    <td>{{ $gr->notes }}</td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                        @else
                            <em>No growth reports recorded.</em>
                        @endif

                        <!-- Damage Reports -->
                        <strong>Damage Reports:</strong>
                        @if($visit->damageReports && count($visit->damageReports) > 0)
                        <table width="100%" style="margin:10px 0;">
                            <thead>
                                <tr>
                                    <th>Stage</th>
                                    <th>Type</th>
                                    <th>Severity</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($visit->damageReports as $dr)
                                <tr>
                                    <td>{{ $dr->stage }}</td>
                                    <td>{{ $dr->type_damage }}</td>
                                    <td>{{ $dr->severity_damage }}</td>
                                    <td>{{ $dr->notes }}</td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                        @else
                            <em>No damage reports recorded.</em>
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @else
            <div>No field visit recorded.</div>
        @endif
    </div>

    <div class="section">
        <h2>Buyback Commitments</h2>
        <table>
            <thead>
                <tr>
                    <th>Seed Variety</th>
                    <th>Expected Buyback</th>
                    <th>Unit</th>
                </tr>
            </thead>
            <tbody>
                @foreach($seedCommitments as $item)
                <tr>
                    <td>{{ $item->seed->seed_variety }}</td>
                    <td>{{ $item->expected_buyback_amount }}</td>
                    <td>{{ $item->buyback_unit }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Buyback Summary</h2>
        <table>
            <tbody>
                <tr>
                    <td>Total Expected</td>
                    <td>{{ number_format($expected_kg, 2) }} kg</td>
                </tr>
                <tr>
                    <td>Total Received</td>
                    <td>{{ number_format($actual_kg, 2) }} kg</td>
                </tr>
                <tr>
                    <td>Remaining</td>
                    <td>{{ number_format($remaining_kg, 2) }} kg</td>
                </tr>
                <tr>
                    <td>Total Value</td>
                    <td>₱{{ number_format($contract->buybackTransactions->sum('total_value'), 2) }}</td>
                </tr>
                <tr>
                    <td>Buyback Fulfillment</td>
                    <td>{{ number_format($fulfillment_percentage, 1) }}%</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Buyback Transaction History</h2>
        @if($buybackTransactions && count($buybackTransactions) > 0)
        <table>
            <thead>
                <tr>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Delivery Date</th>
                    <th>Buyback Price</th>
                    <th>Total Value</th>
                    <th>Notes</th>
                    <th>Created By</th>
                </tr>
            </thead>
            <tbody>
                @foreach($buybackTransactions as $tx)
                <tr>
                    <td>{{ number_format($tx->qty, 2) }}</td>
                    <td>{{ $tx->unit }}</td>
                    <td>{{ formatDateOnly($tx->delivery_date) }}</td>
                    <td>{{ $tx->buyback_price ? number_format($tx->buyback_price, 4) : 'N/A' }}</td>
                    <td>₱{{ $tx->total_value ? number_format($tx->total_value, 2) : 'N/A' }}</td>
                    <td>{{ $tx->notes ?? '' }}</td>
                    <td>{{ $tx->creator->name ?? ($tx->creator->first_name ?? '') . ' ' . ($tx->creator->last_name ?? '') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @else
            <div>No buyback transactions recorded.</div>
        @endif
    </div>

    <div class="section">
        <h2>Finance Summary</h2>
        <p>This summarizes the total value exchanged over the life of the contract.</p>
        <table>
            <tbody>
                <tr>
                    <td>Total Value of Goods Provided (to Partner)</td>
                    <td style="color: red; text-align: right;">
                        - ₱{{ number_format($total_outflow_value, 2) }}
                    </td>
                </tr>
                <tr>
                    <td>Total Value of Goods Received (from Partner)</td>
                    <td style="color: green; text-align: right;">
                        + ₱{{ number_format($total_inflow_value, 2) }}
                    </td>
                </tr>
                <tr style="font-weight: bold; border-top: 2px solid #333;">
                    <td>Net Balance</td>
                    <td style="text-align: right;">
                        @if($net_balance > 0)
                            <span style="color: green;">
                                ₱{{ number_format(abs($net_balance), 2) }}
                                <br><small>(Payable to Partner)</small>
                            </span>
                        @elseif($net_balance < 0)
                            <span style="color: red;">
                                - ₱{{ number_format(abs($net_balance), 2) }}
                                <br><small>(Receivable from Partner)</small>
                            </span>
                        @else
                            <span>₱0.00</span>
                        @endif
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>