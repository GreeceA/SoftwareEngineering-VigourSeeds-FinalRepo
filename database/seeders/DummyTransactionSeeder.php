<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DummyTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $now = Carbon::now();
        $creator_id = 1; // Assuming Admin user with ID 1 exists

        DB::table('inventory_transactions')->insert([

            // --- 5 POSITIVE ADJUSTMENTS ---

            // 1. Adjustment (Seed): Correcting physical count (found extra)
            [
                'product_type' => 'Seed', // Corrected
                'product_id' => 1, // Open-Pollinated Varieties (OPV)
                'transaction_type' => 'adjustment',
                'qty' => 50.00, // Positive adjustment
                'unit' => 'kg',
                'receipt_date' => null,
                'manufacture_date' => null,
                'expiration_date' => null,
                'contract_id' => null,
                'partner_order_id' => null,
                'notes' => 'Physical count correction - found extra stock',
                'created_by' => $creator_id,
                'created_at' => $now->copy()->subDays(10),
                'updated_at' => $now->copy()->subDays(10),
            ],


            // 3. Adjustment (Seed): Returned goods
            [
                'product_type' => 'Seed', // Corrected
                'product_id' => 7, // Golden Harvest 45
                'transaction_type' => 'adjustment',
                'qty' => 15.00, // Positive adjustment
                'unit' => 'kg',
                'receipt_date' => null,
                'manufacture_date' => null,
                'expiration_date' => null,
                'contract_id' => null,
                'partner_order_id' => null,
                'notes' => 'Returned goods from partner (undamaged)',
                'created_by' => $creator_id,
                'created_at' => $now->copy()->subDays(8),
                'updated_at' => $now->copy()->subDays(8),
            ],

            

            // 5. Adjustment (Seed): Data entry correction
            [
                'product_type' => 'Seed', // Corrected
                'product_id' => 10, // DroughtMaster Pro
                'transaction_type' => 'adjustment',
                'qty' => 100.00, // Positive adjustment
                'unit' => 'kg',
                'receipt_date' => null,
                'manufacture_date' => null,
                'expiration_date' => null,
                'contract_id' => null,
                'partner_order_id' => null,
                'notes' => 'Correction of previous data entry error',
                'created_by' => $creator_id,
                'created_at' => $now->copy()->subDays(6),
                'updated_at' => $now->copy()->subDays(6),
            ],

            // --- 6 NEGATIVE ADJUSTMENTS ---

            // 6. Adjustment (Seed): Marking stock as damaged
            [
                'product_type' => 'Seed', // Corrected
                'product_id' => 5, // Maiswerte
                'transaction_type' => 'adjustment',
                'qty' => -12.50, // Negative adjustment
                'unit' => 'kg',
                'receipt_date' => null,
                'manufacture_date' => null,
                'expiration_date' => null,
                'contract_id' => null,
                'partner_order_id' => null,
                'notes' => 'Damaged/spoiled stock - water leak in warehouse',
                'created_by' => $creator_id,
                'created_at' => $now->copy()->subDays(5),
                'updated_at' => $now->copy()->subDays(5),
            ],


            // 8. Adjustment (Seed): Physical count correction (shortage)
            [
                'product_type' => 'Seed', // Corrected
                'product_id' => 2, // KK168
                'transaction_type' => 'adjustment',
                'qty' => -7.50, // Negative adjustment
                'unit' => 'kg',
                'receipt_date' => null,
                'manufacture_date' => null,
                'expiration_date' => null,
                'contract_id' => null,
                'partner_order_id' => null,
                'notes' => 'Physical count correction - shortage found',
                'created_by' => $creator_id,
                'created_at' => $now->copy()->subDays(3),
                'updated_at' => $now->copy()->subDays(3),
            ],

           
            // 11. (From your sample) Adjustment (Seed): Damaged/spoiled stock
            [
                'product_type' => 'Seed', // Corrected
                'product_id' => 8, // Premium Yellow
                'transaction_type' => 'adjustment',
                'qty' => -50.00, // Negative adjustment
                'unit' => 'kg',
                'receipt_date' => null, // Your sample had '2025-11-18', setting to null as it's an adjustment
                'manufacture_date' => null,
                'expiration_date' => null,
                'contract_id' => null,
                'partner_order_id' => null,
                'notes' => 'Damaged/spoiled stock',
                'created_by' => $creator_id,
                'created_at' => '2025-11-18 06:48:31',
                'updated_at' => '2025-11-18 06:48:31',
            ],

        ]);
    }
}