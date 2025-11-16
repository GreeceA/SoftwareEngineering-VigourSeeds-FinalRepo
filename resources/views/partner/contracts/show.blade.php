@extends('layouts.app')

@section('title', 'Review Contract')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    @if(session('success'))
        <div class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-green-800 font-medium">{{ session('success') }}</span>
            </div>
        </div>
    @endif
    
    <!-- Page Header -->
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Contract Verification: #{{ $contract->id }} - {{ $contract->contract_name }}
        </h1>
        <p class="text-gray-600">Please review the contract details carefully before confirming</p>
    </div>

    <!-- Status Banner -->
    @if($contract->status === 'active')
    <div class="mb-6 bg-green-50 border-2 border-green-300 rounded-lg p-6">
        <div class="flex items-center justify-center">
            <svg class="w-12 h-12 text-green-600 mr-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <div>
                <h3 class="text-xl font-bold text-green-800">Contract Successfully Verified!</h3>
                <p class="text-green-700">This contract has been reviewed and confirmed. It is now active.</p>
            </div>
        </div>
    </div>
    @endif

    <!-- Contract Details Card -->
    <div class="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
        <div class="bg-gradient-to-r from-[#37692F] to-[#4a8a3f] px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Contract Information</h2>
        </div>
        <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Partner: {{ $contract->partner->name }}</h3>
                    <div class="space-y-3">
                        <div class="flex items-start">
                            <svg class="w-5 h-5 text-[#37692F] mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <div>
                                <p class="text-sm font-medium text-gray-700">Farm Location</p>
                                <p class="text-gray-900">{{ $contract->farm->location_name ?? 'N/A' }}</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <svg class="w-5 h-5 text-[#37692F] mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/>
                            </svg>
                            <div>
                                <p class="text-sm font-medium text-gray-700">Soil Type</p>
                                <p class="text-gray-900">{{ $contract->farm->soil_type ?? 'N/A' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-3">
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-[#37692F] mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <div>
                            <p class="text-sm font-medium text-gray-700">Signing Date</p>
                            <p class="text-gray-900">{{ $contract->signing_date->format('M d, Y') }}</p>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <svg class="w-5 h-5 text-[#37692F] mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <div>
                            <p class="text-sm font-medium text-gray-700">Committed Buyback Price</p>
                            <p class="text-gray-900 font-semibold">PHP {{ number_format($contract->buyback_price_per_unit, 4) }} / kg</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Seed Details Card -->
    <div class="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
        <div class="bg-gradient-to-r from-[#37692F] to-[#4a8a3f] px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Seed Details</h2>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Variety</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Qty Sold</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Planting Date</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Agreed Cycles</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Expected Buyback</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @foreach($contract->contractSeedCommitments as $item)
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ $item->seed->seed_variety }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ number_format($item->seed_quantity, 2) }} {{ $item->unit }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ $item->planting_date->format('M d, Y') }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ $item->agreed_cycles }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ number_format($item->expected_buyback_amount) }} {{ $item->buyback_unit }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    <!-- Notes Card -->
    @if($contract->notes)
    <div class="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
        <div class="bg-gradient-to-r from-[#37692F] to-[#4a8a3f] px-6 py-4">
            <h2 class="text-xl font-semibold text-white">Notes</h2>
        </div>
        <div class="p-6">
            <p class="text-gray-700">{{ $contract->notes }}</p>
        </div>
    </div>
    @endif

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4">
        <a href="{{ asset('storage/' . $contract->contract_file) }}" target="_blank" class="inline-flex items-center justify-center px-6 py-3 border border-[#37692F] rounded-lg text-[#37692F] bg-white hover:bg-green-50 font-medium transition-colors duration-200 shadow-sm">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            View Contract File
        </a>
        
        @if($contract->status === 'under_review')
            <form method="POST" action="{{ route('partner.contracts.verify', $contract->id) }}" class="flex-1" id="verifyForm">
                @csrf
                <button type="submit" class="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-medium transition-all duration-200 shadow-md hover:shadow-lg" id="verifyButton">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span id="buttonText">Verify & Confirm Contract</span>
                </button>
            </form>
        @else
            <div class="flex-1">
                <button disabled class="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-white bg-gray-400 cursor-not-allowed font-medium shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    Already Verified
                </button>
            </div>
        @endif
    </div>

    <script>
        document.getElementById('verifyForm')?.addEventListener('submit', function(e) {
            const button = document.getElementById('verifyButton');
            const buttonText = document.getElementById('buttonText');
            
            button.disabled = true;
            button.classList.remove('hover:from-blue-600', 'hover:to-blue-700');
            button.classList.add('opacity-75', 'cursor-not-allowed');
            buttonText.textContent = 'Processing...';
        });
    </script>
</div>
@endsection