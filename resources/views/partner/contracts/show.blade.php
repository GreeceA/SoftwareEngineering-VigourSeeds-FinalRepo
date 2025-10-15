@extends('layouts.app')

@section('title', 'Review Contract')

@section('content')
<div class="container py-5">
    @if(session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif
    
    <h1 class="mb-4">Contract Verification: #{{ $contract->id }} - {{ $contract->contract_name }}</h1>

    <div class="mb-4">
        <h4>Partner: {{ $contract->partner->name }}</h4>
        <p><strong>Farm Location:</strong> {{ $contract->farm->location_name ?? 'N/A' }}</p>
        <p><strong>Soil Type:</strong> {{ $contract->farm->soil_type ?? 'N/A' }}</p>
        <p><strong>Signing Date:</strong> {{ $contract->signing_date->format('M d, Y') }}</p>
        <p><strong>Committed Buyback Price:</strong> PHP {{ number_format($contract->buyback_price_per_unit, 4) }} / kg</p>
    </div>

    <div class="mb-4">
        <h4>Seed Details</h4>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Variety</th>
                    <th>Qty Sold</th>
                    <th>Planting Date</th>
                    <th>Agreed Cycles</th>
                    <th>Expected Buyback</th>
                </tr>
            </thead>
            <tbody>
                @foreach($contract->contractSeedCommitments as $item)
                <tr>
                    <td>{{ $item->seed->seed_variety }}</td>
                    <td>{{ number_format($item->seed_quantity, 2) }} {{ $item->unit }}</td>
                    <td>{{ $item->planting_date->format('M d, Y') }}</td>
                    <td>{{ $item->agreed_cycles }}</td>
                    <td>{{ number_format($item->expected_buyback_amount) }} {{ $item->buyback_unit }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="mb-4">
        <h4>Notes</h4>
        <p>{{ $contract->notes ?? 'No notes provided.' }}</p>
    </div>

    <div class="mb-4">
        <a href="{{ asset('storage/' . $contract->contract_file) }}" target="_blank" class="btn btn-success mb-2">
            View Contract File
        </a>
    </div>

    <form method="POST" action="{{ route('partner.contracts.verify', $contract->id) }}">
        @csrf
        <button type="submit" class="btn btn-primary">Verify & Confirm Contract</button>
    </form>
</div>
@endsection