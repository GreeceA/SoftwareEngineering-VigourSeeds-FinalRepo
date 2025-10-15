@component('mail::message')
# Contract Verification: #{{ $contract->id }} - {{ $contract->contract_name }}

Dear {{ $contract->partner->name }},

We have finalized the contract and require your formal **verification and confirmation**.

Please find the details of your commitment below. The official contract document has been separately uploaded to the portal and is ready for your verification.


---

## Contract Summary

| Detail | Value |
| :--- | :--- |
| **Partner** | {{ $contract->partner->name }} |
| **Farm Location** | {{ $contract->farm->location_name ?? 'N/A' }} |
| **Soil Type** | {{ $contract->farm->soil_type ?? 'N/A' }} |
| **Signing Date** | {{ $contract->signing_date->format('M d, Y') }} |
| **Committed Buyback Price** | **PHP {{ number_format($contract->buyback_price_per_unit, 4) }} / kg** |

---

## Seed Details

@component('mail::table')
| Variety | Qty Sold | Planting Date | Agreed Cycles | Expected Buyback |
| :--- | :--- | :--- | :--- | :--- |
@foreach($contract->contractSeedCommitments as $item)
| {{ $item->seed->seed_variety }} | {{ number_format($item->seed_quantity, 2) }} {{ $item->unit }} | {{ $item->planting_date->format('M d, Y') }} | {{ $item->agreed_cycles }} | {{ number_format($item->expected_buyback_amount) }} {{ $item->buyback_unit }} |
@endforeach
@endcomponent

**Next Step:**

@component('mail::button', ['url' => route('partner.contracts.show', $contract->id)])
Review and Verify Contract
@endcomponent

Please log into your partner portal account to view the official contract document and complete the **verification process**.

Thank you for your prompt attention.

@endcomponent
